'use client';

import React from 'react';
import * as THREE from 'three';
import { SceneBackground, StudioLighting } from '../../types';

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
      {/* High-quality native GPU contact shadow plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.0005, 0]}
        receiveShadow
      >
        <planeGeometry args={[4, 4]} />
        <shadowMaterial
          transparent
          opacity={lighting.shadowOpacity ?? 0.45}
        />
      </mesh>

      {/* Studio Floor Mesh (hidden in transparent mode) */}
      {!isTransparent && (background.mode === 'studio' || background.showFloor) && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.001, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial
            color={background.floorColor || '#181b22'}
            roughness={1.0 - (background.floorReflectivity ?? 0.2)}
            metalness={background.floorReflectivity ?? 0.1}
          />
        </mesh>
      )}

      {/* Optional Display Pedestal */}
      {background.pedestal?.enabled && (
        <group position={[0, 0, 0]}>
          {background.pedestal.shape === 'cylinder' ? (
            <mesh receiveShadow castShadow position={[0, (background.pedestal.height || 0.02) / 2, 0]}>
              <cylinderGeometry
                args={[
                  background.pedestal.radius || 0.15,
                  background.pedestal.radius || 0.15,
                  background.pedestal.height || 0.02,
                  48,
                ]}
              />
              <meshStandardMaterial
                color={background.pedestal.color || '#272d3b'}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
          ) : (
            <mesh receiveShadow castShadow position={[0, (background.pedestal.height || 0.02) / 2, 0]}>
              <boxGeometry
                args={[
                  (background.pedestal.radius || 0.15) * 2,
                  background.pedestal.height || 0.02,
                  (background.pedestal.radius || 0.15) * 2,
                ]}
              />
              <meshStandardMaterial
                color={background.pedestal.color || '#272d3b'}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
          )}
        </group>
      )}

      {/* Subtle Studio Grid */}
      {showGrid && (
        <gridHelper
          args={[3, 30, 0x6366f1, 0x272d3b]}
          position={[0, 0, 0]}
        />
      )}
    </group>
  );
};
