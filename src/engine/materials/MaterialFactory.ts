import * as THREE from 'three';
import { MaterialPresetType, MaterialProperties } from '../../types';

export const MATERIAL_PRESETS: Record<MaterialPresetType, MaterialProperties> = {
  matte_cardboard: {
    preset: 'matte_cardboard',
    color: '#fdfbf7',
    roughness: 0.88,
    metalness: 0.0,
    transmission: 0.0,
    ior: 1.45,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    opacity: 1.0,
    transparent: false,
    substrate: 'cardboard_fiber',
    substrateStrength: 0.35,
  },
  glossy_cardboard: {
    preset: 'glossy_cardboard',
    color: '#ffffff',
    roughness: 0.22,
    metalness: 0.0,
    transmission: 0.0,
    ior: 1.5,
    clearcoat: 0.85,
    clearcoatRoughness: 0.12,
    opacity: 1.0,
    transparent: false,
    substrate: 'paper_grain',
    substrateStrength: 0.15,
  },
  paper_label: {
    preset: 'paper_label',
    color: '#ffffff',
    roughness: 0.65,
    metalness: 0.0,
    transmission: 0.0,
    ior: 1.48,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
    opacity: 1.0,
    transparent: false,
    substrate: 'paper_grain',
    substrateStrength: 0.25,
  },
  clear_glass: {
    preset: 'clear_glass',
    color: '#ffffff',
    roughness: 0.04,
    metalness: 0.05,
    transmission: 0.96,
    ior: 1.52,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    opacity: 1.0,
    transparent: true,
    substrate: 'none',
    substrateStrength: 0.0,
  },
  amber_glass: {
    preset: 'amber_glass',
    color: '#b45309',
    roughness: 0.08,
    metalness: 0.02,
    transmission: 0.88,
    ior: 1.54,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    opacity: 1.0,
    transparent: true,
    substrate: 'none',
    substrateStrength: 0.0,
  },
  opaque_plastic: {
    preset: 'opaque_plastic',
    color: '#f8fafc',
    roughness: 0.42,
    metalness: 0.0,
    transmission: 0.0,
    ior: 1.46,
    clearcoat: 0.15,
    clearcoatRoughness: 0.2,
    opacity: 1.0,
    transparent: false,
    substrate: 'plastic_stipple',
    substrateStrength: 0.3,
  },
  glossy_plastic: {
    preset: 'glossy_plastic',
    color: '#1e293b',
    roughness: 0.12,
    metalness: 0.02,
    transmission: 0.0,
    ior: 1.49,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    opacity: 1.0,
    transparent: false,
    substrate: 'none',
    substrateStrength: 0.0,
  },
  brushed_metal: {
    preset: 'brushed_metal',
    color: '#e2e8f0',
    roughness: 0.38,
    metalness: 0.92,
    transmission: 0.0,
    ior: 2.2,
    clearcoat: 0.1,
    clearcoatRoughness: 0.2,
    opacity: 1.0,
    transparent: false,
    substrate: 'brushed_metal',
    substrateStrength: 0.45,
  },
  reflective_metal: {
    preset: 'reflective_metal',
    color: '#f1f5f9',
    roughness: 0.05,
    metalness: 0.98,
    transmission: 0.0,
    ior: 2.5,
    clearcoat: 0.6,
    clearcoatRoughness: 0.05,
    opacity: 1.0,
    transparent: false,
    substrate: 'none',
    substrateStrength: 0.0,
  },
  foil_pouch: {
    preset: 'foil_pouch',
    color: '#e0e7ff',
    roughness: 0.28,
    metalness: 0.85,
    transmission: 0.0,
    ior: 1.8,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    opacity: 1.0,
    transparent: false,
    substrate: 'cardboard_fiber',
    substrateStrength: 0.2,
  },
  rubber_matte: {
    preset: 'rubber_matte',
    color: '#18181b',
    roughness: 0.92,
    metalness: 0.0,
    transmission: 0.0,
    ior: 1.4,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    opacity: 1.0,
    transparent: false,
    substrate: 'plastic_stipple',
    substrateStrength: 0.4,
  },
  custom: {
    preset: 'custom',
    color: '#ffffff',
    roughness: 0.5,
    metalness: 0.0,
    transmission: 0.0,
    ior: 1.5,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    opacity: 1.0,
    transparent: false,
    substrate: 'none',
    substrateStrength: 0.0,
  },
};

export class MaterialFactory {
  /**
   * Creates a high-fidelity Three.js MeshPhysicalMaterial
   */
  public static createMaterial(
    props: MaterialProperties,
    artworkTexture: THREE.CanvasTexture | null = null,
    substrateTexture: THREE.CanvasTexture | null = null
  ): THREE.MeshPhysicalMaterial {
    const isTransmissive = props.transmission > 0.05;

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(props.color),
      roughness: Math.max(0.01, Math.min(1.0, props.roughness)),
      metalness: Math.max(0.0, Math.min(1.0, props.metalness)),
      transmission: props.transmission,
      ior: Math.max(1.0, Math.min(2.5, props.ior)),
      clearcoat: Math.max(0.0, Math.min(1.0, props.clearcoat)),
      clearcoatRoughness: Math.max(0.01, Math.min(1.0, props.clearcoatRoughness)),
      opacity: Math.max(0.0, Math.min(1.0, props.opacity)),
      transparent: props.transparent || isTransmissive || props.opacity < 0.99,
      depthWrite: !isTransmissive,
      side: THREE.DoubleSide,
    });

    if (artworkTexture) {
      mat.map = artworkTexture;
      mat.map.colorSpace = THREE.SRGBColorSpace;
      mat.map.needsUpdate = true;
    }

    if (substrateTexture && props.substrate !== 'none' && props.substrateStrength > 0) {
      mat.bumpMap = substrateTexture;
      mat.bumpScale = props.substrateStrength * 0.002;
    }

    return mat;
  }
}
