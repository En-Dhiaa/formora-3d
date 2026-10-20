'use client';

import React from 'react';
import {
  Sparkles,
  Palette,
  Box,
  Grid3X3,
  Move,
  RotateCw,
  Maximize2,
  Camera,
  Compass,
  Eye,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { CameraPresetType } from '../../types';

export const ViewportToolbar: React.FC = () => {
  const {
    language,
    viewMode,
    setViewMode,
    transformMode,
    setTransformMode,
    showGrid,
    setShowGrid,
    updateCamera,
  } = useProjectStore();

  const t = translations[language];

  const handleCameraPreset = (preset: CameraPresetType) => {
    switch (preset) {
      case 'front':
        updateCamera({ preset: 'front', position: [0, 0.08, 0.65], target: [0, 0.08, 0] });
        break;
      case 'three_quarter_front':
        updateCamera({
          preset: 'three_quarter_front',
          position: [0.45, 0.35, 0.75],
          target: [0, 0.04, 0],
        });
        break;
      case 'top':
        updateCamera({ preset: 'top', position: [0, 0.9, 0.01], target: [0, 0, 0] });
        break;
      case 'low_angle_hero':
        updateCamera({
          preset: 'low_angle_hero',
          position: [0.35, 0.08, 0.6],
          target: [0, 0.12, 0],
        });
        break;
      case 'catalog':
        updateCamera({
          preset: 'catalog',
          position: [0.25, 0.2, 0.7],
          target: [0, 0.06, 0],
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 bg-surface-100/85 backdrop-blur-md border border-surface-300/40 rounded-2xl shadow-glass text-xs">
      {/* View Modes */}
      <div className="flex items-center gap-1 bg-surface-50/70 p-1 rounded-xl border border-surface-300/20">
        <button
          onClick={() => setViewMode('rendered')}
          title={t.viewport.rendered}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            viewMode === 'rendered'
              ? 'bg-brand-600 text-white shadow-glow font-medium'
              : 'text-surface-400 hover:text-white hover:bg-surface-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === 'ar' ? 'واقعي' : 'Render'}
          </span>
        </button>

        <button
          onClick={() => setViewMode('material')}
          title={t.viewport.material}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            viewMode === 'material'
              ? 'bg-brand-600 text-white shadow-glow font-medium'
              : 'text-surface-400 hover:text-white hover:bg-surface-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === 'ar' ? 'خامات' : 'Material'}
          </span>
        </button>

        <button
          onClick={() => setViewMode('solid')}
          title={t.viewport.solid}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            viewMode === 'solid'
              ? 'bg-brand-600 text-white shadow-glow font-medium'
              : 'text-surface-400 hover:text-white hover:bg-surface-200'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === 'ar' ? 'صلب' : 'Solid'}
          </span>
        </button>

        <button
          onClick={() => setViewMode('wireframe')}
          title={t.viewport.wireframe}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            viewMode === 'wireframe'
              ? 'bg-brand-600 text-white shadow-glow font-medium'
              : 'text-surface-400 hover:text-white hover:bg-surface-200'
          }`}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === 'ar' ? 'شبكي' : 'Wire'}
          </span>
        </button>
      </div>

      <div className="w-[1px] h-5 bg-surface-300/40 mx-0.5" />

      {/* Transform Modes */}
      <div className="flex items-center gap-1 bg-surface-50/70 p-1 rounded-xl border border-surface-300/20">
        <button
          onClick={() => setTransformMode(transformMode === 'translate' ? null : 'translate')}
          title={t.viewport.translate}
          className={`p-1.5 rounded-lg transition-all ${
            transformMode === 'translate'
              ? 'bg-brand-600 text-white shadow-glow'
              : 'text-surface-400 hover:text-white hover:bg-surface-200'
          }`}
        >
          <Move className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setTransformMode(transformMode === 'rotate' ? null : 'rotate')}
          title={t.viewport.rotate}
          className={`p-1.5 rounded-lg transition-all ${
            transformMode === 'rotate'
              ? 'bg-brand-600 text-white shadow-glow'
              : 'text-surface-400 hover:text-white hover:bg-surface-200'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setTransformMode(transformMode === 'scale' ? null : 'scale')}
          title={t.viewport.scale}
          className={`p-1.5 rounded-lg transition-all ${
            transformMode === 'scale'
              ? 'bg-brand-600 text-white shadow-glow'
              : 'text-surface-400 hover:text-white hover:bg-surface-200'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-[1px] h-5 bg-surface-300/40 mx-0.5" />

      {/* Camera Presets Shortcut */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleCameraPreset('front')}
          title={t.camera.front}
          className="px-2 py-1 text-surface-400 hover:text-white hover:bg-surface-200 rounded-lg transition-all"
        >
          {language === 'ar' ? 'أمامي' : 'Front'}
        </button>
        <button
          onClick={() => handleCameraPreset('three_quarter_front')}
          title={t.camera.threeQuarterFront}
          className="px-2 py-1 text-surface-400 hover:text-white hover:bg-surface-200 rounded-lg transition-all"
        >
          3/4
        </button>
        <button
          onClick={() => handleCameraPreset('top')}
          title={t.camera.top}
          className="px-2 py-1 text-surface-400 hover:text-white hover:bg-surface-200 rounded-lg transition-all"
        >
          {language === 'ar' ? 'علوي' : 'Top'}
        </button>
        <button
          onClick={() => handleCameraPreset('low_angle_hero')}
          title={t.camera.lowAngleHero}
          className="px-2 py-1 text-surface-400 hover:text-white hover:bg-surface-200 rounded-lg transition-all"
        >
          {language === 'ar' ? 'بطولي' : 'Hero'}
        </button>
      </div>

      <div className="w-[1px] h-5 bg-surface-300/40 mx-0.5" />

      {/* Toggle Grid */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        title={t.viewport.gridToggle}
        className={`p-1.5 rounded-lg transition-all ${
          showGrid
            ? 'bg-surface-200 text-brand-400'
            : 'text-surface-400 hover:text-white hover:bg-surface-200'
        }`}
      >
        <Grid3X3 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
