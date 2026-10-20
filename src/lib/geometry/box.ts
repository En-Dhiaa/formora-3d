import { BoxParameters, SurfaceDimensions, BoxSurface, Unit } from '../../types';
import { convertUnit } from '../units';

export const BOX_SURFACES: BoxSurface[] = ['front', 'back', 'left', 'right', 'top', 'bottom'];

export const SURFACE_LABELS: Record<BoxSurface, { ar: string; en: string }> = {
  front: { ar: 'الواجهة الأمامية', en: 'Front Face' },
  back: { ar: 'الواجهة الخلفية', en: 'Back Face' },
  left: { ar: 'الجانب الأيسر', en: 'Left Side' },
  right: { ar: 'الجانب الأيمن', en: 'Right Side' },
  top: { ar: 'الغطاء العلوي', en: 'Top Face' },
  bottom: { ar: 'القاعدة السفلية', en: 'Bottom Face' },
};

/**
 * Calculates real-world dimensions for each surface of a rectangular carton
 */
export function calculateBoxSurfaces(
  params: BoxParameters,
  currentUnit: Unit
): SurfaceDimensions[] {
  const { width, height, depth } = params;

  // Convert from stored mm to current display unit
  const w = convertUnit(width, 'mm', currentUnit);
  const h = convertUnit(height, 'mm', currentUnit);
  const d = convertUnit(depth, 'mm', currentUnit);

  return [
    {
      key: 'front',
      labelAr: SURFACE_LABELS.front.ar,
      labelEn: SURFACE_LABELS.front.en,
      width: Number(w.toFixed(2)),
      height: Number(h.toFixed(2)),
      aspectRatio: Number((w / h).toFixed(3)),
    },
    {
      key: 'back',
      labelAr: SURFACE_LABELS.back.ar,
      labelEn: SURFACE_LABELS.back.en,
      width: Number(w.toFixed(2)),
      height: Number(h.toFixed(2)),
      aspectRatio: Number((w / h).toFixed(3)),
    },
    {
      key: 'left',
      labelAr: SURFACE_LABELS.left.ar,
      labelEn: SURFACE_LABELS.left.en,
      width: Number(d.toFixed(2)),
      height: Number(h.toFixed(2)),
      aspectRatio: Number((d / h).toFixed(3)),
    },
    {
      key: 'right',
      labelAr: SURFACE_LABELS.right.ar,
      labelEn: SURFACE_LABELS.right.en,
      width: Number(d.toFixed(2)),
      height: Number(h.toFixed(2)),
      aspectRatio: Number((d / h).toFixed(3)),
    },
    {
      key: 'top',
      labelAr: SURFACE_LABELS.top.ar,
      labelEn: SURFACE_LABELS.top.en,
      width: Number(w.toFixed(2)),
      height: Number(d.toFixed(2)),
      aspectRatio: Number((w / d).toFixed(3)),
    },
    {
      key: 'bottom',
      labelAr: SURFACE_LABELS.bottom.ar,
      labelEn: SURFACE_LABELS.bottom.en,
      width: Number(w.toFixed(2)),
      height: Number(d.toFixed(2)),
      aspectRatio: Number((w / d).toFixed(3)),
    },
  ];
}

/**
 * Three.js BoxGeometry material face index mapping:
 * 0: +X (Right)
 * 1: -X (Left)
 * 2: +Y (Top)
 * 3: -Y (Bottom)
 * 4: +Z (Front)
 * 5: -Z (Back)
 */
export const BOX_MATERIAL_INDICES: Record<BoxSurface, number> = {
  right: 0,
  left: 1,
  top: 2,
  bottom: 3,
  front: 4,
  back: 5,
};

export const BOX_INDEX_TO_SURFACE: Record<number, BoxSurface> = {
  0: 'right',
  1: 'left',
  2: 'top',
  3: 'bottom',
  4: 'front',
  5: 'back',
};

/**
 * Validates box parameters to avoid zero or negative dimensions
 */
export function validateBoxParameters(params: BoxParameters): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (params.width <= 0) errors.push('العرض يجب أن يكون أكبر من الصفر (Width must be > 0)');
  if (params.height <= 0) errors.push('الارتفاع يجب أن يكون أكبر من الصفر (Height must be > 0)');
  if (params.depth <= 0) errors.push('العمق يجب أن يكون أكبر من الصفر (Depth must be > 0)');
  if (params.cornerRadius < 0) errors.push('نصف قطر الحواف لا يمكن أن يكون سالباً (Corner radius cannot be negative)');
  
  const maxRadius = Math.min(params.width, params.height, params.depth) / 2;
  if (params.cornerRadius > maxRadius) {
    errors.push(`نصف قطر الحواف يتجاوز الحد الأقصى المسموح (${maxRadius.toFixed(1)} مم)`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}