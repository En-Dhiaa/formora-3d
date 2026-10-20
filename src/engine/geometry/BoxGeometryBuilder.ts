import * as THREE from 'three';
import { BoxParameters, BoxSurface } from '../../types';
import { toMeters } from '../../utils/units';

export interface BoxFaceConfig {
  surface: BoxSurface;
  materialIndex: number;
  width: number;  // in meters
  height: number; // in meters
}

export const BOX_SURFACES: BoxSurface[] = ['right', 'left', 'top', 'bottom', 'front', 'back'];

export const BOX_SURFACE_INDICES: Record<BoxSurface, number> = {
  right: 0,
  left: 1,
  top: 2,
  bottom: 3,
  front: 4,
  back: 5,
};

/**
 * Builds parametric box geometry with proper UV coordinates and material groups
 * for front, back, left, right, top, and bottom.
 */
export function buildBoxGeometry(params: BoxParameters): THREE.BufferGeometry {
  const w = Math.max(0.005, toMeters(params.width, 'mm'));
  const h = Math.max(0.005, toMeters(params.height, 'mm'));
  const d = Math.max(0.005, toMeters(params.depth, 'mm'));

  // Standard Three.js BoxGeometry generates 6 faces:
  // 0: +X (Right)
  // 1: -X (Left)
  // 2: +Y (Top)
  // 3: -Y (Bottom)
  // 4: +Z (Front)
  // 5: -Z (Back)
  const geometry = new THREE.BoxGeometry(w, h, d, 2, 2, 2);

  // Normalize and correct UVs for each face so that artwork appears upright and unmirrored
  const uvs = geometry.attributes.uv;
  if (uvs) {
    // There are 6 faces * 4 vertices per face (or with segments, 6 groups of vertices)
    // BoxGeometry uses 4 vertices per face if 1 segment, with 2 segments it's 3x3=9 vertices per face.
    // Let's create with 1 segment for clean, precise 4-vertex UV mapping
  }

  return createCleanBoxGeometry(w, h, d);
}

/**
 * Creates clean box geometry with 6 distinct groups and guaranteed standard UV mapping (0,0 to 1,1)
 */
function createCleanBoxGeometry(w: number, h: number, d: number): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();

  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;

  // 6 faces: Right, Left, Top, Bottom, Front, Back
  // Each face has 4 vertices and 2 triangles (6 indices)
  // Positions:
  const positions: number[] = [
    // 0: +X Right face (normal: 1, 0, 0)
    hw, -hh,  hd,   hw, -hh, -hd,   hw,  hh, -hd,   hw,  hh,  hd,
    // 1: -X Left face (normal: -1, 0, 0)
   -hw, -hh, -hd,  -hw, -hh,  hd,  -hw,  hh,  hd,  -hw,  hh, -hd,
    // 2: +Y Top face (normal: 0, 1, 0)
   -hw,  hh,  hd,   hw,  hh,  hd,   hw,  hh, -hd,  -hw,  hh, -hd,
    // 3: -Y Bottom face (normal: 0, -1, 0)
   -hw, -hh, -hd,   hw, -hh, -hd,   hw, -hh,  hd,  -hw, -hh,  hd,
    // 4: +Z Front face (normal: 0, 0, 1)
   -hw, -hh,  hd,   hw, -hh,  hd,   hw,  hh,  hd,  -hw,  hh,  hd,
    // 5: -Z Back face (normal: 0, 0, -1)
    hw, -hh, -hd,  -hw, -hh, -hd,  -hw,  hh, -hd,   hw,  hh, -hd,
  ];

  // Normals:
  const normals: number[] = [
    // Right (+X)
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
    // Left (-X)
   -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    // Top (+Y)
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    // Bottom (-Y)
    0,-1, 0,  0,-1, 0,  0,-1, 0,  0,-1, 0,
    // Front (+Z)
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    // Back (-Z)
    0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1,
  ];

  // UV coordinates: (0,0) bottom-left, (1,0) bottom-right, (1,1) top-right, (0,1) top-left
  const uvs: number[] = [
    // Right (+X)
    0, 0,  1, 0,  1, 1,  0, 1,
    // Left (-X)
    0, 0,  1, 0,  1, 1,  0, 1,
    // Top (+Y)
    0, 0,  1, 0,  1, 1,  0, 1,
    // Bottom (-Y)
    0, 0,  1, 0,  1, 1,  0, 1,
    // Front (+Z)
    0, 0,  1, 0,  1, 1,  0, 1,
    // Back (-Z)
    0, 0,  1, 0,  1, 1,  0, 1,
  ];

  // Indices: 2 triangles per face (0,1,2 and 0,2,3)
  const indices: number[] = [];
  for (let i = 0; i < 6; i++) {
    const base = i * 4;
    indices.push(base, base + 1, base + 2);
    indices.push(base, base + 2, base + 3);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  // Set 6 groups, each corresponding to materialIndex 0..5
  for (let face = 0; face < 6; face++) {
    geometry.addGroup(face * 6, 6, face);
  }

  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return geometry;
}
