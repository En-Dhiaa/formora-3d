'use client';

import React from 'react';
import {
  Camera,
  Compass,
  Maximize,
  RotateCcw,
  Sliders,
  Crosshair,
  Eye,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { DEFAULT_CAMERA } from '../../utils/sampleData';

export const CameraPanel: React.FC = () => {
  const { project, language, updateCamera } = useProjectStore();
  const t = translations[language];
  const { camera } = project;

  // Camera presets
  const presets = [
    {
      nameAr: 'واجهة أمامية مستقيمة',
      nameEn: 'Front Ortho-Look',
      position: [0, 0.08, 0.45] as [number, number, number],
      fov: 35,
    },
    {
      nameAr: 'زاوية بطل 3/4 (Hero View)',
      nameEn: '3/4 Perspective Hero',
      position: [0.28, 0.22, 0.35] as [number, number, number],
      fov: 42,
    },
    {
      nameAr: 'منظور جانبي (Side)',
      nameEn: 'Side Profile',
      position: [0.45, 0.08, 0] as [number, number, number],
      fov: 35,
    },
    {
      nameAr: 'مسقط رأسي علوي (Flatlay)',
      nameEn: 'Top-Down Flat Lay',
      position: [0, 0.55, 0.01] as [number, number, number],
      fov: 40,
    },
    {
      nameAr: 'زاوية سفلية دراماتيكية',
      nameEn: 'Low Angle Dramatic',
      position: [0.22, 0.04, 0.32] as [number, number, number],
      fov: 48,
    },
    {
      nameAr: 'لقطة كتالوج احترافية',
      nameEn: 'Catalog Commercial',
      position: [0.18, 0.14, 0.38] as [number, number, number],
      fov: 38,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Camera View Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
          {language === 'ar' ? 'زوايا الكاميرا والتصوير' : 'Camera Angle Presets'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p.nameEn}
              onClick={() =>
                updateCamera({
                  position: p.position,
                  fov: p.fov,
                  target: [0, 0.08, 0],
                })
              }
              className="p-3 rounded-xl bg-surface-50 hover:bg-surface-100 border border-surface-300/30 text-surface-400 hover:text-white text-left rtl:text-right transition-all group flex flex-col justify-between h-16"
            >
              <span className="text-xs font-semibold text-white group-hover:text-brand-400 truncate">
                {language === 'ar' ? p.nameAr : p.nameEn}
              </span>
              <span className="text-[10px] text-surface-400 font-mono">
                FOV {p.fov}°
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Camera Projection & FOV Controls */}
      <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-white">
          <span className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-brand-400" />
            {language === 'ar' ? 'نوع الكاميرا والعدسة' : 'Projection & Optics'}
          </span>
          <span className="font-mono text-brand-400">
            {camera.fov}°
          </span>
        </div>

        {/* Projection Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-surface-100 p-1 rounded-xl border border-surface-300/30">
          <button
            onClick={() => updateCamera({ mode: 'perspective' })}
            className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
              camera.mode === 'perspective'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-surface-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'منظوري (Perspective)' : 'Perspective'}
          </button>
          <button
            onClick={() => updateCamera({ mode: 'orthographic' })}
            className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
              camera.mode === 'orthographic'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-surface-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'إسقاطي (Orthographic)' : 'Orthographic'}
          </button>
        </div>

        {/* Commercial Studio Lens Presets (Blender-level camera optics) */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-medium text-surface-400">
            {language === 'ar' ? 'عدسات التصوير التجاري (Lens Focal Length)' : 'Commercial Lens Presets'}
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { mm: '35mm', fov: 54, label: 'Wide' },
              { mm: '50mm', fov: 40, label: 'Standard' },
              { mm: '85mm', fov: 24, label: 'Portrait' },
              { mm: '105mm', fov: 19, label: 'Macro' },
            ].map((lens) => (
              <button
                key={lens.mm}
                onClick={() => updateCamera({ fov: lens.fov })}
                className={`py-1.5 px-1 rounded-xl text-center border transition-all ${
                  Math.abs(camera.fov - lens.fov) <= 2
                    ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                    : 'bg-surface-100 border-surface-300/30 text-surface-300 hover:text-white hover:bg-surface-200'
                }`}
              >
                <span className="block text-[11px] font-bold font-mono">{lens.mm}</span>
                <span className="block text-[9px] text-surface-400 truncate">{lens.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Field of View Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-surface-400">
            <span>{language === 'ar' ? 'البعد البؤري / زاوية الرؤية (FOV)' : 'Field of View (FOV)'}</span>
            <span className="font-mono text-white">{camera.fov}°</span>
          </div>
          <input
            type="range"
            min="15"
            max="80"
            step="1"
            value={camera.fov}
            onChange={(e) => updateCamera({ fov: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Exposure Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-surface-400">
            <span>{language === 'ar' ? 'التعريض الضوئي (Exposure)' : 'Sensor Exposure'}</span>
            <span className="font-mono text-white">{camera.exposure.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={camera.exposure}
            onChange={(e) => updateCamera({ exposure: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      {/* Reset Camera Actions */}
      <button
        onClick={() => updateCamera({ ...DEFAULT_CAMERA })}
        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-surface-100 hover:bg-surface-200 border border-surface-300/30 text-surface-400 hover:text-white text-xs font-medium transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{language === 'ar' ? 'إعادة ضبط الكاميرا الافتراضية' : 'Reset Camera to Default'}</span>
      </button>
    </div>
  );
};
