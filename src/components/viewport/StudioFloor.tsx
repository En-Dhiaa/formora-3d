'use client';

import React from 'react';
import * as THREE from 'three';
import { SceneBackground, StudioLighting } from '../../types';
import { ContactShadows, Grid } from '@react-three/drei';

interface StudioFloorProps {
  background: SceneBackground;
  lighting: StudioLighting;
  showGrid: boolean;
}

export const StudioFloor: React.FC<StudioFloorProps> = ({
  background,
  lighting,
  showGrid,
}) => {
  const isTransparent = background.mode === 'transparent';

  return (
    <group position={[0, 0, 0]}>
      {/* Contact Shadows on ground */}
      {lighting.contactShadows.enabled && (
        <ContactShadows
          position={[0, -0.001, 0]}
          opacity={lighting.contactShadows.opacity}
          scale={2.5}
          blur={lighting.contactShadows.blur}
          far={1.2}
          resolution={1024}
          color="#000000"
        />
      )}

      {/* Studio Floor Mesh (hidden in transparent mode) */}
      {!isTransparent && background.mode === 'studio_floor' && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.002, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial
            color={background.floorColor}
            roughness={background.floorRoughness}
            metalness={background.floorReflectivity}
          />
        </mesh>
      )}

      {/* Optional Display Pedestal */}
      {background.showPedestal && (
        <group position={[0, -0.02, 0]}>
          {background.pedestalType === 'cylinder' ? (
            <mesh receiveShadow castShadow position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.02, 48]} />
              <meshStandardMaterial
                color={background.pedestalColor}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
          ) : (
            <mesh receiveShadow castShadow position={[0, 0.01, 0]}>
              <boxGeometry args={[0.35, 0.02, 0.35]} />
              <meshStandardMaterial
                color={background.pedestalColor}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
          )}
        </group>
      )}

      {/* Subtle Studio Grid */}
      {showGrid && (
        <gridHelper
          args={[3, 30, 0x4f46e5, 0x1f242e]}
          position={[0, -0.0005, 0]}
        />
      )}
    </group>
  );
};
