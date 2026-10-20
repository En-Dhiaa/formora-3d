/**
 * Procedural texture generation for FORMORA 3D
 * Generates tactile substrate normal/bump patterns and high-res placeholder artworks
 * directly on in-memory HTML5 Canvas.
 */

import { SubstrateTextureType } from '../types';

/**
 * Generate a procedural normal/bump canvas texture for physical substrates
 */
export function generateSubstrateDataUrl(
  type: SubstrateTextureType,
  width: number = 256,
  height: number = 256
): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  switch (type) {
    case 'paper_grain': {
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 35;
        const val = Math.min(255, Math.max(0, 128 + noise));
        data[i] = val;     // R
        data[i + 1] = val; // G
        data[i + 2] = val; // B
        data[i + 3] = 255; // A
      }
      break;
    }

    case 'cardboard_fiber': {
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 45;
        const val = Math.min(255, Math.max(0, 120 + noise));
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);

      // Add horizontal/vertical fiber streaks
      ctx.strokeStyle = 'rgba(80, 80, 80, 0.15)';
      ctx.lineWidth = 1;
      for (let j = 0; j < 60; j++) {
        const y = Math.random() * height;
        const x = Math.random() * width;
        const len = 15 + Math.random() * 35;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + len, y + (Math.random() - 0.5) * 4);
        ctx.stroke();
      }
      return canvas.toDataURL('image/png');
    }

    case 'plastic_stipple': {
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        const cell = Math.sin(x * 0.4) * Math.cos(y * 0.4) * 20;
        const noise = (Math.random() - 0.5) * 20;
        const val = Math.min(255, Math.max(0, 128 + cell + noise));
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }
      break;
    }

    case 'brushed_metal': {
      for (let y = 0; y < height; y++) {
        const rowNoise = (Math.random() - 0.5) * 40;
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const pixelNoise = (Math.random() - 0.5) * 10;
          const val = Math.min(255, Math.max(0, 128 + rowNoise + pixelNoise));
          data[idx] = val;
          data[idx + 1] = val;
          data[idx + 2] = val;
          data[idx + 3] = 255;
        }
      }
      break;
    }

    default:
      return '';
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Generate a clean, branded sample artwork for cartons or bottles
 */
export function generateSampleArtworkDataUrl(
  surface: string,
  labelAr: string,
  labelEn: string,
  accentColor: string = '#6366f1',
  bgColor: string = '#ffffff',
  width: number = 800,
  height: number = 1000
): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Border & subtle framing
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 12;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  ctx.fillStyle = accentColor;
  ctx.fillRect(40, 40, width - 80, 10);

  // Surface header tag
  ctx.fillStyle = accentColor;
  ctx.fillRect(width / 2 - 120, 60, 240, 36);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Cairo, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(surface.toUpperCase(), width / 2, 78);

  // Brand Name & Title
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 54px Cairo, sans-serif';
  ctx.fillText('FORMORA', width / 2, height * 0.28);

  ctx.font = '600 24px Cairo, sans-serif';
  ctx.fillStyle = accentColor;
  ctx.fillText('LUXURY PACKAGING LAB', width / 2, height * 0.33);

  // Decorative icon / emblem
  ctx.beginPath();
  ctx.arc(width / 2, height * 0.46, 55, 0, Math.PI * 2);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(width / 2, height * 0.46, 42, 0, Math.PI * 2);
  ctx.fillStyle = `${accentColor}15`;
  ctx.fill();

  ctx.fillStyle = accentColor;
  ctx.font = 'bold 36px Cairo, sans-serif';
  ctx.fillText('F', width / 2, height * 0.46 + 4);

  // Arabic Title & Subtitle
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 32px Cairo, sans-serif';
  ctx.fillText(labelAr, width / 2, height * 0.62);

  ctx.fillStyle = '#6b7280';
  ctx.font = '500 20px Inter, sans-serif';
  ctx.fillText(labelEn, width / 2, height * 0.67);

  // Sample Specs / Barcode line
  ctx.fillStyle = '#9ca3af';
  ctx.font = '16px Inter, sans-serif';
  ctx.fillText('100% ORGANIC & PREMIUM FORMULA', width / 2, height * 0.77);
  ctx.fillText('NET WT. 250ml / 8.45 FL. OZ', width / 2, height * 0.81);

  // Barcode mockup
  const barcodeY = height * 0.88;
  const barcodeW = width * 0.5;
  const startX = (width - barcodeW) / 2;
  ctx.fillStyle = '#111827';
  for (let x = startX; x < startX + barcodeW; x += 6) {
    const barWidth = (x % 12 === 0) ? 3 : 1.5;
    ctx.fillRect(x, barcodeY, barWidth, 40);
  }

  return canvas.toDataURL('image/png');
}
