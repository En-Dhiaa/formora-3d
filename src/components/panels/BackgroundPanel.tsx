'use client';

import React from 'react';
import {
  Square,
  Sparkles,
  Grid,
  Layers,
  Palette,
  Eye,
  Box,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { SceneBackground } from '../../types';

export const BackgroundPanel: React.FC = () => {
  const { project, language, showGrid, setShowGrid, updateBackground } = useProjectStore();
  const t = translations[language];
  const { background } = project;

  const bgModes: Array<{
    mode: SceneBackground['mode'];
    labelAr: string;
    labelEn: string;
  }> = [
    { mode: 'solid', labelAr: 'لون أحادي', labelEn: 'Solid Color' },
    { mode: 'gradient', labelAr: 'تدرج لوني', labelEn: 'Gradient' },
    { mode: 'transparent', labelAr: 'شفاف تماماً', labelEn: 'Transparent (PNG)' },
    { mode: 'studio', labelAr: 'أرضية استوديو', labelEn: 'Studio Floor' },
  ];

  return (
    <div className="space-y-6">
      {/* Background Mode Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
          {language === 'ar' ? 'نمط خلفية المشهد' : 'Background Mode'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {bgModes.map((m) => {
            const isSelected = background.mode === m.mode;
            return (
              <button
                key={m.mode}
                onClick={() => updateBackground({ mode: m.mode })}
                className={`p-2.5 rounded-xl border text-left rtl:text-right text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500 text-white shadow-glow'
                    : 'bg-surface-50 border-surface-300/30 text-surface-400 hover:text-white hover:bg-surface-100'
                }`}
              >
                {language === 'ar' ? m.labelAr : m.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Solid Color Config */}
      {background.mode === 'solid' && (
        <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-3">
          <span className="text-xs font-bold text-white block">
            {language === 'ar' ? 'لون الخلفية الموحد' : 'Solid Background Color'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xs text-surface-400">{language === 'ar' ? 'اللون' : 'Color'}</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={background.color1}
                onChange={(e) => updateBackground({ color1: e.target.value })}
                className="w-7 h-7 rounded border border-surface-300/30 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={background.color1}
                onChange={(e) => updateBackground({ color1: e.target.value })}
                className="w-20 bg-surface-100 border border-surface-300/40 rounded-lg px-2 py-1 text-xs text-white font-mono uppercase outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Gradient Config */}
      {background.mode === 'gradient' && (
        <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-3">
          <span className="text-xs font-bold text-white block">
            {language === 'ar' ? 'إعدادات التدرج اللوني' : 'Gradient Settings'}
          </span>

          <div className="flex items-center justify-between">
            <span className="text-xs text-surface-400">{language === 'ar' ? 'اللون الأول (البداية)' : 'Start Color'}</span>
            <input
              type="color"
              value={background.color1}
              onChange={(e) => updateBackground({ color1: e.target.value })}
              className="w-7 h-7 rounded border border-surface-300/30 bg-transparent cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-surface-400">{language === 'ar' ? 'اللون الثاني (النهاية)' : 'End Color'}</span>
            <input
              type="color"
              value={background.color2}
              onChange={(e) => updateBackground({ color2: e.target.value })}
              className="w-7 h-7 rounded border border-surface-300/30 bg-transparent cursor-pointer"
            />
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-surface-400">
              <span>{language === 'ar' ? 'زاوية التدرج' : 'Angle'}</span>
              <span className="font-mono text-white">{background.gradientAngle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={background.gradientAngle}
              onChange={(e) => updateBackground({ gradientAngle: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Studio Floor & Pedestal Settings */}
      <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-4">
        <span className="text-xs font-bold text-white block">
          {language === 'ar' ? 'إعدادات أرضية الاستوديو' : 'Floor & Ground Plane'}
        </span>

        {/* Floor Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-surface-400">{language === 'ar' ? 'إظهار أرضية الاستوديو' : 'Show Studio Floor'}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={background.showFloor}
              onChange={(e) => updateBackground({ showFloor: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>

        {/* Floor Reflectivity */}
        {background.showFloor && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-surface-400">{language === 'ar' ? 'لون الأرضية' : 'Floor Color'}</span>
              <input
                type="color"
                value={background.floorColor}
                onChange={(e) => updateBackground({ floorColor: e.target.value })}
                className="w-6 h-6 rounded border border-surface-300/30 bg-transparent cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-surface-400">
                <span>{language === 'ar' ? 'لمعان وانعكاس الأرضية' : 'Floor Reflectivity'}</span>
                <span className="font-mono text-white">{(background.floorReflectivity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={background.floorReflectivity}
                onChange={(e) => updateBackground({ floorReflectivity: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Display Pedestal Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-300/20">
          <span className="text-xs text-surface-400">{language === 'ar' ? 'منصة عرض للمنتج (Pedestal)' : 'Product Pedestal Stand'}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={background.pedestal?.enabled ?? false}
              onChange={(e) =>
                updateBackground({
                  pedestal: {
                    enabled: e.target.checked,
                    shape: background.pedestal?.shape || 'cylinder',
                    radius: background.pedestal?.radius || 0.12,
                    height: background.pedestal?.height || 0.02,
                    color: background.pedestal?.color || '#1e2430',
                  },
                })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>

        {/* Viewport Grid Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-300/20">
          <span className="text-xs text-surface-400">{language === 'ar' ? 'شبكة المحاذاة الإرشادية' : 'Show Viewport Grid'}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
