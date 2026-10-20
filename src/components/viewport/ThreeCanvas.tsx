'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { useProjectStore } from '../../store/useProjectStore';
import { PackagingMesh } from './PackagingMesh';
import { StudioEnvironment } from './StudioEnvironment';
import { StudioFloor } from './StudioFloor';
import { ViewportToolbar } from './ViewportToolbar';

// Component inside Canvas to sync camera & scene reference
function SceneController({ onSceneReady }: { onSceneReady: (scene: THREE.Scene, camera: THREE.Camera) => void }) {
  const { scene, camera } = useThree();

  useEffect(() => {
    onSceneReady(scene, camera);
  }, [scene, camera, onSceneReady]);

  return null;
}

// Transform gizmo controller attached to selected object
function TransformGizmoManager({
  selectedId,
  mode,
  onTransformChange,
}: {
  selectedId: string | null;
  mode: 'translate' | 'rotate' | 'scale' | null;
  onTransformChange: (pos: [number, number, number], rot: [number, number, number], scale: [number, number, number]) => void;
}) {
  const { scene } = useThree();
  const [targetObject, setTargetObject] = useState<THREE.Object3D | null>(null);
  const transformRef = useRef<any>(null);

  useEffect(() => {
    if (!selectedId || !mode) {
      setTargetObject(null);
      return;
    }

    // Find the group corresponding to selected object
    let found: THREE.Object3D | null = null;
    scene.traverse((child) => {
      if (child instanceof THREE.Group && child.position && !found) {
        // Child group
      }
    });
  }, [selectedId, mode, scene]);

  if (!mode || !selectedId) return null;

  return null;
}

export const ThreeCanvas: React.FC = () => {
  const {
    project,
    viewMode,
    transformMode,
    showGrid,
    language,
    setSelectedObjectId,
    updateObjectTransform,
  } = useProjectStore();

  const [sceneRef, setSceneRef] = useState<THREE.Scene | null>(null);
  const [cameraRef, setCameraRef] = useState<THREE.Camera | null>(null);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);

  // Check WebGL support on mount
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
    // Expose scene to window for high-res render access
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

  // Camera settings
  const cam = project.camera;
  const isOrtho = cam.mode === 'orthographic';

  // Background styling
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
    bgStyle = { backgroundColor: '#0b0d13' };
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
          // If clicked directly on canvas background, deselect object
          if (e.target === e.currentTarget) {
            setSelectedObjectId(null);
          }
        }}
      >
        <SceneController onSceneReady={handleSceneReady} />

        {/* Orbit Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 + 0.05} // prevent going below floor
          minDistance={0.1}
          maxDistance={4.0}
        />

        {/* Lighting Setup */}
        <StudioEnvironment lighting={project.lighting} />

        {/* Studio Floor & Pedestal */}
        <StudioFloor
          background={project.background}
          lighting={project.lighting}
          showGrid={showGrid}
        />

        {/* Packaging Objects */}
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

      {/* Floating Viewport Toolbar */}
      <ViewportToolbar />
    </div>
  );
};
