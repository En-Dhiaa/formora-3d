'use client';

import React, { useMemo, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { PackagingObject, ViewMode, BoxSurface } from '../../types';
import { buildBoxGeometry, BOX_SURFACES } from '../../engine/geometry/BoxGeometryBuilder';
import { buildBottleGeometries } from '../../engine/geometry/BottleGeometryBuilder';
import { buildTubeGeometries } from '../../engine/geometry/TubeGeometryBuilder';
import { buildPouchGeometry } from '../../engine/geometry/PouchGeometryBuilder';
import { buildOvalBottleGeometries } from '../../engine/geometry/OvalBottleGeometryBuilder';
import { buildCustomLatheGeometry } from '../../engine/geometry/CustomLatheGeometryBuilder';
import { MaterialFactory, MATERIAL_PRESETS } from '../../engine/materials/MaterialFactory';
import { ArtworkTextureManager } from '../../engine/textures/ArtworkTextureManager';
import { calculateSurfaceDimensions } from '../../utils/dimensions';
import { generateSubstrateDataUrl } from '../../utils/proceduralTextures';

interface PackagingMeshProps {
  object: PackagingObject;
  isSelected: boolean;
  viewMode: ViewMode;
  onSelect: (id: string) => void;
}

export const PackagingMesh: React.FC<PackagingMeshProps> = ({
  object,
  isSelected,
  viewMode,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [textures, setTextures] = useState<Record<string, THREE.CanvasTexture | null>>({});

  // Surface dimensions calculation
  const surfaceDimensions = useMemo(() => {
    return calculateSurfaceDimensions(object.geometry, object.dimensionUnit);
  }, [object.geometry, object.dimensionUnit]);

  // Load and composite artwork textures when artworks or materials change
  useEffect(() => {
    let isCancelled = false;

    async function loadAllTextures() {
      const loaded: Record<string, THREE.CanvasTexture | null> = {};

      for (const [key, artwork] of Object.entries(object.surfaceArtworks)) {
        if (artwork && artwork.imageSrc) {
          const dim = surfaceDimensions.find((d) => d.key === key);
          const baseColor = object.materials.body?.color || '#ffffff';
          const tex = await ArtworkTextureManager.createSurfaceTexture(artwork, dim, baseColor, 1024);
          if (!isCancelled) {
            loaded[key] = tex;
          }
        }
      }

      if (!isCancelled) {
        setTextures(loaded);
      }
    }

    loadAllTextures();

    return () => {
      isCancelled = true;
    };
  }, [object.surfaceArtworks, object.materials.body?.color, surfaceDimensions]);

  // Memoized procedural tactile substrate bump map
  const substrateBumpTexture = useMemo(() => {
    const substrateType = object.materials.body?.substrate;
    if (!substrateType || substrateType === 'none' || typeof window === 'undefined') return null;
    const dataUrl = generateSubstrateDataUrl(substrateType, 512, 512);
    if (!dataUrl) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const img = document.createElement('img');
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      tex.needsUpdate = true;
    };
    img.src = dataUrl;

    return tex;
  }, [object.materials.body?.substrate]);

  // Box template rendering
  if (object.geometry.type === 'box') {
    const boxGeometry = useMemo(() => {
      return buildBoxGeometry(object.geometry.params as any);
    }, [object.geometry.params]);

    const boxMaterials = useMemo(() => {
      const bodyMatProps = object.materials.body || MATERIAL_PRESETS.matte_cardboard;

      if (viewMode === 'wireframe') {
        return new THREE.MeshBasicMaterial({ wireframe: true, color: 0x818cf8 });
      }
      if (viewMode === 'solid') {
        return new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
      }

      // 6 materials for right, left, top, bottom, front, back
      return BOX_SURFACES.map((surfaceKey) => {
        const tex = textures[surfaceKey] || null;
        return MaterialFactory.createMaterial(bodyMatProps, tex, substrateBumpTexture);
      });
    }, [object.materials.body, textures, viewMode, substrateBumpTexture]);

    return (
      <group
        ref={groupRef}
        position={object.transform.position}
        rotation={object.transform.rotation}
        scale={object.transform.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(object.id);
        }}
      >
        <mesh
          geometry={boxGeometry}
          material={boxMaterials}
          castShadow
          receiveShadow
        />
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[boxGeometry]} />
            <lineBasicMaterial color="#6366f1" linewidth={2} />
          </lineSegments>
        )}
      </group>
    );
  }

  // Cylinder bottle template
  if (object.geometry.type === 'cylinder_bottle') {
    const { bodyGeometry, capGeometry, neckGeometry } = useMemo(() => {
      return buildBottleGeometries(object.geometry.params as any);
    }, [object.geometry.params]);

    const bodyMat = useMemo(() => {
      if (viewMode === 'wireframe') return new THREE.MeshBasicMaterial({ wireframe: true, color: 0x818cf8 });
      if (viewMode === 'solid') return new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
      const labelTex = textures['front_label'] || textures['body'] || null;
      return MaterialFactory.createMaterial(object.materials.body || MATERIAL_PRESETS.clear_glass, labelTex, substrateBumpTexture);
    }, [object.materials.body, textures, viewMode, substrateBumpTexture]);

    const capMat = useMemo(() => {
      if (viewMode === 'wireframe') return new THREE.MeshBasicMaterial({ wireframe: true, color: 0x818cf8 });
      if (viewMode === 'solid') return new THREE.MeshStandardMaterial({ color: 0x334155 });
      return MaterialFactory.createMaterial(object.materials.cap || MATERIAL_PRESETS.glossy_plastic);
    }, [object.materials.cap, viewMode]);

    return (
      <group
        ref={groupRef}
        position={object.transform.position}
        rotation={object.transform.rotation}
        scale={object.transform.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(object.id);
        }}
      >
        <mesh geometry={bodyGeometry} material={bodyMat} castShadow receiveShadow />
        <mesh geometry={capGeometry} material={capMat} castShadow receiveShadow />
        <mesh geometry={neckGeometry} material={bodyMat} />
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[bodyGeometry]} />
            <lineBasicMaterial color="#6366f1" linewidth={2} />
          </lineSegments>
        )}
      </group>
    );
  }

  // Squeeze tube template
  if (object.geometry.type === 'squeeze_tube') {
    const { bodyGeometry, capGeometry } = useMemo(() => {
      return buildTubeGeometries(object.geometry.params as any);
    }, [object.geometry.params]);

    const tubeMat = useMemo(() => {
      if (viewMode === 'wireframe') return new THREE.MeshBasicMaterial({ wireframe: true, color: 0x818cf8 });
      if (viewMode === 'solid') return new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
      const frontTex = textures['front'] || null;
      return MaterialFactory.createMaterial(object.materials.body || MATERIAL_PRESETS.opaque_plastic, frontTex, substrateBumpTexture);
    }, [object.materials.body, textures, viewMode, substrateBumpTexture]);

    const capMat = useMemo(() => {
      return MaterialFactory.createMaterial(object.materials.cap || MATERIAL_PRESETS.glossy_plastic);
    }, [object.materials.cap]);

    return (
      <group
        ref={groupRef}
        position={object.transform.position}
        rotation={object.transform.rotation}
        scale={object.transform.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(object.id);
        }}
      >
        <mesh geometry={bodyGeometry} material={tubeMat} castShadow receiveShadow />
        <mesh geometry={capGeometry} material={capMat} castShadow receiveShadow />
      </group>
    );
  }

  // Flexible pouch template
  if (object.geometry.type === 'flexible_pouch') {
    const { geometry } = useMemo(() => {
      return buildPouchGeometry(object.geometry.params as any);
    }, [object.geometry.params]);

    const pouchMat = useMemo(() => {
      if (viewMode === 'wireframe') return new THREE.MeshBasicMaterial({ wireframe: true, color: 0x818cf8 });
      if (viewMode === 'solid') return new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
      const pouchTex = textures['front'] || null;
      return MaterialFactory.createMaterial(object.materials.body || MATERIAL_PRESETS.foil_pouch, pouchTex, substrateBumpTexture);
    }, [object.materials.body, textures, viewMode, substrateBumpTexture]);

    return (
      <group
        ref={groupRef}
        position={object.transform.position}
        rotation={object.transform.rotation}
        scale={object.transform.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(object.id);
        }}
      >
        <mesh geometry={geometry} material={pouchMat} castShadow receiveShadow />
      </group>
    );
  }

  // Oval bottle template
  if (object.geometry.type === 'oval_bottle') {
    const { bodyGeometry, capGeometry, neckGeometry } = useMemo(() => {
      return buildOvalBottleGeometries(object.geometry.params as any);
    }, [object.geometry.params]);

    const bodyMat = useMemo(() => {
      const tex = textures['front'] || null;
      return MaterialFactory.createMaterial(object.materials.body || MATERIAL_PRESETS.glossy_plastic, tex, substrateBumpTexture);
    }, [object.materials.body, textures, substrateBumpTexture]);

    const capMat = useMemo(() => {
      return MaterialFactory.createMaterial(object.materials.cap || MATERIAL_PRESETS.matte_cardboard);
    }, [object.materials.cap]);

    return (
      <group
        ref={groupRef}
        position={object.transform.position}
        rotation={object.transform.rotation}
        scale={object.transform.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(object.id);
        }}
      >
        <mesh geometry={bodyGeometry} material={bodyMat} castShadow receiveShadow />
        <mesh geometry={capGeometry} material={capMat} castShadow receiveShadow />
        <mesh geometry={neckGeometry} material={bodyMat} />
      </group>
    );
  }

  // Custom Lathe
  const { geometry } = useMemo(() => {
    return buildCustomLatheGeometry(object.geometry.params as any);
  }, [object.geometry.params]);

  const mat = useMemo(() => {
    return MaterialFactory.createMaterial(object.materials.body || MATERIAL_PRESETS.clear_glass);
  }, [object.materials.body]);

  return (
    <group
      ref={groupRef}
      position={object.transform.position}
      rotation={object.transform.rotation}
      scale={object.transform.scale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(object.id);
      }}
    >
      <mesh geometry={geometry} material={mat} castShadow receiveShadow />
    </group>
  );
};
