'use client';

import React from 'react';
import { StudioLighting } from '../../types';

interface StudioEnvironmentProps {
  lighting: StudioLighting;
}

export const StudioEnvironment: React.FC<StudioEnvironmentProps> = ({ lighting }) => {
  const { keyLight, fillLight, rimLight, topLight, ambientLight } = lighting;

  return (
    <>
      {/* Ambient Fill */}
      {ambientLight.enabled && (
        <ambientLight
          color={ambientLight.color}
          intensity={ambientLight.intensity}
        />
      )}

      {/* Main Key Light */}
      {keyLight.enabled && (
        <directionalLight
          position={keyLight.position}
          color={keyLight.color}
          intensity={keyLight.intensity}
          castShadow={keyLight.castShadow}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.1}
          shadow-camera-far={10}
          shadow-camera-left={-0.6}
          shadow-camera-right={0.6}
          shadow-camera-top={0.6}
          shadow-camera-bottom={-0.6}
          shadow-bias={-0.0001}
        />
      )}

      {/* Fill Light */}
      {fillLight.enabled && (
        <directionalLight
          position={fillLight.position}
          color={fillLight.color}
          intensity={fillLight.intensity}
          castShadow={fillLight.castShadow}
        />
      )}

      {/* Rim / Edge Light */}
      {rimLight.enabled && (
        <directionalLight
          position={rimLight.position}
          color={rimLight.color}
          intensity={rimLight.intensity}
          castShadow={false}
        />
      )}

      {/* Top Overhead Softbox Light */}
      {topLight.enabled && (
        <directionalLight
          position={topLight.position}
          color={topLight.color}
          intensity={topLight.intensity}
          castShadow={topLight.castShadow}
        />
      )}
    </>
  );
};
