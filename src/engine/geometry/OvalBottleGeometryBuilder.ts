import * as THREE from 'three';
import { OvalBottleParameters } from '../../types';
import { toMeters } from '../../utils/units';

export interface OvalBottleGeometries {
  bodyGeometry: THREE.BufferGeometry;
  capGeometry: THREE.BufferGeometry;
  neckGeometry: THREE.BufferGeometry;
  totalHeightMeters: number;
}

/**
 * Builds parametric geometries for an oval/rectangular bottle with rounded profile.
 */
export function buildOvalBottleGeometries(params: OvalBottleParameters): OvalBottleGeometries {
  const totalH = Math.max(0.04, toMeters(params.height, 'mm'));
  const halfW = Math.max(0.01, toMeters(params.bodyWidth / 2, 'mm'));
  const halfD = Math.max(0.005, toMeters(params.bodyDepth / 2, 'mm'));
  const neckRadius = Math.max(0.003, toMeters(params.neckDiameter / 2, 'mm'));
  const neckH = Math.max(0.003, toMeters(params.neckHeight, 'mm'));
  const capRadius = Math.max(0.004, toMeters(params.capDiameter / 2, 'mm'));
  const capH = Math.max(0.004, toMeters(params.capHeight, 'mm'));

  const bodyH = totalH - neckH;
  const segmentsRadial = 36;
  const segmentsHeight = 24;

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Generate vertical levels from base y = 0 to shoulder y = bodyH
  for (let j = 0; j <= segmentsHeight; j++) {
    const v = j / segmentsHeight;
    const y = v * bodyH;

    // Shoulder taper: near the top (v > 0.75), transition smoothly from oval to neck radius
    let currentHalfW = halfW;
    let currentHalfD = halfD;

    if (v > 0.75) {
      const st = (v - 0.75) / 0.25; // 0 to 1
      const ease = Math.sin((st * Math.PI) / 2);
      currentHalfW = THREE.MathUtils.lerp(halfW, neckRadius * 1.1, ease);
      currentHalfD = THREE.MathUtils.lerp(halfD, neckRadius * 1.1, ease);
    }

    for (let i = 0; i <= segmentsRadial; i++) {
      const u = i / segmentsRadial;
      const angle = u * Math.PI * 2;

      // Superellipse / rounded rectangle formula for nice bottle ergonomics
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const x = Math.sign(cosA) * Math.pow(Math.abs(cosA), 0.85) * currentHalfW;
      const z = Math.sign(sinA) * Math.pow(Math.abs(sinA), 0.85) * currentHalfD;

      positions.push(x, y, z);

      // Normal
      const nx = x / Math.max(0.001, currentHalfW);
      const nz = z / Math.max(0.001, currentHalfD);
      const len = Math.sqrt(nx * nx + nz * nz) || 1;
      normals.push(nx / len, 0, nz / len);

      uvs.push(u, v);
    }
  }

  // Indices
  for (let j = 0; j < segmentsHeight; j++) {
    for (let i = 0; i < segmentsRadial; i++) {
      const a = j * (segmentsRadial + 1) + i;
      const b = (j + 1) * (segmentsRadial + 1) + i;
      const c = (j + 1) * (segmentsRadial + 1) + (i + 1);
      const d = j * (segmentsRadial + 1) + (i + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const bodyGeometry = new THREE.BufferGeometry();
  bodyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  bodyGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  bodyGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  bodyGeometry.setIndex(indices);
  bodyGeometry.computeVertexNormals();

  // Neck
  const neckGeometry = new THREE.CylinderGeometry(neckRadius, neckRadius, neckH, 32);
  neckGeometry.translate(0, bodyH + neckH / 2, 0);

  // Cap
  const capGeometry = new THREE.CylinderGeometry(capRadius, capRadius, capH, 32);
  capGeometry.translate(0, bodyH + capH / 2, 0);

  // Center around Y = 0
  const centerOffsetY = totalH / 2;
  bodyGeometry.translate(0, -centerOffsetY, 0);
  neckGeometry.translate(0, -centerOffsetY, 0);
  capGeometry.translate(0, -centerOffsetY, 0);

  return {
    bodyGeometry,
    capGeometry,
    neckGeometry,
    totalHeightMeters: totalH,
  };
}
