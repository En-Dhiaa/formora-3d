'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useProjectStore } from '../../store/useProjectStore';
import { PackagingMesh } from './PackagingMesh';
import { StudioEnvironment } from './StudioEnvironment';
import { StudioFloor } from './StudioFloor';
import { ViewportToolbar } from './ViewportToolbar';

// Native Three.js OrbitControls for React Three Fiber
function StudioOrbitControls() {
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // prevent going beneath floor
    controls.minDistance = 0.08;
    controls.maxDistance = 5.0;

    let animId: number;
    const updateLoop = () => {
      controls.update();
      animId = requestAnimationFrame(updateLoop);
    };
    animId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animId);
      controls.dispose();
    };
  }, [camera, gl]);

  return null;
}

// Scene & Camera reference bridge
function SceneController({ onSceneReady }: { onSceneReady: (scene: THREE.Scene, camera: THREE.Camera) => void }) {
  const { scene, camera } = useThree();

  useEffect(() => {
    onSceneReady(scene, camera);
  }, [scene, camera, onSceneReady]);

  return null;
}

export const ThreeCanvas: React.FC = () => {
  const {
    project,
    viewMode,
    showGrid,
    language,
    setSelectedObjectId,
  } = useProjectStore();

  const [sceneRef, setSceneRef] = useState<THREE.Scene | null>(null);
  const [cameraRef, setCameraRef] = useState<THREE.Camera | null>(null);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);

  // Check WebGL availability on mount
  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) setWebGlAvailable(false);
    } catch (e) {
      setWebGlAvailable(false);
    }
  }, []);

  const handleSceneReady = (scene: THREE.Scene, camera: THREE.Camera) => {
    setSceneRef(scene);
    setCameraRef(camera);
    if (typeof window !== 'undefined') {
      (window as any).__FORMORA_SCENE__ = scene;
      (window as any).__FORMORA_CAMERA__ = camera;
    }
  };

  if (!webGlAvailable) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-surface-50 text-white p-8 text-center">
        <div className="p-4 rounded-2xl bg-accent-rose/10 border border-accent-rose/30 max-w-md">
          <h3 className="text-xl font-bold mb-2 text-accent-rose">
            {language === 'ar' ? 'تعذر تشغيل معالج الرسوميات (WebGL)' : 'WebGL Not Available'}
          </h3>
          <p className="text-sm text-surface-400">
            {language === 'ar'
              ? 'يرجى التأكد من تمكين تسريع العتاد في متصفحك أو تحديث برامج تشغيل بطاقة الرسوميات.'
              : 'Please ensure hardware acceleration is enabled in your browser or update your graphics drivers.'}
          </p>
        </div>
      </div>
    );
  }

  const cam = project.camera;
  const bg = project.background;

  let bgStyle: React.CSSProperties = {};
  if (bg.mode === 'solid') {
    bgStyle = { backgroundColor: bg.color1 };
  } else if (bg.mode === 'gradient') {
    bgStyle = {
      background: `linear-gradient(${bg.gradientAngle}deg, ${bg.color1}, ${bg.color2})`,
    };
  } else if (bg.mode === 'transparent') {
    bgStyle = {
      backgroundImage: `radial-gradient(#272d3b 1px, transparent 1px)`,
      backgroundSize: '16px 16px',
    };
  } else {
    bgStyle = { backgroundColor: '#0d0f14' };
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none" style={bgStyle}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        }}
        camera={{
          position: cam.position,
          fov: cam.fov,
          near: 0.01,
          far: 50,
        }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedObjectId(null);
          }
        }}
      >
        <SceneController onSceneReady={handleSceneReady} />

        {/* Orbit Controls */}
        <StudioOrbitControls />

        {/* Lighting Setup */}
        <StudioEnvironment lighting={project.lighting} />

        {/* Studio Floor & Pedestal */}
        <StudioFloor
          background={project.background}
          lighting={project.lighting}
          showGrid={showGrid}
        />

        {/* Packaging Objects in Scene */}
        {project.objects.map((obj) => (
          <PackagingMesh
            key={obj.id}
            object={obj}
            isSelected={project.selectedObjectId === obj.id}
            viewMode={viewMode}
            onSelect={(id) => setSelectedObjectId(id)}
          />
        ))}
      </Canvas>

      {/* Viewport Floating Toolbar */}
      <ViewportToolbar />
    </div>
  );
};
