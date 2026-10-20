'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Grid,
  Sparkles,
  Sliders,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { calculateSurfaceDimensions } from '../../utils/dimensions';
import { ArtworkConfig } from '../../types';
import { generateSampleLabel } from '../../utils/proceduralTextures';

export const ArtworkPanel: React.FC = () => {
  const {
    project,
    language,
    updateObjectArtwork,
    setDielineModalOpen,
  } = useProjectStore();

  const t = translations[language];
  const selectedObject = project.objects.find((o) => o.id === project.selectedObjectId);

  const [activeSurfaceKey, setActiveSurfaceKey] = useState<string>('front');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Surfaces for current object
  const surfaces = useMemo(() => {
    if (!selectedObject) return [];
    return calculateSurfaceDimensions(selectedObject.geometry, selectedObject.dimensionUnit);
  }, [selectedObject]);

  // Ensure active surface is valid
  const currentSurface = surfaces.find((s) => s.key === activeSurfaceKey) || surfaces[0];
  const activeKey = currentSurface?.key || 'front';

  if (!selectedObject) {
    return (
      <div className="p-6 text-center text-surface-400">
        <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40 text-brand-400" />
        <p className="text-sm font-medium">
          {language === 'ar' ? 'حدد مجسماً لإدارة التصاميم والملصقات' : 'Select an object to manage artwork'}
        </p>
      </div>
    );
  }

  const currentArtwork: ArtworkConfig | undefined = selectedObject.surfaceArtworks[activeKey];

  // Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        updateObjectArtwork(selectedObject.id, activeKey, {
          imageSrc: src,
          fileName: file.name,
          fit: 'fit',
          preserveAspectRatio: true,
          offsetX: 0,
          offsetY: 0,
          scale: 1,
          rotation: 0,
          flipH: false,
          flipV: false,
          repeatX: 1,
          repeatY: 1,
          opacity: 1,
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Generate instant procedural sample label
  const handleLoadSampleArtwork = () => {
    const isPharma = selectedObject.geometry.type === 'box' || selectedObject.geometry.type === 'cylinder_bottle';
    const sampleSrc = generateSampleLabel({
      title: isPharma ? 'VOLTENAC 50' : 'AURA LUXE',
      subtitle: isPharma ? 'Diclofenac Potassium 50mg' : 'Premium Botanical Care',
      surfaceName: currentSurface ? currentSurface.labelEn : 'Front Panel',
      color: isPharma ? '#1e3a8a' : '#831843',
      width: 1024,
      height: 1024,
    });

    updateObjectArtwork(selectedObject.id, activeKey, {
      imageSrc: sampleSrc,
      fileName: 'sample_artwork.png',
      fit: 'fit',
      preserveAspectRatio: true,
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      rotation: 0,
      flipH: false,
      flipV: false,
      repeatX: 1,
      repeatY: 1,
      opacity: 1,
    });
  };

  const updateCurrentArtwork = (patch: Partial<ArtworkConfig>) => {
    if (!currentArtwork) return;
    updateObjectArtwork(selectedObject.id, activeKey, {
      ...currentArtwork,
      ...patch,
    });
  };

  const handleRemoveArtwork = () => {
    updateObjectArtwork(selectedObject.id, activeKey, null);
  };

  return (
    <div className="space-y-6">
      {/* Surface Selector Chips */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
          {language === 'ar' ? 'اختر السطح المطلوب' : 'Select Target Surface'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {surfaces.map((s) => {
            const hasArt = !!selectedObject.surfaceArtworks[s.key];
            const isSelected = s.key === activeKey;

            return (
              <button
                key={s.key}
                onClick={() => setActiveSurfaceKey(s.key)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-left rtl:text-right transition-all ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500 text-white shadow-glow'
                    : 'bg-surface-50 border-surface-300/30 text-surface-400 hover:text-white hover:bg-surface-100'
                }`}
              >
                <div className="truncate">
                  <span className="text-xs font-semibold block truncate">
                    {language === 'ar' ? s.labelAr : s.labelEn}
                  </span>
                  <span className="text-[10px] text-surface-400 font-mono">
                    {s.width} × {s.height} {selectedObject.dimensionUnit}
                  </span>
                </div>
                {hasArt && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Surface Dimension Indicator */}
      {currentSurface && (
        <div className="p-3 rounded-2xl bg-surface-50 border border-surface-300/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-brand-400" />
            <div>
              <span className="text-xs font-semibold text-white block">
                {language === 'ar' ? currentSurface.labelAr : currentSurface.labelEn}
              </span>
              <span className="text-[10px] text-surface-400">
                {language === 'ar' ? 'نسبة الأبعاد: ' : 'Aspect Ratio: '}
                {currentSurface.aspectRatio.toFixed(2)}:1
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-surface-100 font-mono text-xs font-bold text-brand-400 border border-surface-300/30">
            {currentSurface.width} × {currentSurface.height} {selectedObject.dimensionUnit}
          </span>
        </div>
      )}

      {/* Artwork Upload / Preview Zone */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
          {language === 'ar' ? 'ملف التصميم' : 'Artwork File'}
        </label>

        {currentArtwork ? (
          <div className="space-y-3">
            {/* Thumbnail Preview Card */}
            <div className="relative rounded-2xl overflow-hidden border border-surface-300/40 bg-surface-50 p-3 flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-200 border border-surface-300/30 flex-shrink-0 checkerboard-bg flex items-center justify-center">
                <img
                  src={currentArtwork.imageSrc}
                  alt={currentArtwork.fileName}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-white truncate mb-1">
                  {currentArtwork.fileName || 'artwork.png'}
                </h5>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium mb-3">
                  <CheckCircle className="w-3 h-3" />
                  {language === 'ar' ? 'تم تعيين التصميم' : 'Artwork Mapped'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-surface-200 hover:bg-surface-300 text-white text-[11px] font-medium border border-surface-300/30 transition-all"
                  >
                    {language === 'ar' ? 'استبدال' : 'Replace'}
                  </button>
                  <button
                    onClick={handleRemoveArtwork}
                    className="p-1 rounded-lg text-accent-rose hover:bg-accent-rose/10 transition-all"
                    title={language === 'ar' ? 'حذف التصميم' : 'Remove Artwork'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Mapping Controls */}
            <div className="space-y-4 p-4 rounded-2xl bg-surface-50 border border-surface-300/30">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Sliders className="w-3.5 h-3.5 text-brand-400" />
                <span>{language === 'ar' ? 'التحكم في الموضع والقياس' : 'Mapping & Transform'}</span>
              </div>

              {/* Fit Mode Switcher */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-surface-400">
                  {language === 'ar' ? 'طريقة الملاءمة' : 'Fit Mode'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-surface-100 p-1 rounded-xl border border-surface-300/30">
                  {(['fit', 'fill', 'stretch'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateCurrentArtwork({ fit: mode })}
                      className={`py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                        currentArtwork.fit === mode
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-surface-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale / Zoom Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-surface-400">
                  <span>{language === 'ar' ? 'التكبير / التصغير' : 'Scale / Zoom'}</span>
                  <span className="font-mono text-white">{(currentArtwork.scale * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.05"
                  value={currentArtwork.scale}
                  onChange={(e) => updateCurrentArtwork({ scale: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Offset X / Y Sliders */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-surface-400">
                    <span>{language === 'ar' ? 'إزاحة س' : 'Offset X'}</span>
                    <span className="font-mono text-white">{currentArtwork.offsetX.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-1.0"
                    max="1.0"
                    step="0.02"
                    value={currentArtwork.offsetX}
                    onChange={(e) => updateCurrentArtwork({ offsetX: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-surface-400">
                    <span>{language === 'ar' ? 'إزاحة ص' : 'Offset Y'}</span>
                    <span className="font-mono text-white">{currentArtwork.offsetY.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-1.0"
                    max="1.0"
                    step="0.02"
                    value={currentArtwork.offsetY}
                    onChange={(e) => updateCurrentArtwork({ offsetY: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Rotation & Flip Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateCurrentArtwork({ rotation: (currentArtwork.rotation + 90) % 360 })}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-200 border border-surface-300/30 text-surface-400 hover:text-white text-xs transition-all"
                    title={language === 'ar' ? 'تدوير 90 درجة' : 'Rotate 90°'}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{currentArtwork.rotation}°</span>
                  </button>

                  <button
                    onClick={() => updateCurrentArtwork({ flipH: !currentArtwork.flipH })}
                    className={`p-1.5 rounded-xl border transition-all ${
                      currentArtwork.flipH
                        ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                        : 'bg-surface-100 border-surface-300/30 text-surface-400 hover:text-white'
                    }`}
                    title={language === 'ar' ? 'انعكاس أفقي' : 'Flip Horizontally'}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => updateCurrentArtwork({ flipV: !currentArtwork.flipV })}
                    className={`p-1.5 rounded-xl border transition-all ${
                      currentArtwork.flipV
                        ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                        : 'bg-surface-100 border-surface-300/30 text-surface-400 hover:text-white'
                    }`}
                    title={language === 'ar' ? 'انعكاس رأسي' : 'Flip Vertically'}
                  >
                    <FlipVertical className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Opacity */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-surface-400">{language === 'ar' ? 'الشفافية' : 'Opacity'}</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={currentArtwork.opacity}
                    onChange={(e) => updateCurrentArtwork({ opacity: Number(e.target.value) })}
                    className="w-16"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Empty Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  const fakeEvent = { target: { files: [file], value: '' } } as any;
                  handleFileUpload(fakeEvent);
                }
              }}
              className="p-8 border-2 border-dashed border-surface-300/50 hover:border-brand-500/60 rounded-2xl bg-surface-50/50 hover:bg-surface-50 text-center cursor-pointer transition-all group"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-surface-400 group-hover:text-brand-400 group-hover:scale-110 transition-all" />
              <p className="text-xs font-semibold text-white mb-1">
                {language === 'ar' ? 'اسحب وأفلت ملف التصميم هنا' : 'Drag & drop artwork file here'}
              </p>
              <p className="text-[10px] text-surface-400">
                {language === 'ar' ? 'يدعم PNG, JPG, WebP, SVG بدقة عالية' : 'Supports PNG, JPG, WebP, SVG'}
              </p>
            </div>

            {/* Quick Generator Shortcut */}
            <button
              onClick={handleLoadSampleArtwork}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-brand-600/20 to-accent-cyan/20 hover:from-brand-600/30 hover:to-accent-cyan/30 border border-brand-500/30 text-brand-300 text-xs font-semibold transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              <span>{language === 'ar' ? 'توليد ملصق تجريبي احترافي فوري' : 'Generate Mock Product Label'}</span>
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
        />
      </div>

      {/* Dieline 2D Layout Mode Shortcut for Carton Boxes */}
      {selectedObject.geometry.type === 'box' && (
        <div className="p-3 rounded-2xl bg-surface-50 border border-surface-300/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent-gold" />
            <div>
              <span className="text-xs font-semibold text-white block">
                {language === 'ar' ? 'مخطط القالب المنبسط (Dieline)' : 'Unfolded Dieline View'}
              </span>
              <span className="text-[10px] text-surface-400">
                {language === 'ar' ? 'عرض خطوط القص والطي لجميع الأوجه' : 'Inspect fold lines & 2D flat layout'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setDielineModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-white text-xs font-medium border border-surface-300/30 transition-all"
          >
            {language === 'ar' ? 'عرض القالب' : 'Open 2D'}
          </button>
        </div>
      )}
    </div>
  );
};
