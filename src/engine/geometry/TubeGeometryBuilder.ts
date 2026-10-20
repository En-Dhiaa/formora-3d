import * as THREE from 'three';
import { TubeParameters } from '../../types';
import { toMeters } from '../../utils/units';

export interface TubeGeometries {
  bodyGeometry: THREE.BufferGeometry;
  capGeometry: THREE.BufferGeometry;
  totalLengthMeters: number;
}

/**
 * Builds a parametric squeeze tube with realistic transition
 * from round shoulder to flat crimped top seal.
 */
export function buildTubeGeometries(params: TubeParameters): TubeGeometries {
  const totalL = Math.max(0.04, toMeters(params.totalLength, 'mm'));
  const bodyRadius = Math.max(0.005, toMeters(params.bodyDiameter / 2, 'mm'));
  const capRadius = Math.max(0.005, toMeters(params.capDiameter / 2, 'mm'));
  const capH = Math.max(0.005, toMeters(params.capHeight, 'mm'));
  const crimpH = Math.max(0.003, toMeters(params.crimpHeight, 'mm'));

  const tubeH = totalL - capH;
  const radialSegments = 32;
  const heightSegments = 30;

  // Final flat width is approximately half the circumference: (PI * D) / 2
  const maxFlatRadiusX = (Math.PI * bodyRadius);
  const minThicknessZ = 0.001; // 1mm thin at crimp

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Generate grid of vertices from y = 0 (shoulder) to y = tubeH (top crimp)
  for (let j = 0; j <= heightSegments; j++) {
    const v = j / heightSegments;
    const y = v * tubeH;

    // Transition factor: t goes from 0 (round) to 1 (flat crimp)
    // S-curve for realistic tube profile
    const t = Math.pow(v, 1.8);

    const radiusX = THREE.MathUtils.lerp(bodyRadius, maxFlatRadiusX, t);
    const radiusZ = THREE.MathUtils.lerp(bodyRadius, minThicknessZ, t);

    for (let i = 0; i <= radialSegments; i++) {
      const u = i / radialSegments;
      const angle = u * Math.PI * 2;

      const x = Math.cos(angle) * radiusX;
      const z = Math.sin(angle) * radiusZ;

      positions.push(x, y, z);

      // Approximate normal
      const nx = Math.cos(angle);
      const ny = 0;
      const nz = Math.sin(angle);
      normals.push(nx, ny, nz);

      uvs.push(u, v);
    }
  }

  // Generate indices
  for (let j = 0; j < heightSegments; j++) {
    for (let i = 0; i < radialSegments; i++) {
      const a = j * (radialSegments + 1) + i;
      const b = (j + 1) * (radialSegments + 1) + i;
      const c = (j + 1) * (radialSegments + 1) + (i + 1);
      const d = j * (radialSegments + 1) + (i + 1);

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

  // Cap Geometry (stands at the base y = -capH to y = 0)
  const capGeometry = new THREE.CylinderGeometry(capRadius, capRadius, capH, 32);
  capGeometry.translate(0, -capH / 2, 0);

  // Center whole tube around Y = 0
  const centerOffsetY = totalL / 2 - capH;
  bodyGeometry.translate(0, -centerOffsetY, 0);
  capGeometry.translate(0, -centerOffsetY, 0);

  return {
    bodyGeometry,
    capGeometry,
    totalLengthMeters: totalL,
  };
}
