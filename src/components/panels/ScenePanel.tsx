'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Box,
  MoveVertical,
  MoveHorizontal,
  Check,
  Edit2,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { TemplateType } from '../../types';

export const ScenePanel: React.FC = () => {
  const {
    project,
    language,
    setSelectedObjectId,
    addObjectByTemplate,
    duplicateObject,
    deleteObject,
    toggleObjectVisibility,
    toggleObjectLocked,
    renameObject,
    snapObjectToGround,
    centerSelectedObject,
    applySceneArrangement,
  } = useProjectStore();

  const t = translations[language];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState<string>('');

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setTempName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (tempName.trim()) {
      renameObject(id, tempName.trim());
    }
    setEditingId(null);
  };

  const addOptions: Array<{ type: TemplateType; labelAr: string; labelEn: string; icon: string }> = [
    { type: 'box', labelAr: 'علبة كرتون', labelEn: 'Carton Box', icon: '📦' },
    { type: 'cylinder_bottle', labelAr: 'عبوة أسطوانية', labelEn: 'Bottle / Jar', icon: '🍾' },
    { type: 'squeeze_tube', labelAr: 'أنبوب مرن', labelEn: 'Squeeze Tube', icon: '🧴' },
    { type: 'flexible_pouch', labelAr: 'كيس مرن قائم', labelEn: 'Stand-up Pouch', icon: '🛍️' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Add Product Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
          {language === 'ar' ? 'إضافة منتج جديد للمشهد' : 'Add Packaging Object'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {addOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => addObjectByTemplate(opt.type)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-50 hover:bg-surface-100 border border-surface-300/30 text-surface-300 hover:text-white text-xs font-semibold transition-all group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">{opt.icon}</span>
              <span className="truncate">{language === 'ar' ? opt.labelAr : opt.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Studio Arrangement Presets for Multi-Product Staging */}
      {project.objects.length > 1 && (
        <div className="p-3.5 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-2.5">
          <label className="text-[11px] font-bold text-white flex items-center justify-between">
            <span>{language === 'ar' ? 'تشكيلات الاستوديو التلقائية' : 'Studio Staging Layouts'}</span>
            <span className="text-[10px] text-brand-400 font-normal">
              {language === 'ar' ? 'تنسيق متناسق بضغطة واحدة' : '1-Click Auto Align'}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => applySceneArrangement('hero_companion')}
              className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 border border-surface-300/30 text-surface-300 hover:text-white text-xs font-medium text-left rtl:text-right transition-all"
            >
              <span className="block font-semibold text-white">🏆 {language === 'ar' ? 'بطل ومرافق' : 'Hero & Box'}</span>
              <span className="text-[10px] text-surface-400">{language === 'ar' ? 'منتج أمامي مع علبة مائلة' : 'Front hero with angled box'}</span>
            </button>
            <button
              onClick={() => applySceneArrangement('duo')}
              className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 border border-surface-300/30 text-surface-300 hover:text-white text-xs font-medium text-left rtl:text-right transition-all"
            >
              <span className="block font-semibold text-white">👥 {language === 'ar' ? 'ثنائي متجاور' : 'Side-by-Side'}</span>
              <span className="text-[10px] text-surface-400">{language === 'ar' ? 'عرض متجاور بزاوية طفيفة' : 'Balanced commercial duo'}</span>
            </button>
            <button
              onClick={() => applySceneArrangement('trio')}
              className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 border border-surface-300/30 text-surface-300 hover:text-white text-xs font-medium text-left rtl:text-right transition-all"
            >
              <span className="block font-semibold text-white">🔺 {language === 'ar' ? 'تشكيل هرمي (Trio)' : 'Triangle Trio'}</span>
              <span className="text-[10px] text-surface-400">{language === 'ar' ? 'ثلاثة منتجات بتشكيل عميق' : 'Depth-staged product trio'}</span>
            </button>
            <button
              onClick={() => applySceneArrangement('lineup')}
              className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 border border-surface-300/30 text-surface-300 hover:text-white text-xs font-medium text-left rtl:text-right transition-all"
            >
              <span className="block font-semibold text-white">📏 {language === 'ar' ? 'صف متساوي' : 'Even Lineup'}</span>
              <span className="text-[10px] text-surface-400">{language === 'ar' ? 'توزيع أفقي متساوي' : 'Clean horizontal catalog'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Objects Outliner Hierarchy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-surface-400 uppercase tracking-wider">
            {language === 'ar' ? 'عناصر المشهد (Hierarchy)' : 'Scene Outliner'}
          </label>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400">
            {project.objects.length} {language === 'ar' ? 'مجسمات' : 'Objects'}
          </span>
        </div>

        <div className="space-y-1.5">
          {project.objects.map((obj) => {
            const isSelected = project.selectedObjectId === obj.id;
            const isEditing = editingId === obj.id;

            return (
              <div
                key={obj.id}
                onClick={() => setSelectedObjectId(obj.id)}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500 text-white shadow-glow'
                    : 'bg-surface-50 border-surface-300/30 text-surface-400 hover:text-white hover:bg-surface-100'
                }`}
              >
                {/* Name / Rename Input */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Box className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-brand-400' : 'text-surface-400'}`} />

                  {isEditing ? (
                    <input
                      type="text"
                      value={tempName}
                      autoFocus
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={() => handleSaveRename(obj.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(obj.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="bg-surface-200 border border-brand-500 rounded px-2 py-0.5 text-xs text-white outline-none w-full"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => handleStartRename(obj.id, obj.name)}
                      className="text-xs font-semibold truncate select-none"
                      title={language === 'ar' ? 'انقر مرتين لإعادة التسمية' : 'Double click to rename'}
                    >
                      {obj.name}
                    </span>
                  )}
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Visibility Eye */}
                  <button
                    onClick={() => toggleObjectVisibility(obj.id)}
                    className="p-1 text-surface-400 hover:text-white rounded-lg transition-colors"
                    title={obj.visible ? 'إخفاء' : 'إظهار'}
                  >
                    {obj.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-surface-500" />}
                  </button>

                  {/* Lock Toggle */}
                  <button
                    onClick={() => toggleObjectLocked(obj.id)}
                    className="p-1 text-surface-400 hover:text-white rounded-lg transition-colors"
                    title={obj.locked ? 'إلغاء القفل' : 'قفل العنصر'}
                  >
                    {obj.locked ? <Lock className="w-3.5 h-3.5 text-accent-gold" /> : <Unlock className="w-3.5 h-3.5 text-surface-500" />}
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => duplicateObject(obj.id)}
                    className="p-1 text-surface-400 hover:text-white rounded-lg transition-colors"
                    title={language === 'ar' ? 'تكرار المجسم' : 'Duplicate Object'}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  {project.objects.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(language === 'ar' ? `هل تريد حذف ${obj.name}؟` : `Delete ${obj.name}?`)) {
                          deleteObject(obj.id);
                        }
                      }}
                      className="p-1 text-surface-400 hover:text-accent-rose rounded-lg transition-colors"
                      title={language === 'ar' ? 'حذف المجسم' : 'Delete Object'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Object Transform Shortcuts */}
      {project.selectedObjectId && (
        <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-3">
          <span className="text-xs font-bold text-white block">
            {language === 'ar' ? 'محاذاة المجسم المحدد' : 'Transform Shortcuts'}
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => snapObjectToGround(project.selectedObjectId!)}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-surface-100 hover:bg-surface-200 border border-surface-300/30 text-surface-400 hover:text-white text-xs font-medium transition-all"
            >
              <MoveVertical className="w-3.5 h-3.5 text-accent-cyan" />
              <span>{language === 'ar' ? 'محاذاة للأرضية' : 'Snap to Floor'}</span>
            </button>

            <button
              onClick={() => centerSelectedObject(project.selectedObjectId!)}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-surface-100 hover:bg-surface-200 border border-surface-300/30 text-surface-400 hover:text-white text-xs font-medium transition-all"
            >
              <MoveHorizontal className="w-3.5 h-3.5 text-accent-gold" />
              <span>{language === 'ar' ? 'توسيط بالمشهد' : 'Center in Scene'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
