import * as THREE from 'three';
import { CustomLatheParameters } from '../../types';
import { toMeters } from '../../utils/units';

export interface LatheGeometries {
  geometry: THREE.BufferGeometry;
  totalHeightMeters: number;
}

/**
 * Builds a rotational 3D lathe geometry from user-defined 2D profile points (radius, height).
 */
export function buildCustomLatheGeometry(params: CustomLatheParameters): LatheGeometries {
  const points = (params.profilePoints || []).map(
    (pt) => new THREE.Vector2(Math.max(0, toMeters(pt.r, 'mm')), toMeters(pt.y, 'mm'))
  );

  // If no points provided, fallback to a classic vase profile
  if (points.length < 2) {
    const defaultH = toMeters(params.height || 150, 'mm');
    const defaultR = toMeters(35, 'mm');
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(defaultR, 0));
    points.push(new THREE.Vector2(defaultR * 1.1, defaultH * 0.4));
    points.push(new THREE.Vector2(defaultR * 0.6, defaultH * 0.8));
    points.push(new THREE.Vector2(defaultR * 0.7, defaultH));
  }

  const segments = params.segments || 48;
  const geometry = new THREE.LatheGeometry(points, segments);
  geometry.computeVertexNormals();

  const totalH = toMeters(params.height || 150, 'mm');
  geometry.translate(0, -totalH / 2, 0);

  return {
    geometry,
    totalHeightMeters: totalH,
  };
}
