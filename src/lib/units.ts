import { Unit } from '../types';

export const UNIT_CONVERSIONS: Record<Unit, number> = {
  mm: 1,
  cm: 10,
  in: 25.4,
  m: 1000,
};

export function convertUnit(value: number, from: Unit, to: Unit): number {
  const valueInMm = value * UNIT_CONVERSIONS[from];
  return valueInMm / UNIT_CONVERSIONS[to];
}

// 1mm in Three.js world space = 0.01 units (100mm = 1 Three.js unit)
// This gives convenient camera distances (e.g. box 150mm = 1.5 units, camera at z=4)
export const THREE_SCALE = 0.01;

export function mmToThree(mm: number): number {
  return mm * THREE_SCALE;
}

export function threeToMm(threeUnits: number): number {
  return threeUnits / THREE_SCALE;
}

export function formatUnit(value: number, unit: Unit, decimals = 1): string {
  return `${Number(value.toFixed(decimals))} ${unit}`;
}