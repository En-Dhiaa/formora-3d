'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Droplet,
  Layers,
  CircleDot,
  Check,
  Palette,
  Shield,
  Eye,
  Sun,
  Flame,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { MaterialProperties } from '../../types';
import { MATERIAL_PRESETS } from '../../engine/materials/MaterialFactory';

export const MaterialsPanel: React.FC = () => {
  const { project, language, updateObjectMaterial } = useProjectStore();
  const t = translations[language];

  const selectedObject = project.objects.find((o) => o.id === project.selectedObjectId);
  const [activePart, setActivePart] = useState<'body' | 'cap' | 'label' | 'seal'>('body');

  if (!selectedObject) {
    return (
      <div className="p-6 text-center text-surface-400">
        <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40 text-brand-400" />
        <p className="text-sm font-medium">
          {language === 'ar' ? 'حدد مجسماً لتخصيص الخامات والمواد' : 'Select an object to customize materials'}
        </p>
      </div>
    );
  }

  const currentPartMaterial: MaterialProperties =
    selectedObject.materials[activePart] || MATERIAL_PRESETS.matte_cardboard;

  const handlePropChange = (key: keyof MaterialProperties, value: any) => {
    updateObjectMaterial(selectedObject.id, activePart, { [key]: value });
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = MATERIAL_PRESETS[presetKey];
    if (preset) {
      updateObjectMaterial(selectedObject.id, activePart, { ...preset });
    }
  };

  // Determine available parts for current object
  const hasCap =
    selectedObject.geometry.type === 'cylinder_bottle' ||
    selectedObject.geometry.type === 'squeeze_tube' ||
    selectedObject.geometry.type === 'oval_bottle';

  const partsList: Array<{ key: 'body' | 'cap' | 'label' | 'seal'; labelAr: string; labelEn: string }> = [
    { key: 'body', labelAr: 'جسم العبوة الرئيسي', labelEn: 'Main Body' },
  ];

  if (hasCap) {
    partsList.push({ key: 'cap', labelAr: 'الغطاء', labelEn: 'Cap / Closure' });
  }

  if (selectedObject.geometry.type === 'cylinder_bottle') {
    partsList.push({ key: 'label', labelAr: 'خامة الملصق', labelEn: 'Label Material' });
  }

  if (selectedObject.geometry.type === 'flexible_pouch') {
    partsList.push({ key: 'seal', labelAr: 'شريط اللحام', labelEn: 'Seal Edge' });
  }

  // Predefined material presets for cards
  const presetCards = [
    { key: 'matte_cardboard', labelAr: 'كرتون غير لامع (Matte)', labelEn: 'Matte Cardboard', color: '#f1f5f9' },
    { key: 'glossy_cardboard', labelAr: 'كرتون لامع (Gloss)', labelEn: 'Glossy Cardboard', color: '#ffffff' },
    { key: 'clear_glass', labelAr: 'زجاج شفاف كريستالي', labelEn: 'Clear Glass', color: '#e0f2fe' },
    { key: 'amber_glass', labelAr: 'زجاج دوائي كهرماني', labelEn: 'Amber Glass', color: '#b45309' },
    { key: 'frosted_glass', labelAr: 'زجاج مصنفر ضبابي', labelEn: 'Frosted Glass', color: '#cbd5e1' },
    { key: 'opaque_plastic', labelAr: 'بلاستيك معتم (PET/HDPE)', labelEn: 'Opaque Plastic', color: '#f8fafc' },
    { key: 'glossy_plastic', labelAr: 'بلاستيك لامع فاخر', labelEn: 'Glossy Plastic', color: '#6366f1' },
    { key: 'brushed_metal', labelAr: 'ألومنيوم مصقول', labelEn: 'Brushed Aluminum', color: '#94a3b8' },
    { key: 'gold_foil', labelAr: 'طلاء ذهبي براق', labelEn: 'Gold Foil / Chrome', color: '#eab308' },
    { key: 'foil_pouch', labelAr: 'أكياس رقائق معدنية (Foil)', labelEn: 'Metallic Foil', color: '#475569' },
    { key: 'rubber_matte', labelAr: 'مطاط ناعم الملمس', labelEn: 'Soft-Touch Matte', color: '#1e293b' },
  ];

  return (
    <div className="space-y-6">
      {/* Component Part Selector Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
          {language === 'ar' ? 'الجزء المستهدف للتعديل' : 'Component Part'}
        </label>
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-50 border border-surface-300/30">
          {partsList.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePart(p.key)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activePart === p.key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              {language === 'ar' ? p.labelAr : p.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Material Presets Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
          {language === 'ar' ? 'مكتبة الخامات الاحترافية' : 'Material Presets'}
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
          {presetCards.map((preset) => {
            const isCurrentPreset =
              Math.abs(currentPartMaterial.roughness - (MATERIAL_PRESETS[preset.key]?.roughness ?? 0.5)) < 0.05 &&
              Math.abs(currentPartMaterial.metalness - (MATERIAL_PRESETS[preset.key]?.metalness ?? 0.0)) < 0.05;

            return (
              <button
                key={preset.key}
                onClick={() => handleApplyPreset(preset.key)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left rtl:text-right transition-all group ${
                  isCurrentPreset
                    ? 'bg-brand-500/10 border-brand-500 text-white shadow-glow'
                    : 'bg-surface-50 border-surface-300/30 text-surface-400 hover:text-white hover:bg-surface-100'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border border-surface-300/40 flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: preset.color }}
                />
                <span className="text-[11px] font-semibold truncate block">
                  {language === 'ar' ? preset.labelAr : preset.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fine-Tuning Physical Properties */}
      <div className="space-y-4 p-4 rounded-2xl bg-surface-50 border border-surface-300/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-brand-400" />
            {language === 'ar' ? 'خصائص الخامة الفيزيائية' : 'Physical Shader Properties'}
          </span>
          <span className="text-[10px] text-surface-400 font-mono">PBR Metal-Rough</span>
        </div>

        {/* Base Color Picker */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-surface-400">{language === 'ar' ? 'اللون الأساسي' : 'Base Color'}</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentPartMaterial.color}
              onChange={(e) => handlePropChange('color', e.target.value)}
              className="w-7 h-7 rounded-lg border border-surface-300/40 bg-transparent cursor-pointer p-0"
            />
            <input
              type="text"
              value={currentPartMaterial.color}
              onChange={(e) => handlePropChange('color', e.target.value)}
              className="w-20 bg-surface-100 border border-surface-300/40 rounded-lg px-2 py-1 text-xs text-white font-mono uppercase outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Roughness Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-surface-400">
            <span>{language === 'ar' ? 'الخشونة (Roughness)' : 'Roughness'}</span>
            <span className="font-mono text-white">{currentPartMaterial.roughness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.02"
            value={currentPartMaterial.roughness}
            onChange={(e) => handlePropChange('roughness', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Metalness Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-surface-400">
            <span>{language === 'ar' ? 'المعدنية (Metalness)' : 'Metalness'}</span>
            <span className="font-mono text-white">{currentPartMaterial.metalness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.02"
            value={currentPartMaterial.metalness}
            onChange={(e) => handlePropChange('metalness', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Transmission (Glass) Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-surface-400">
            <span>{language === 'ar' ? 'النفاذية للضوء (Transmission)' : 'Glass Transmission'}</span>
            <span className="font-mono text-white">{(currentPartMaterial.transmission ?? 0).toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={currentPartMaterial.transmission ?? 0}
            onChange={(e) => handlePropChange('transmission', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Clearcoat Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-surface-400">
            <span>{language === 'ar' ? 'طبقة اللمعان الشفافة (Clearcoat)' : 'Clearcoat'}</span>
            <span className="font-mono text-white">{(currentPartMaterial.clearcoat ?? 0).toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={currentPartMaterial.clearcoat ?? 0}
            onChange={(e) => handlePropChange('clearcoat', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Opacity Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-surface-400">
            <span>{language === 'ar' ? 'العتمة والشفافية (Opacity)' : 'Opacity'}</span>
            <span className="font-mono text-white">{(currentPartMaterial.opacity ?? 1).toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={currentPartMaterial.opacity ?? 1}
            onChange={(e) => handlePropChange('opacity', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
