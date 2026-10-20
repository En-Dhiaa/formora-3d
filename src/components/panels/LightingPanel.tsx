'use client';

import React from 'react';
import {
  Sun,
  Lightbulb,
  Sparkles,
  Sliders,
  Eye,
  Layers,
  Zap,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { StudioLighting } from '../../types';

export const LightingPanel: React.FC = () => {
  const { project, language, updateLighting } = useProjectStore();
  const t = translations[language];
  const { lighting } = project;

  // Studio lighting presets
  const presets: Array<{
    nameAr: string;
    nameEn: string;
    icon: string;
    config: Partial<StudioLighting>;
  }> = [
    {
      nameAr: 'استوديو تجاري ناعم',
      nameEn: 'Soft Commercial Studio',
      icon: '✨',
      config: {
        preset: 'studio_soft',
        ambientIntensity: 0.7,
        keyLight: {
          enabled: true,
          color: '#ffffff',
          intensity: 1.4,
          position: [1.8, 2.5, 2.0],
          castShadow: true,
        },
        fillLight: {
          enabled: true,
          color: '#f8fafc',
          intensity: 0.8,
          position: [-1.8, 1.5, 1.5],
        },
        rimLight: {
          enabled: true,
          color: '#818cf8',
          intensity: 1.1,
          position: [0, 2.5, -2.5],
        },
        shadowSoftness: 0.85,
        shadowOpacity: 0.45,
      },
    },
    {
      nameAr: 'إضاءة طبية ودوائية ساطعة',
      nameEn: 'Bright Medical Laboratory',
      icon: '🩺',
      config: {
        preset: 'medical_bright',
        ambientIntensity: 1.1,
        keyLight: {
          enabled: true,
          color: '#ffffff',
          intensity: 1.8,
          position: [1.2, 3.0, 1.8],
          castShadow: true,
        },
        fillLight: {
          enabled: true,
          color: '#e0f2fe',
          intensity: 1.2,
          position: [-1.5, 2.0, 1.5],
        },
        rimLight: {
          enabled: true,
          color: '#ffffff',
          intensity: 0.9,
          position: [0, 2.2, -2.0],
        },
        shadowSoftness: 0.95,
        shadowOpacity: 0.25,
      },
    },
    {
      nameAr: 'إضاءة تجميل دراماتيكية',
      nameEn: 'Luxury Cosmetic Studio',
      icon: '💄',
      config: {
        preset: 'cosmetic_luxury',
        ambientIntensity: 0.4,
        keyLight: {
          enabled: true,
          color: '#fef3c7',
          intensity: 2.0,
          position: [2.0, 1.8, 1.5],
          castShadow: true,
        },
        fillLight: {
          enabled: true,
          color: '#fdf2f8',
          intensity: 0.6,
          position: [-2.0, 1.0, 1.0],
        },
        rimLight: {
          enabled: true,
          color: '#f59e0b',
          intensity: 1.8,
          position: [-1.2, 2.5, -2.0],
        },
        shadowSoftness: 0.6,
        shadowOpacity: 0.65,
      },
    },
    {
      nameAr: 'متجر إلكتروني ناصع (E-Com)',
      nameEn: 'Clean E-Commerce',
      icon: '🛒',
      config: {
        preset: 'ecommerce_clean',
        ambientIntensity: 0.9,
        keyLight: {
          enabled: true,
          color: '#ffffff',
          intensity: 1.5,
          position: [1.5, 2.8, 2.2],
          castShadow: true,
        },
        fillLight: {
          enabled: true,
          color: '#f1f5f9',
          intensity: 1.0,
          position: [-1.5, 2.0, 1.8],
        },
        rimLight: {
          enabled: false,
          color: '#ffffff',
          intensity: 0.5,
          position: [0, 2, -2],
        },
        shadowSoftness: 0.9,
        shadowOpacity: 0.35,
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Studio Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
          {language === 'ar' ? 'أنماط الاستوديو الجاهزة' : 'Studio Setups'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => {
            const isSelected = lighting.preset === p.config.preset;
            return (
              <button
                key={p.nameEn}
                onClick={() => updateLighting(p.config)}
                className={`p-3 rounded-xl border text-left rtl:text-right transition-all flex flex-col justify-between h-20 ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500 text-white shadow-glow'
                    : 'bg-surface-50 border-surface-300/30 text-surface-400 hover:text-white hover:bg-surface-100'
                }`}
              >
                <span className="text-lg">{p.icon}</span>
                <span className="text-xs font-semibold leading-tight line-clamp-2">
                  {language === 'ar' ? p.nameAr : p.nameEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ambient & Environment Intensity */}
      <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-white">
          <span className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-accent-gold" />
            {language === 'ar' ? 'الإضاءة العامة والبيئة' : 'Ambient & Environment'}
          </span>
          <span className="font-mono text-brand-400">
            {lighting.ambientIntensity.toFixed(2)}x
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-surface-400">
            <span>{language === 'ar' ? 'شدة الإضاءة المحيطة' : 'Ambient Intensity'}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.5"
            step="0.05"
            value={lighting.ambientIntensity}
            onChange={(e) => updateLighting({ ambientIntensity: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      {/* Main Key Light */}
      <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent-gold" />
            <div>
              <span className="text-xs font-bold text-white block">
                {language === 'ar' ? 'الضوء الرئيسي (Key Light)' : 'Main Key Light'}
              </span>
              <span className="text-[10px] text-surface-400 font-mono">
                {language === 'ar' ? 'مصدر الظل الأساسي' : 'Primary Shadow Caster'}
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={lighting.keyLight.enabled}
              onChange={(e) =>
                updateLighting({
                  keyLight: { ...lighting.keyLight, enabled: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>

        {lighting.keyLight.enabled && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-400">{language === 'ar' ? 'لون الإضاءة' : 'Light Color'}</span>
              <input
                type="color"
                value={lighting.keyLight.color}
                onChange={(e) =>
                  updateLighting({
                    keyLight: { ...lighting.keyLight, color: e.target.value },
                  })
                }
                className="w-6 h-6 rounded border border-surface-300/30 bg-transparent cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-surface-400">
                <span>{language === 'ar' ? 'الشدة والسطوع' : 'Intensity'}</span>
                <span className="font-mono text-white">{lighting.keyLight.intensity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="4.0"
                step="0.1"
                value={lighting.keyLight.intensity}
                onChange={(e) =>
                  updateLighting({
                    keyLight: { ...lighting.keyLight, intensity: Number(e.target.value) },
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Fill Light */}
      <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-cyan" />
            <div>
              <span className="text-xs font-bold text-white block">
                {language === 'ar' ? 'ضوء التعبئة (Fill Light)' : 'Fill Light'}
              </span>
              <span className="text-[10px] text-surface-400 font-mono">
                {language === 'ar' ? 'لتخفيف حدة الظلال' : 'Softens harsh contrast'}
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={lighting.fillLight.enabled}
              onChange={(e) =>
                updateLighting({
                  fillLight: { ...lighting.fillLight, enabled: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>

        {lighting.fillLight.enabled && (
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-surface-400">
              <span>{language === 'ar' ? 'الشدة' : 'Intensity'}</span>
              <span className="font-mono text-white">{lighting.fillLight.intensity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={lighting.fillLight.intensity}
              onChange={(e) =>
                updateLighting({
                  fillLight: { ...lighting.fillLight, intensity: Number(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Rim Light */}
      <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <div>
              <span className="text-xs font-bold text-white block">
                {language === 'ar' ? 'إضاءة الحواف (Rim Light)' : 'Rim / Back Light'}
              </span>
              <span className="text-[10px] text-surface-400 font-mono">
                {language === 'ar' ? 'تحديد حواف المنتج' : 'Separates object from background'}
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={lighting.rimLight.enabled}
              onChange={(e) =>
                updateLighting({
                  rimLight: { ...lighting.rimLight, enabled: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>

        {lighting.rimLight.enabled && (
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-surface-400">
              <span>{language === 'ar' ? 'الشدة' : 'Intensity'}</span>
              <span className="font-mono text-white">{lighting.rimLight.intensity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.5"
              step="0.1"
              value={lighting.rimLight.intensity}
              onChange={(e) =>
                updateLighting({
                  rimLight: { ...lighting.rimLight, intensity: Number(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Shadow Softness & Contact Opacity */}
      <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-3">
        <span className="text-xs font-bold text-white block">
          {language === 'ar' ? 'نعومة وعتمة الظلال' : 'Shadow Properties'}
        </span>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-surface-400">
            <span>{language === 'ar' ? 'نعومة الظل' : 'Softness'}</span>
            <span className="font-mono text-white">{(lighting.shadowSoftness * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={lighting.shadowSoftness}
            onChange={(e) => updateLighting({ shadowSoftness: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-surface-400">
            <span>{language === 'ar' ? 'عتمة ظل الملامسة' : 'Contact Shadow Opacity'}</span>
            <span className="font-mono text-white">{(lighting.shadowOpacity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={lighting.shadowOpacity}
            onChange={(e) => updateLighting({ shadowOpacity: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
