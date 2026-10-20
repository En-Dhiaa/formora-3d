'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  X,
  FileText,
  Download,
  Eye,
  Layers,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { BoxParameters } from '../../types';

export const DielineModal: React.FC = () => {
  const {
    project,
    language,
    isDielineModalOpen,
    setDielineModalOpen,
  } = useProjectStore();

  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showArtworkOverlay, setShowArtworkOverlay] = useState<boolean>(true);
  const [showBleedGuides, setShowBleedGuides] = useState<boolean>(true);

  const selectedObject = project.objects.find((o) => o.id === project.selectedObjectId);

  // Box dimensions
  const isBox = selectedObject?.geometry.type === 'box';
  const boxParams = (selectedObject?.geometry.params || { width: 80, height: 120, depth: 80 }) as BoxParameters;

  const w = boxParams.width;
  const h = boxParams.height;
  const d = boxParams.depth;
  const glueFlap = 15; // mm

  useEffect(() => {
    if (!isDielineModalOpen || !canvasRef.current || !isBox) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Calculate scale factor to fit unfolded carton inside canvas
    // Total flat width: glueFlap + Left(d) + Front(w) + Right(d) + Back(w) + margin
    const totalDielineW = glueFlap + d + w + d + w;
    // Total flat height: Top(d) + Height(h) + Bottom(d)
    const totalDielineH = d + h + d;

    const margin = 60;
    const scale = Math.min((canvasW - margin * 2) / totalDielineW, (canvasH - margin * 2) / totalDielineH);

    const startX = (canvasW - totalDielineW * scale) / 2;
    const startY = (canvasH - totalDielineH * scale) / 2;

    const sx = (val: number) => val * scale;

    // Drawing helper for panels
    const drawPanel = (
      px: number,
      py: number,
      pw: number,
      ph: number,
      name: string,
      artKey?: string
    ) => {
      // Background panel fill
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px, py, pw, ph);

      // Artwork image if available
      if (showArtworkOverlay && artKey && selectedObject?.surfaceArtworks[artKey]?.imageSrc) {
        const img = new Image();
        img.src = selectedObject.surfaceArtworks[artKey]!.imageSrc!;
        if (img.complete) {
          ctx.drawImage(img, px, py, pw, ph);
        }
      }

      // Panel cut outline
      ctx.strokeStyle = '#ef4444'; // Red for cut
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px, py, pw, ph);

      // Label text
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name, px + pw / 2, py + ph / 2);

      // Dimensions text
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(
        `${(pw / scale).toFixed(0)} × ${(ph / scale).toFixed(0)} mm`,
        px + pw / 2,
        py + ph / 2 + 14
      );
    };

    // Panels positions:
    // Row 1 (Top): Top Flap (aligned over Front)
    const topX = startX + sx(glueFlap + d);
    const topY = startY;
    drawPanel(topX, topY, sx(w), sx(d), 'TOP LID (الغطاء)', 'top');

    // Row 2 (Main Body horizontal sequence):
    // 1. Glue Flap
    const gfX = startX;
    const gfY = startY + sx(d);
    drawPanel(gfX, gfY, sx(glueFlap), sx(h), 'GLUE TAB', undefined);

    // 2. Left Side Panel
    const leftX = startX + sx(glueFlap);
    const leftY = startY + sx(d);
    drawPanel(leftX, leftY, sx(d), sx(h), 'LEFT (يسار)', 'left');

    // 3. Front Panel
    const frontX = leftX + sx(d);
    const frontY = leftY;
    drawPanel(frontX, frontY, sx(w), sx(h), 'FRONT (أمامي)', 'front');

    // 4. Right Side Panel
    const rightX = frontX + sx(w);
    const rightY = leftY;
    drawPanel(rightX, rightY, sx(d), sx(h), 'RIGHT (يمين)', 'right');

    // 5. Back Panel
    const backX = rightX + sx(d);
    const backY = leftY;
    drawPanel(backX, backY, sx(w), sx(h), 'BACK (خلفي)', 'back');

    // Row 3 (Bottom): Bottom Base (aligned under Front)
    const botX = frontX;
    const botY = frontY + sx(h);
    drawPanel(botX, botY, sx(w), sx(d), 'BOTTOM BASE (القاعدة)', 'bottom');

    // Fold Lines (Dashed Green)
    ctx.strokeStyle = '#22c55e'; // Green for fold
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.5;

    // Horizontal fold between Top and Front
    ctx.beginPath();
    ctx.moveTo(frontX, frontY);
    ctx.lineTo(frontX + sx(w), frontY);
    ctx.stroke();

    // Horizontal fold between Front and Bottom
    ctx.beginPath();
    ctx.moveTo(frontX, botY);
    ctx.lineTo(frontX + sx(w), botY);
    ctx.stroke();

    // Vertical folds between panels
    [leftX, frontX, rightX, backX].forEach((xPos) => {
      ctx.beginPath();
      ctx.moveTo(xPos, frontY);
      ctx.lineTo(xPos, frontY + sx(h));
      ctx.stroke();
    });

    ctx.setLineDash([]); // Reset dash
  }, [isDielineModalOpen, isBox, boxParams, showArtworkOverlay, selectedObject?.surfaceArtworks]);

  if (!isDielineModalOpen) return null;

  const handleDownloadDieline = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${project.name.replace(/\s+/g, '_')}_dieline.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-4xl bg-surface-100 border border-surface-300/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-surface-200 flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-gold/20 text-accent-gold border border-accent-gold/30 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'ar' ? 'مخطط القالب المنبسط (2D Dieline Template)' : '2D Unfolded Packaging Dieline'}
              </h3>
              <span className="text-[10px] text-surface-400">
                {language === 'ar' ? 'خطوط القص (أحمر)، خطوط الطي (أخضر منقط)، الأبعاد القياسية' : 'Standard cut lines (red), fold lines (dashed green)'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setDielineModalOpen(false)}
            className="p-1.5 text-surface-400 hover:text-white rounded-xl hover:bg-surface-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 px-6 border-b border-surface-200 bg-surface-50/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-surface-300 hover:text-white">
              <input
                type="checkbox"
                checked={showArtworkOverlay}
                onChange={(e) => setShowArtworkOverlay(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-brand-600 focus:ring-brand-500 bg-surface-200 border-surface-300"
              />
              <span>{language === 'ar' ? 'إظهار التصاميم على الأوجه' : 'Overlay Surface Artwork'}</span>
            </label>

            <div className="flex items-center gap-3 text-[11px] text-surface-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-red-500 rounded-full inline-block" />
                {language === 'ar' ? 'خط القص (Cut)' : 'Cut Line'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 border-b border-dashed border-emerald-400 inline-block" />
                {language === 'ar' ? 'خط الطي (Fold)' : 'Fold Line'}
              </span>
            </div>
          </div>

          <span className="font-mono text-xs text-brand-400 bg-surface-200 px-2.5 py-1 rounded-lg border border-surface-300/30">
            {w} × {h} × {d} mm
          </span>
        </div>

        {/* Canvas Body */}
        <div className="p-6 flex-1 flex items-center justify-center bg-surface-50/20 overflow-auto">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="w-full max-w-full h-auto rounded-2xl border border-surface-300/30 shadow-lg"
          />
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-surface-200 bg-surface-50 flex items-center justify-between">
          <button
            onClick={() => setDielineModalOpen(false)}
            className="px-4 py-2 rounded-xl text-surface-400 hover:text-white text-xs font-medium transition-colors"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>

          <button
            onClick={handleDownloadDieline}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-glow transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تحميل مخطط القالب (PNG)' : 'Download Dieline (PNG)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
