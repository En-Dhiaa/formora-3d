import { Unit } from '../types';

// Internal Three.js unit is meters (1 unit = 1 meter)
// Physical packaging dimensions in the UI are commonly entered in mm, cm, or inches.

export const MM_TO_METERS = 0.001;
export const CM_TO_METERS = 0.01;
export const INCH_TO_METERS = 0.0254;

/**
 * Convert user display value in given unit to Three.js internal meters
 */
export function toMeters(value: number, fromUnit: Unit): number {
  switch (fromUnit) {
    case 'mm':
      return value * MM_TO_METERS;
    case 'cm':
      return value * CM_TO_METERS;
    case 'in':
      return value * INCH_TO_METERS;
    case 'm':
      return value;
    default:
      return value * MM_TO_METERS;
  }
}

/**
 * Convert internal meters back to user display unit
 */
export function fromMeters(meters: number, toUnit: Unit): number {
  switch (toUnit) {
    case 'mm':
      return meters / MM_TO_METERS;
    case 'cm':
      return meters / CM_TO_METERS;
    case 'in':
      return meters / INCH_TO_METERS;
    case 'm':
      return meters;
    default:
      return meters / MM_TO_METERS;
  }
}

/**
 * Convert directly between any two user units
 */
export function convertUnit(value: number, from: Unit, to: Unit): number {
  const inMeters = toMeters(value, from);
  return fromMeters(inMeters, to);
}

/**
 * Format a dimension with its unit symbol
 */
export function formatDimension(value: number, unit: Unit, decimals: number = 1): string {
  const rounded = Number(value.toFixed(decimals));
  return `${rounded} ${unit}`;
}
