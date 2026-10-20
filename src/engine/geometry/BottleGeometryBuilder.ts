import * as THREE from 'three';
import { CylinderBottleParameters } from '../../types';
import { toMeters } from '../../utils/units';

export interface BottleGeometries {
  bodyGeometry: THREE.BufferGeometry;
  capGeometry: THREE.BufferGeometry;
  neckGeometry: THREE.BufferGeometry;
  bodyHeight: number;
  capHeight: number;
  totalHeightMeters: number;
}

/**
 * Builds parametric geometries for a cylindrical bottle/jar with separate body and cap.
 */
export function buildBottleGeometries(params: CylinderBottleParameters): BottleGeometries {
  const totalH = Math.max(0.02, toMeters(params.totalHeight, 'mm'));
  const bodyRadius = Math.max(0.005, toMeters(params.bodyDiameter / 2, 'mm'));
  const neckRadius = Math.max(0.002, toMeters(params.neckDiameter / 2, 'mm'));
  const neckH = Math.max(0.002, toMeters(params.neckHeight, 'mm'));
  const capRadius = Math.max(0.003, toMeters(params.capDiameter / 2, 'mm'));
  const capH = Math.max(0.003, toMeters(params.capHeight, 'mm'));
  const shoulderH = Math.max(0.002, toMeters(params.shoulderHeight, 'mm'));

  // Derived main cylindrical body height
  const bodyH = Math.max(0.01, totalH - neckH - shoulderH);

  // 1. Body Geometry: Lathe profile from base to neck transition
  // Profile points (r, y) where y goes from -totalH/2 to top
  const profilePoints: THREE.Vector2[] = [];
  const segments = 48;

  // Base
  profilePoints.push(new THREE.Vector2(0, 0));
  profilePoints.push(new THREE.Vector2(bodyRadius * 0.95, 0));
  profilePoints.push(new THREE.Vector2(bodyRadius, 0.001));

  // Body vertical wall
  profilePoints.push(new THREE.Vector2(bodyRadius, bodyH));

  // Shoulder transition based on shoulderStyle
  if (params.shoulderStyle === 'rounded') {
    for (let i = 1; i <= 6; i++) {
      const t = i / 6;
      const angle = (t * Math.PI) / 2;
      const r = neckRadius + (bodyRadius - neckRadius) * Math.cos(angle);
      const y = bodyH + shoulderH * Math.sin(angle);
      profilePoints.push(new THREE.Vector2(r, y));
    }
  } else if (params.shoulderStyle === 'chamfer') {
    profilePoints.push(new THREE.Vector2(bodyRadius, bodyH));
    profilePoints.push(new THREE.Vector2(neckRadius, bodyH + shoulderH));
  } else {
    // Sloped or Flat
    profilePoints.push(new THREE.Vector2(neckRadius, bodyH + shoulderH));
  }

  // Lathe the body profile
  const bodyGeometry = new THREE.LatheGeometry(profilePoints, segments);
  bodyGeometry.computeVertexNormals();

  // 2. Neck Geometry
  const neckGeometry = new THREE.CylinderGeometry(neckRadius, neckRadius, neckH, segments);
  neckGeometry.translate(0, bodyH + shoulderH + neckH / 2, 0);

  // 3. Cap Geometry
  const capGeometry = new THREE.CylinderGeometry(capRadius, capRadius, capH, segments);
  capGeometry.translate(0, bodyH + shoulderH + capH / 2, 0);

  // Center entire bottle around Y = 0 for easy framing and rotation
  const centerOffsetY = totalH / 2;
  bodyGeometry.translate(0, -centerOffsetY, 0);
  neckGeometry.translate(0, -centerOffsetY, 0);
  capGeometry.translate(0, -centerOffsetY, 0);

  return {
    bodyGeometry,
    capGeometry,
    neckGeometry,
    bodyHeight: bodyH,
    capHeight: capH,
    totalHeightMeters: totalH,
  };
}
