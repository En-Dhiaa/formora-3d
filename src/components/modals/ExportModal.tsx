'use client';

import React, { useState } from 'react';
import {
  Download,
  X,
  Image as ImageIcon,
  Box,
  CheckCircle,
  Loader2,
  Sparkles,
  Maximize2,
  Eye,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { ExportConfig } from '../../types';
import { HighResRenderer } from '../../engine/export/HighResRenderer';
import { GLTFExporterHelper } from '../../engine/export/GLTFExporterHelper';

export const ExportModal: React.FC = () => {
  const {
    project,
    language,
    isExportModalOpen,
    setExportModalOpen,
  } = useProjectStore();

  const t = translations[language];

  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [transparentBg, setTransparentBg] = useState<boolean>(true);
  const [includeShadows, setIncludeShadows] = useState<boolean>(true);
  const [presetKey, setPresetKey] = useState<string>('2k_square');
  const [customWidth, setCustomWidth] = useState<number>(2048);
  const [customHeight, setCustomHeight] = useState<number>(2048);
  const [fileName, setFileName] = useState<string>(
    `${project.name.replace(/\s+/g, '_')}_render`
  );

  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [renderStatus, setRenderStatus] = useState<string>('');
  const [renderedResult, setRenderedResult] = useState<{ dataUrl: string; blob: Blob } | null>(null);

  if (!isExportModalOpen) return null;

  const presets = [
    { key: '1080p', label: '1080p Full HD (1920 × 1080)', w: 1920, h: 1080 },
    { key: '2k_square', label: '2K Square (2048 × 2048) — Best for Catalog', w: 2048, h: 2048 },
    { key: '4k_uhd', label: '4K Ultra HD (3840 × 2160)', w: 3840, h: 2160 },
    { key: 'social_story', label: 'Social Vertical (1080 × 1920)', w: 1080, h: 1920 },
    { key: 'custom', label: 'مخصص / Custom', w: customWidth, h: customHeight },
  ];

  const handlePresetSelect = (key: string) => {
    setPresetKey(key);
    const p = presets.find((x) => x.key === key);
    if (p && key !== 'custom') {
      setCustomWidth(p.w);
      setCustomHeight(p.h);
    }
  };

  const handleStartRender = async () => {
    setIsRendering(true);
    setRenderedResult(null);
    setRenderProgress(5);
    setRenderStatus(language === 'ar' ? 'جارٍ تهيئة محرك الرندرة...' : 'Initializing offscreen renderer...');

    try {
      // Get global scene and camera exposed by ThreeCanvas
      const scene = (window as any).__FORMORA_SCENE__;
      const camera = (window as any).__FORMORA_CAMERA__;

      if (!scene || !camera) {
        throw new Error('3D Viewport scene is not ready yet');
      }

      const activePreset = presets.find((p) => p.key === presetKey);
      const width = presetKey === 'custom' ? customWidth : activePreset?.w || 2048;
      const height = presetKey === 'custom' ? customHeight : activePreset?.h || 2048;

      const config: ExportConfig = {
        format,
        width,
        height,
        resolutionPreset: presetKey as any,
        transparentBackground: format === 'png' ? transparentBg : false,
        includeShadows,
        imageQuality: 0.95,
      };

      const result = await HighResRenderer.renderToImage(
        scene,
        camera,
        config,
        (percent, status) => {
          setRenderProgress(percent);
          setRenderStatus(status);
        }
      );

      setRenderedResult(result);
    } catch (err: any) {
      alert((language === 'ar' ? 'فشل تصدير الصورة: ' : 'Render failed: ') + err.message);
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownloadRendered = () => {
    if (!renderedResult) return;
    const ext = format === 'jpeg' ? 'jpg' : format;
    HighResRenderer.downloadFile(renderedResult.blob, `${fileName}.${ext}`);
  };

  const handleExport3DModel = async () => {
    try {
      const scene = (window as any).__FORMORA_SCENE__;
      if (!scene) throw new Error('Scene not ready');

      const blob = await GLTFExporterHelper.exportToGLB(scene, true);
      HighResRenderer.downloadFile(blob, `${fileName}.glb`);
    } catch (err: any) {
      alert((language === 'ar' ? 'فشل تصدير النموذج ثلاثي الأبعاد: ' : 'Failed to export 3D model: ') + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-xl bg-surface-100 border border-surface-300/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-surface-200 flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'ar' ? 'مركز التصدير والرندرة عالي الدقة' : 'Export & Render Center'}
              </h3>
              <span className="text-[10px] text-surface-400">
                {language === 'ar' ? 'رندرة بدقة 4K مع خلفية شفافة وتصدير ثلاثي الأبعاد' : 'High-res rendering, alpha transparency, 3D GLB'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setExportModalOpen(false)}
            className="p-1.5 text-surface-400 hover:text-white rounded-xl hover:bg-surface-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
              {language === 'ar' ? 'صيغة الصورة' : 'Image Format'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'png', label: 'PNG (Alpha Trans.)' },
                { id: 'jpeg', label: 'JPEG (Photo)' },
                { id: 'webp', label: 'WebP (Modern Web)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id as any)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    format === f.id
                      ? 'bg-brand-500/10 border-brand-500 text-white shadow-glow'
                      : 'bg-surface-50 border-surface-300/30 text-surface-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
              {language === 'ar' ? 'أبعاد ودقة الرندرة' : 'Render Dimensions'}
            </label>
            <div className="space-y-1.5">
              {presets.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handlePresetSelect(p.key)}
                  className={`w-full p-2.5 rounded-xl border text-left rtl:text-right text-xs font-semibold transition-all flex items-center justify-between ${
                    presetKey === p.key
                      ? 'bg-brand-500/10 border-brand-500 text-white shadow-glow'
                      : 'bg-surface-50 border-surface-300/30 text-surface-400 hover:text-white'
                  }`}
                >
                  <span>{p.label}</span>
                  {p.key !== 'custom' && (
                    <span className="text-[10px] text-surface-400 font-mono">
                      {p.w} × {p.h} px
                    </span>
                  )}
                </button>
              ))}
            </div>

            {presetKey === 'custom' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[10px] text-surface-400 block mb-1">
                    {language === 'ar' ? 'العرض (بكسل)' : 'Width (px)'}
                  </label>
                  <input
                    type="number"
                    min="256"
                    max="8192"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Math.max(256, Number(e.target.value)))}
                    className="w-full bg-surface-50 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-surface-400 block mb-1">
                    {language === 'ar' ? 'الارتفاع (بكسل)' : 'Height (px)'}
                  </label>
                  <input
                    type="number"
                    min="256"
                    max="8192"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Math.max(256, Number(e.target.value)))}
                    className="w-full bg-surface-50 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-3">
            {format === 'png' && (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {language === 'ar' ? 'خلفية شفافة تماماً (Transparent Alpha)' : 'Transparent Background'}
                  </span>
                  <span className="text-[10px] text-surface-400">
                    {language === 'ar' ? 'عزل المنتج لاستخدامه في الإعلانات والتصاميم' : 'Isolates product for design layouts'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-surface-200 border-surface-300"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-surface-300/20">
              <div>
                <span className="text-xs font-semibold text-white block">
                  {language === 'ar' ? 'تضمين ظلال الاستوديو' : 'Include Studio Shadows'}
                </span>
                <span className="text-[10px] text-surface-400">
                  {language === 'ar' ? 'توليد ظلال أرضية ناعمة واقعية' : 'Render realistic contact & floor shadows'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={includeShadows}
                onChange={(e) => setIncludeShadows(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-surface-200 border-surface-300"
              />
            </div>
          </div>

          {/* File Name */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-surface-400 block">
              {language === 'ar' ? 'اسم الملف الناتج' : 'Output File Name'}
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full bg-surface-50 border border-surface-300/40 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-500 font-mono"
            />
          </div>

          {/* Render Result Preview Card */}
          {renderedResult && (
            <div className="p-4 rounded-2xl bg-surface-50 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>{language === 'ar' ? 'اكتملت الرندرة بنجاح!' : 'Render Successful!'}</span>
              </div>

              <div className="w-full h-48 rounded-xl overflow-hidden checkerboard-bg border border-surface-300/40 flex items-center justify-center">
                <img
                  src={renderedResult.dataUrl}
                  alt="Rendered result"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <button
                onClick={handleDownloadRendered}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'ar' ? 'تحميل الصورة النهائية' : 'Download Final Image'}</span>
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {isRendering && (
            <div className="space-y-2 p-4 rounded-2xl bg-surface-50 border border-brand-500/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-400 font-semibold flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {renderStatus}
                </span>
                <span className="font-mono text-white">{renderProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-accent-cyan transition-all duration-300"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 border-t border-surface-200 bg-surface-50 flex items-center justify-between">
          {/* 3D Model Export Shortcut */}
          <button
            onClick={handleExport3DModel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-white text-xs font-medium border border-surface-300/30 transition-all"
            title="Export scene as glTF / GLB binary for Blender or web 3D"
          >
            <Box className="w-3.5 h-3.5 text-accent-cyan" />
            <span>{language === 'ar' ? 'تصدير 3D (GLB)' : 'Export 3D (.GLB)'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExportModalOpen(false)}
              className="px-4 py-2 rounded-xl text-surface-400 hover:text-white text-xs font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              onClick={handleStartRender}
              disabled={isRendering}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-glow transition-all active:scale-95"
            >
              {isRendering ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === 'ar' ? 'جارٍ الرندرة...' : 'Rendering...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'بدء الرندرة والتصدير' : 'Start High-Res Render'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
