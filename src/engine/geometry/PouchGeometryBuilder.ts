import * as THREE from 'three';
import { PouchParameters } from '../../types';
import { toMeters } from '../../utils/units';

export interface PouchGeometries {
  geometry: THREE.BufferGeometry;
  widthMeters: number;
  heightMeters: number;
}

/**
 * Builds a parametric flexible stand-up pouch with pillowed body and side/top heat seals.
 */
export function buildPouchGeometry(params: PouchParameters): PouchGeometries {
  const w = Math.max(0.04, toMeters(params.width, 'mm'));
  const h = Math.max(0.06, toMeters(params.height, 'mm'));
  const gussetD = Math.max(0.01, toMeters(params.gussetDepth, 'mm'));
  const sealW = Math.max(0.003, toMeters(params.sealWidth, 'mm'));

  const segmentsX = 24;
  const segmentsY = 32;

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const hw = w / 2;
  const hh = h / 2;

  // We generate a closed double-sided mesh (Front side: Z > 0, Back side: Z < 0)
  // Let side parameter 's' be 1 for front, -1 for back
  for (const side of [1, -1]) {
    const baseVertex = positions.length / 3;

    for (let j = 0; j <= segmentsY; j++) {
      const v = j / segmentsY;
      const y = -hh + v * h;

      // Bottom gusset expansion: widest near bottom, tapering to flat seal at top
      // Vertical pillow factor
      const verticalPillow = Math.sin(v * Math.PI) * 0.7 + (1 - v) * 0.3;

      for (let i = 0; i <= segmentsX; i++) {
        const u = i / segmentsX;
        const x = -hw + u * w;

        // Check if inside seal margins
        const isSideSeal = Math.abs(x) > (hw - sealW);
        const isTopSeal = y > (hh - sealW);
        const isBottomSeal = y < (-hh + sealW);

        let z = 0;
        if (!isSideSeal && !isTopSeal && (!isBottomSeal || params.standUpBase)) {
          // Horizontal pillow factor: 0 at edges, 1 at center
          const horizontalPillow = Math.sin(u * Math.PI);
          const maxZ = (gussetD / 2) * verticalPillow * horizontalPillow;
          z = maxZ * side;
        }

        positions.push(x, y, z);

        // Calculate approximate surface normal
        const nx = (x / hw) * 0.3 * side;
        const ny = (y / hh) * 0.2;
        const nz = side * 0.9;
        normals.push(nx, ny, nz);

        // UV coordinates (U un-mirrored for front, inverted for back)
        const uvU = side === 1 ? u : 1 - u;
        uvs.push(uvU, v);
      }
    }

    // Indices for this side
    for (let j = 0; j < segmentsY; j++) {
      for (let i = 0; i < segmentsX; i++) {
        const a = baseVertex + j * (segmentsX + 1) + i;
        const b = baseVertex + (j + 1) * (segmentsX + 1) + i;
        const c = baseVertex + (j + 1) * (segmentsX + 1) + (i + 1);
        const d = baseVertex + j * (segmentsX + 1) + (i + 1);

        if (side === 1) {
          indices.push(a, d, c);
          indices.push(a, c, b);
        } else {
          indices.push(a, b, c);
          indices.push(a, c, d);
        }
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return {
    geometry,
    widthMeters: w,
    heightMeters: h,
  };
}
