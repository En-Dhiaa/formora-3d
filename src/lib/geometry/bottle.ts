import { CylinderBottleParameters, OvalBottleParameters, SurfaceDimensions, Unit } from '../../types';
import { convertUnit } from '../units';

export const BOTTLE_SURFACES = ['body', 'front_label', 'back_label', 'neck', 'cap_top', 'cap_side'];

export function calculateCylinderBottleSurfaces(
  params: CylinderBottleParameters,
  currentUnit: Unit
): SurfaceDimensions[] {
  const { totalHeight, bodyDiameter, neckHeight, capHeight } = params;

  // Approximate body height = totalHeight - neckHeight - capHeight
  const bodyHeight = Math.max(10, totalHeight - neckHeight - capHeight);
  const circumference = Math.PI * bodyDiameter;

  const h = convertUnit(bodyHeight, 'mm', currentUnit);
  const circ = convertUnit(circumference, 'mm', currentUnit);
  const capH = convertUnit(capHeight, 'mm', currentUnit);
  const capCirc = convertUnit(Math.PI * params.capDiameter, 'mm', currentUnit);

  // Wrap-around label or front label
  const labelWidth = Number((circ * 0.45).toFixed(2));
  const labelHeight = Number((h * 0.7).toFixed(2));

  return [
    {
      key: 'body',
      labelAr: 'جسم القارورة (التفاف كامل 360°)',
      labelEn: 'Bottle Body (360° Wrap)',
      width: Number(circ.toFixed(2)),
      height: Number(h.toFixed(2)),
      aspectRatio: Number((circ / h).toFixed(3)),
    },
    {
      key: 'front_label',
      labelAr: 'الملصق الأمامي',
      labelEn: 'Front Label',
      width: labelWidth,
      height: labelHeight,
      aspectRatio: Number((labelWidth / labelHeight).toFixed(3)),
    },
    {
      key: 'back_label',
      labelAr: 'الملصق الخلفي',
      labelEn: 'Back Label',
      width: labelWidth,
      height: labelHeight,
      aspectRatio: Number((labelWidth / labelHeight).toFixed(3)),
    },
    {
      key: 'cap_side',
      labelAr: 'محيط الغطاء',
      labelEn: 'Cap Band',
      width: Number(capCirc.toFixed(2)),
      height: Number(capH.toFixed(2)),
      aspectRatio: Number((capCirc / capH).toFixed(3)),
    },
    {
      key: 'cap_top',
      labelAr: 'قمة الغطاء',
      labelEn: 'Cap Top',
      width: Number(convertUnit(params.capDiameter, 'mm', currentUnit).toFixed(2)),
      height: Number(convertUnit(params.capDiameter, 'mm', currentUnit).toFixed(2)),
      aspectRatio: 1.0,
    },
  ];
}

export function calculateOvalBottleSurfaces(
  params: OvalBottleParameters,
  currentUnit: Unit
): SurfaceDimensions[] {
  const { bodyWidth, bodyDepth, height, capHeight, capDiameter } = params;
  const labelW = convertUnit(bodyWidth * 0.85, 'mm', currentUnit);
  const labelH = convertUnit(height * 0.65, 'mm', currentUnit);
  const capD = convertUnit(capDiameter, 'mm', currentUnit);
  const capH = convertUnit(capHeight, 'mm', currentUnit);

  return [
    {
      key: 'front_label',
      labelAr: 'الملصق الأمامي المقوس',
      labelEn: 'Front Curved Label',
      width: Number(labelW.toFixed(2)),
      height: Number(labelH.toFixed(2)),
      aspectRatio: Number((labelW / labelH).toFixed(3)),
    },
    {
      key: 'back_label',
      labelAr: 'الملصق الخلفي',
      labelEn: 'Back Label',
      width: Number(labelW.toFixed(2)),
      height: Number(labelH.toFixed(2)),
      aspectRatio: Number((labelW / labelH).toFixed(3)),
    },
    {
      key: 'cap_top',
      labelAr: 'قمة الغطاء',
      labelEn: 'Cap Top',
      width: Number(capD.toFixed(2)),
      height: Number(capD.toFixed(2)),
      aspectRatio: 1.0,
    },
    {
      key: 'cap_side',
      labelAr: 'محيط الغطاء',
      labelEn: 'Cap Side',
      width: Number((Math.PI * capD).toFixed(2)),
      height: Number(capH.toFixed(2)),
      aspectRatio: Number(((Math.PI * capD) / capH).toFixed(3)),
    },
  ];
}