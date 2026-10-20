import {
  FormoraProject,
  PackagingObject,
  StudioLighting,
  StudioCamera,
  SceneBackground,
} from '../types';
import { MATERIAL_PRESETS } from '../engine/materials/MaterialFactory';
import { generateSampleArtworkDataUrl } from './proceduralTextures';

export const DEFAULT_LIGHTING: StudioLighting = {
  preset: 'soft_commercial',
  keyLight: {
    enabled: true,
    color: '#ffffff',
    intensity: 1.8,
    position: [1.8, 2.5, 2.0],
    castShadow: true,
    shadowSoftness: 1.5,
  },
  fillLight: {
    enabled: true,
    color: '#e0e7ff',
    intensity: 0.9,
    position: [-2.0, 1.5, 1.5],
    castShadow: false,
  },
  rimLight: {
    enabled: true,
    color: '#c7d2fe',
    intensity: 1.2,
    position: [0.0, 2.2, -2.5],
    castShadow: false,
  },
  topLight: {
    enabled: true,
    color: '#ffffff',
    intensity: 0.6,
    position: [0.0, 3.5, 0.0],
    castShadow: true,
  },
  ambientLight: {
    enabled: true,
    color: '#f8fafc',
    intensity: 0.45,
  },
  contactShadows: {
    enabled: true,
    opacity: 0.55,
    blur: 2.2,
  },
};

export const DEFAULT_CAMERA: StudioCamera = {
  preset: 'three_quarter_front',
  mode: 'perspective',
  fov: 38,
  position: [0.45, 0.35, 0.75],
  target: [0, 0.04, 0],
  zoom: 1,
};

export const DEFAULT_BACKGROUND: SceneBackground = {
  mode: 'studio_floor',
  color1: '#0e1117',
  color2: '#1a1f2c',
  gradientAngle: 180,
  floorColor: '#121620',
  floorRoughness: 0.4,
  floorReflectivity: 0.25,
  showPedestal: false,
  pedestalType: 'cylinder',
  pedestalColor: '#1f242e',
};

/**
 * Creates a default starter project with a rectangular carton box and an amber dropper bottle
 */
export function createDefaultProject(): FormoraProject {
  const boxArtworkFront = typeof document !== 'undefined'
    ? generateSampleArtworkDataUrl('front', 'سيروم التجديد المركز', 'Advanced Renewal Serum', '#6366f1', '#ffffff')
    : '';
  const boxArtworkBack = typeof document !== 'undefined'
    ? generateSampleArtworkDataUrl('back', 'المكونات وطريقة الاستخدام', 'Ingredients & Directions', '#6366f1', '#f8fafc')
    : '';
  const boxArtworkLeft = typeof document !== 'undefined'
    ? generateSampleArtworkDataUrl('left', 'مستخلصات عضوية 100%', 'Certified Organic Lab', '#6366f1', '#ffffff')
    : '';
  const boxArtworkRight = typeof document !== 'undefined'
    ? generateSampleArtworkDataUrl('right', 'صنع في المملكة', 'Premium Quality Standards', '#6366f1', '#ffffff')
    : '';

  const bottleLabel = typeof document !== 'undefined'
    ? generateSampleArtworkDataUrl('front_label', 'سيروم الوجه الليلي', 'Night Recovery Elixir', '#f59e0b', '#fffbeb', 600, 600)
    : '';

  const cartonBox: PackagingObject = {
    id: 'prod-box-01',
    name: 'علبة الكرتون الفاخرة (Outer Box)',
    visible: true,
    locked: false,
    templateType: 'box',
    dimensionUnit: 'mm',
    lockAspectRatio: false,
    geometry: {
      type: 'box',
      params: {
        width: 75,
        height: 155,
        depth: 75,
        cornerRadius: 1.5,
        hasLid: true,
      },
    },
    surfaceArtworks: {
      front: boxArtworkFront
        ? {
            id: 'art-front',
            surfaceKey: 'front',
            imageSrc: boxArtworkFront,
            fitMode: 'fill',
            offsetX: 0,
            offsetY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            flipHorizontal: false,
            flipVertical: false,
            repeat: false,
            opacity: 1,
          }
        : null,
      back: boxArtworkBack
        ? {
            id: 'art-back',
            surfaceKey: 'back',
            imageSrc: boxArtworkBack,
            fitMode: 'fill',
            offsetX: 0,
            offsetY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            flipHorizontal: false,
            flipVertical: false,
            repeat: false,
            opacity: 1,
          }
        : null,
      left: boxArtworkLeft
        ? {
            id: 'art-left',
            surfaceKey: 'left',
            imageSrc: boxArtworkLeft,
            fitMode: 'fill',
            offsetX: 0,
            offsetY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            flipHorizontal: false,
            flipVertical: false,
            repeat: false,
            opacity: 1,
          }
        : null,
      right: boxArtworkRight
        ? {
            id: 'art-right',
            surfaceKey: 'right',
            imageSrc: boxArtworkRight,
            fitMode: 'fill',
            offsetX: 0,
            offsetY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            flipHorizontal: false,
            flipVertical: false,
            repeat: false,
            opacity: 1,
          }
        : null,
      top: null,
      bottom: null,
    },
    materials: {
      body: { ...MATERIAL_PRESETS.matte_cardboard, color: '#ffffff' },
    },
    transform: {
      position: [-0.065, 0.0775, -0.02],
      rotation: [0, 0.25, 0],
      scale: [1, 1, 1],
    },
  };

  const dropperBottle: PackagingObject = {
    id: 'prod-bottle-02',
    name: 'قارورة زجاجية عنبرية (Amber Dropper)',
    visible: true,
    locked: false,
    templateType: 'cylinder_bottle',
    dimensionUnit: 'mm',
    lockAspectRatio: false,
    geometry: {
      type: 'cylinder_bottle',
      params: {
        totalHeight: 125,
        bodyDiameter: 48,
        shoulderHeight: 16,
        shoulderStyle: 'rounded',
        neckDiameter: 22,
        neckHeight: 14,
        capDiameter: 24,
        capHeight: 28,
        taper: 1,
      },
    },
    surfaceArtworks: {
      front_label: bottleLabel
        ? {
            id: 'art-bottle-front',
            surfaceKey: 'front_label',
            imageSrc: bottleLabel,
            fitMode: 'fit',
            offsetX: 0,
            offsetY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            flipHorizontal: false,
            flipVertical: false,
            repeat: false,
            opacity: 1,
          }
        : null,
      body: null,
      back_label: null,
      cap_top: null,
      cap_side: null,
    },
    materials: {
      body: { ...MATERIAL_PRESETS.amber_glass },
      cap: { ...MATERIAL_PRESETS.rubber_matte, color: '#18181b' },
      label: { ...MATERIAL_PRESETS.paper_label, color: '#fffbeb' },
    },
    transform: {
      position: [0.065, 0.0625, 0.025],
      rotation: [0, -0.3, 0],
      scale: [1, 1, 1],
    },
  };

  return {
    id: 'project-starter-01',
    name: 'طقم مستحضرات العناية الفاخرة (Cosmetic Gift Set)',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    objects: [cartonBox, dropperBottle],
    selectedObjectId: 'prod-box-01',
    lighting: DEFAULT_LIGHTING,
    camera: DEFAULT_CAMERA,
    background: DEFAULT_BACKGROUND,
    settings: {
      preferredUnit: 'mm',
      language: 'ar',
      renderQuality: 'high',
    },
  };
}
