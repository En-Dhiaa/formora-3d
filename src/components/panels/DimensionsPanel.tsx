'use client';

import React from 'react';
import {
  Ruler,
  Lock,
  Unlock,
  RotateCcw,
  AlertTriangle,
  MoveVertical,
  MoveHorizontal,
  Layers,
  Compass,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { calculateSurfaceDimensions } from '../../utils/dimensions';
import {
  BoxParameters,
  CylinderBottleParameters,
  OvalBottleParameters,
  TubeParameters,
  PouchParameters,
  Unit,
} from '../../types';

export const DimensionsPanel: React.FC = () => {
  const {
    project,
    language,
    updateObjectGeometry,
    setObjectUnit,
    toggleAspectRatioLock,
    snapObjectToGround,
    centerSelectedObject,
  } = useProjectStore();

  const t = translations[language];
  const selectedObject = project.objects.find((o) => o.id === project.selectedObjectId);

  if (!selectedObject) {
    return (
      <div className="p-6 text-center text-surface-400">
        <Layers className="w-10 h-10 mx-auto mb-3 opacity-40 text-brand-400" />
        <p className="text-sm font-medium">
          {language === 'ar' ? 'حدد مجسماً لتعديل أبعاده الهندسية' : 'Select an object to edit its dimensions'}
        </p>
      </div>
    );
  }

  const { geometry, dimensionUnit, lockAspectRatio } = selectedObject;
  const surfaces = calculateSurfaceDimensions(geometry, dimensionUnit);

  // Generic updater with aspect ratio constraint preservation
  const handleParamChange = (key: string, val: number | string | boolean) => {
    const currentParams = { ...geometry.params } as any;

    if (typeof val === 'number' && lockAspectRatio) {
      const oldVal = currentParams[key];
      if (oldVal && oldVal > 0 && typeof oldVal === 'number') {
        const ratio = val / oldVal;
        // Scale other primary dimensions
        ['width', 'height', 'depth', 'totalHeight', 'bodyDiameter', 'totalLength'].forEach((dimKey) => {
          if (dimKey !== key && typeof currentParams[dimKey] === 'number') {
            currentParams[dimKey] = Math.round(currentParams[dimKey] * ratio);
          }
        });
      }
    }

    currentParams[key] = val;
    updateObjectGeometry(selectedObject.id, {
      ...geometry,
      params: currentParams,
    });
  };

  // Validation Warnings
  const warnings: string[] = [];
  if (geometry.type === 'cylinder_bottle') {
    const p = geometry.params as CylinderBottleParameters;
    if (p.neckDiameter >= p.bodyDiameter) {
      warnings.push(
        language === 'ar'
          ? 'تنبيه: قطر العنق يجب أن يكون أصغر من قطر جسم العبوة.'
          : 'Warning: Neck diameter should be smaller than body diameter.'
      );
    }
    if (p.neckHeight + p.shoulderHeight >= p.totalHeight) {
      warnings.push(
        language === 'ar'
          ? 'تنبيه: ارتفاع العنق والكتف يتجاوز الارتفاع الكلي للعبوة.'
          : 'Warning: Combined neck & shoulder height exceeds total height.'
      );
    }
  } else if (geometry.type === 'box') {
    const p = geometry.params as BoxParameters;
    const maxRadius = Math.min(p.width, p.depth) / 2;
    if (p.cornerRadius > maxRadius) {
      warnings.push(
        language === 'ar'
          ? 'تنبيه: نصف قطر الاستدارة كبير جداً بالنسبة لعرض وعمق العلبة.'
          : 'Warning: Corner radius is too large for current box dimensions.'
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Unit Selector & Proportions Lock */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-50 border border-surface-300/30">
        <div className="flex items-center gap-1.5">
          <Ruler className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-semibold text-white">
            {language === 'ar' ? 'وحدة القياس' : 'Unit'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit buttons */}
          <div className="flex items-center bg-surface-100 p-0.5 rounded-xl border border-surface-300/30">
            {(['mm', 'cm', 'in'] as Unit[]).map((u) => (
              <button
                key={u}
                onClick={() => setObjectUnit(selectedObject.id, u)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  dimensionUnit === u
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-surface-400 hover:text-white'
                }`}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Aspect Ratio Lock */}
          <button
            onClick={() => toggleAspectRatioLock(selectedObject.id)}
            title={lockAspectRatio ? 'قفل النسب مفعّل' : 'تفعيل قفل النسب'}
            className={`p-2 rounded-xl border transition-all ${
              lockAspectRatio
                ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                : 'bg-surface-100 border-surface-300/30 text-surface-400 hover:text-white'
            }`}
          >
            {lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Geometry Parameters Form */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-surface-400 uppercase tracking-wider">
          {language === 'ar' ? 'الأبعاد الأساسية' : 'Primary Dimensions'}
        </h4>

        {/* BOX PARAMS */}
        {geometry.type === 'box' && (() => {
          const p = geometry.params as BoxParameters;
          return (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'العرض (W)' : 'Width (W)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    value={p.width}
                    onChange={(e) => handleParamChange('width', Math.max(1, Number(e.target.value)))}
                    className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                  <span className="absolute left-3 rtl:left-auto rtl:right-auto ltr:right-3 top-2.5 text-[10px] text-surface-400">
                    {dimensionUnit}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'الارتفاع (H)' : 'Height (H)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="1500"
                    value={p.height}
                    onChange={(e) => handleParamChange('height', Math.max(1, Number(e.target.value)))}
                    className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                  <span className="absolute left-3 rtl:left-auto rtl:right-auto ltr:right-3 top-2.5 text-[10px] text-surface-400">
                    {dimensionUnit}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'العمق (D)' : 'Depth (D)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    value={p.depth}
                    onChange={(e) => handleParamChange('depth', Math.max(1, Number(e.target.value)))}
                    className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                  <span className="absolute left-3 rtl:left-auto rtl:right-auto ltr:right-3 top-2.5 text-[10px] text-surface-400">
                    {dimensionUnit}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'استدارة الحواف' : 'Corner Radius'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={p.cornerRadius}
                    onChange={(e) => handleParamChange('cornerRadius', Math.max(0, Number(e.target.value)))}
                    className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                  <span className="absolute left-3 rtl:left-auto rtl:right-auto ltr:right-3 top-2.5 text-[10px] text-surface-400">
                    {dimensionUnit}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* CYLINDER BOTTLE PARAMS */}
        {geometry.type === 'cylinder_bottle' && (() => {
          const p = geometry.params as CylinderBottleParameters;
          return (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                    {language === 'ar' ? 'الارتفاع الكلي' : 'Total Height'}
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="1000"
                    value={p.totalHeight}
                    onChange={(e) => handleParamChange('totalHeight', Math.max(10, Number(e.target.value)))}
                    className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                    {language === 'ar' ? 'قطر العبوة' : 'Body Diameter'}
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="400"
                    value={p.bodyDiameter}
                    onChange={(e) => handleParamChange('bodyDiameter', Math.max(5, Number(e.target.value)))}
                    className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                    {language === 'ar' ? 'ارتفاع الكتف' : 'Shoulder Height'}
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="100"
                    value={p.shoulderHeight}
                    onChange={(e) => handleParamChange('shoulderHeight', Math.max(1, Number(e.target.value)))}
                    className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                    {language === 'ar' ? 'شكل الكتف' : 'Shoulder Style'}
                  </label>
                  <select
                    value={p.shoulderStyle}
                    onChange={(e) => handleParamChange('shoulderStyle', e.target.value)}
                    className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-2.5 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  >
                    <option value="rounded">{language === 'ar' ? 'دائري ناعم' : 'Rounded'}</option>
                    <option value="sloped">{language === 'ar' ? 'مائل انسيابي' : 'Sloped'}</option>
                    <option value="flat">{language === 'ar' ? 'مسطح زاوية' : 'Flat'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                    {language === 'ar' ? 'قطر الغطاء' : 'Cap Diameter'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={p.capDiameter}
                    onChange={(e) => handleParamChange('capDiameter', Math.max(5, Number(e.target.value)))}
                    className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                    {language === 'ar' ? 'ارتفاع الغطاء' : 'Cap Height'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={p.capHeight}
                    onChange={(e) => handleParamChange('capHeight', Math.max(2, Number(e.target.value)))}
                    className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* SQUEEZE TUBE PARAMS */}
        {geometry.type === 'squeeze_tube' && (() => {
          const p = geometry.params as TubeParameters;
          return (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'الطول الكلي' : 'Total Length'}
                </label>
                <input
                  type="number"
                  value={p.totalLength}
                  onChange={(e) => handleParamChange('totalLength', Math.max(30, Number(e.target.value)))}
                  className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'قطر الأنبوب' : 'Body Diameter'}
                </label>
                <input
                  type="number"
                  value={p.bodyDiameter}
                  onChange={(e) => handleParamChange('bodyDiameter', Math.max(10, Number(e.target.value)))}
                  className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'قطر الغطاء' : 'Cap Diameter'}
                </label>
                <input
                  type="number"
                  value={p.capDiameter}
                  onChange={(e) => handleParamChange('capDiameter', Math.max(10, Number(e.target.value)))}
                  className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'ارتفاع اللحام' : 'Crimp Height'}
                </label>
                <input
                  type="number"
                  value={p.crimpHeight}
                  onChange={(e) => handleParamChange('crimpHeight', Math.max(2, Number(e.target.value)))}
                  className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                />
              </div>
            </div>
          );
        })()}

        {/* POUCH PARAMS */}
        {geometry.type === 'flexible_pouch' && (() => {
          const p = geometry.params as PouchParameters;
          return (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'عرض الكيس' : 'Width'}
                </label>
                <input
                  type="number"
                  value={p.width}
                  onChange={(e) => handleParamChange('width', Math.max(30, Number(e.target.value)))}
                  className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'ارتفاع الكيس' : 'Height'}
                </label>
                <input
                  type="number"
                  value={p.height}
                  onChange={(e) => handleParamChange('height', Math.max(30, Number(e.target.value)))}
                  className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'عمق القاعدة (Gusset)' : 'Gusset Depth'}
                </label>
                <input
                  type="number"
                  value={p.gussetDepth}
                  onChange={(e) => handleParamChange('gussetDepth', Math.max(10, Number(e.target.value)))}
                  className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-surface-400 mb-1 block">
                  {language === 'ar' ? 'عرض اللحام (Seal)' : 'Seal Width'}
                </label>
                <input
                  type="number"
                  value={p.sealWidth}
                  onChange={(e) => handleParamChange('sealWidth', Math.max(2, Number(e.target.value)))}
                  className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                />
              </div>
            </div>
          );
        })()}
      </div>

      {/* Warnings & Alerts */}
      {warnings.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
          {warnings.map((w, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Derived Surface Dimensions Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-surface-400 uppercase tracking-wider flex items-center justify-between">
          <span>{language === 'ar' ? 'أبعاد أسطح التصميم المحسوبة' : 'Calculated Surface Dimensions'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 font-mono">
            {surfaces.length} {language === 'ar' ? 'أسطح' : 'Surfaces'}
          </span>
        </h4>

        <div className="space-y-2">
          {surfaces.map((s) => (
            <div
              key={s.key}
              className="p-2.5 rounded-xl bg-surface-50 border border-surface-300/30 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-white block">
                  {language === 'ar' ? s.labelAr : s.labelEn}
                </span>
                <span className="text-[10px] text-surface-400 font-mono">
                  {s.key}
                </span>
              </div>

              <div className="text-right font-mono text-[11px] font-semibold text-brand-400 bg-surface-100 px-2 py-1 rounded-lg border border-surface-300/20">
                {s.width} × {s.height} {dimensionUnit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alignment Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          onClick={() => snapObjectToGround(selectedObject.id)}
          className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-surface-100 hover:bg-surface-200 border border-surface-300/30 text-surface-400 hover:text-white text-xs font-medium transition-all"
        >
          <MoveVertical className="w-3.5 h-3.5 text-accent-cyan" />
          <span>{language === 'ar' ? 'محاذاة للأرضية' : 'Snap to Floor'}</span>
        </button>

        <button
          onClick={() => centerSelectedObject(selectedObject.id)}
          className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-surface-100 hover:bg-surface-200 border border-surface-300/30 text-surface-400 hover:text-white text-xs font-medium transition-all"
        >
          <MoveHorizontal className="w-3.5 h-3.5 text-accent-gold" />
          <span>{language === 'ar' ? 'توسيط بالمشهد' : 'Center Object'}</span>
        </button>
      </div>
    </div>
  );
};
