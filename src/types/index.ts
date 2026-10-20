export type Unit = 'mm' | 'cm' | 'in' | 'm';

export type TemplateType =
  | 'box'
  | 'cylinder_bottle'
  | 'oval_bottle'
  | 'squeeze_tube'
  | 'flexible_pouch'
  | 'custom_lathe';

export type ViewMode = 'rendered' | 'material' | 'solid' | 'wireframe';
export type TransformMode = 'translate' | 'rotate' | 'scale';

// Surface Identifiers
export type BoxSurface = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
export type BottleSurface = 'body' | 'front_label' | 'back_label' | 'neck' | 'cap_top' | 'cap_side';
export type TubeSurface = 'front' | 'back' | 'crimp' | 'cap';
export type PouchSurface = 'front' | 'back' | 'gusset';
export type SurfaceKey = string;

// Geometry Parameters per Template
export interface BoxParameters {
  width: number;        // in mm
  height: number;       // in mm
  depth: number;        // in mm
  cornerRadius: number; // in mm
  hasLid: boolean;
  lidHeight?: number;
  wallThickness?: number;
}

export interface CylinderBottleParameters {
  totalHeight: number;       // in mm
  bodyDiameter: number;      // in mm
  shoulderHeight: number;    // in mm
  shoulderStyle: 'rounded' | 'flat' | 'sloped' | 'chamfer';
  neckDiameter: number;      // in mm
  neckHeight: number;        // in mm
  capDiameter: number;       // in mm
  capHeight: number;         // in mm
  taper: number;             // ratio: 1 = straight
}

export interface OvalBottleParameters {
  bodyWidth: number;         // in mm
  bodyDepth: number;         // in mm
  height: number;            // in mm
  shoulderCurvature: number; // 0 to 1
  neckDiameter: number;      // in mm
  neckHeight: number;        // in mm
  capDiameter: number;       // in mm
  capHeight: number;         // in mm
  cornerRadius: number;      // in mm
  taper: number;             // ratio
}

export interface TubeParameters {
  totalLength: number;       // in mm
  bodyDiameter: number;      // in mm
  shoulderHeight: number;    // in mm
  nozzleDiameter: number;    // in mm
  nozzleLength: number;      // in mm
  capDiameter: number;       // in mm
  capHeight: number;         // in mm
  crimpHeight: number;       // in mm
}

export interface PouchParameters {
  width: number;             // in mm
  height: number;            // in mm
  gussetDepth: number;       // in mm
  sealWidth: number;         // in mm
  hasZipLock: boolean;
  cornerRadius: number;      // in mm
  standUpBase: boolean;
}

export interface CustomLatheParameters {
  height: number;
  segments: number;
  profilePoints: Array<{ r: number; y: number }>; // r: radius in mm, y: height in mm
}

export type GeometryParameters =
  | { type: 'box'; params: BoxParameters }
  | { type: 'cylinder_bottle'; params: CylinderBottleParameters }
  | { type: 'oval_bottle'; params: OvalBottleParameters }
  | { type: 'squeeze_tube'; params: TubeParameters }
  | { type: 'flexible_pouch'; params: PouchParameters }
  | { type: 'custom_lathe'; params: CustomLatheParameters };

// Artwork mapping configuration for a surface
export type FitMode = 'fit' | 'fill' | 'stretch';

export interface ArtworkConfig {
  id: string;
  surfaceKey: SurfaceKey;
  imageSrc: string;          // Data URL or object URL
  fileName?: string;
  fitMode: FitMode;
  offsetX: number;           // -1 to 1 (normalized or percentage)
  offsetY: number;           // -1 to 1
  scaleX: number;            // default 1.0
  scaleY: number;            // default 1.0
  rotation: number;          // in degrees (0, 90, 180, 270, or free)
  flipHorizontal: boolean;
  flipVertical: boolean;
  repeat: boolean;
  opacity: number;           // 0 to 1
  aspectRatio?: number;      // original image aspect ratio (w/h)
}

// Material configuration
export type MaterialPresetType =
  | 'matte_cardboard'
  | 'glossy_cardboard'
  | 'paper_label'
  | 'clear_glass'
  | 'amber_glass'
  | 'opaque_plastic'
  | 'glossy_plastic'
  | 'brushed_metal'
  | 'reflective_metal'
  | 'foil_pouch'
  | 'rubber_matte'
  | 'custom';

export type SubstrateTextureType =
  | 'none'
  | 'paper_grain'
  | 'plastic_stipple'
  | 'cardboard_fiber'
  | 'brushed_metal';

export interface MaterialProperties {
  preset: MaterialPresetType;
  color: string;
  roughness: number;         // 0 to 1
  metalness: number;         // 0 to 1
  transmission: number;       // 0 to 1 (for glass/translucent)
  ior: number;                // 1.0 to 2.5 (1.52 for glass)
  clearcoat: number;          // 0 to 1
  clearcoatRoughness: number; // 0 to 1
  opacity: number;            // 0 to 1
  transparent: boolean;
  substrate: SubstrateTextureType;
  substrateStrength: number;  // 0 to 1
}

// Transform
export interface Transform3D {
  position: [number, number, number]; // in Three.js coordinates (meters)
  rotation: [number, number, number]; // in radians
  scale: [number, number, number];    // multiplier
}

// Single Packaging Object in the Scene
export interface PackagingObject {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  templateType: TemplateType;
  geometry: GeometryParameters;
  dimensionUnit: Unit;
  lockAspectRatio: boolean;
  surfaceArtworks: Record<SurfaceKey, ArtworkConfig | null>;
  materials: {
    body: MaterialProperties;
    cap?: MaterialProperties;
    label?: MaterialProperties;
    seal?: MaterialProperties;
  };
  transform: Transform3D;
}

// Studio Lighting
export interface LightSource {
  enabled: boolean;
  color: string;
  intensity: number;
  position: [number, number, number];
  castShadow: boolean;
  shadowSoftness?: number;
}

export type LightingPresetType =
  | 'soft_commercial'
  | 'dramatic_side'
  | 'bright_medical'
  | 'premium_cosmetic'
  | 'dark_luxury'
  | 'neutral_ecommerce'
  | 'top_down_flatlay'
  | 'custom';

export interface StudioLighting {
  preset: LightingPresetType;
  keyLight: LightSource;
  fillLight: LightSource;
  rimLight: LightSource;
  topLight: LightSource;
  ambientLight: {
    enabled: boolean;
    color: string;
    intensity: number;
  };
  contactShadows: {
    enabled: boolean;
    opacity: number;
    blur: number;
  };
}

// Camera Presets
export type CameraPresetType =
  | 'front'
  | 'three_quarter_front'
  | 'three_quarter_rear'
  | 'side_left'
  | 'side_right'
  | 'top'
  | 'low_angle_hero'
  | 'catalog'
  | 'social_square'
  | 'custom';

export interface StudioCamera {
  preset: CameraPresetType;
  mode: 'perspective' | 'orthographic';
  fov: number;
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
}

// Scene Background
export type BackgroundMode = 'transparent' | 'solid' | 'gradient' | 'studio_floor';

export interface SceneBackground {
  mode: BackgroundMode;
  color1: string;
  color2: string;
  gradientAngle: number;
  floorColor: string;
  floorRoughness: number;
  floorReflectivity: number;
  showPedestal: boolean;
  pedestalType: 'cylinder' | 'box';
  pedestalColor: string;
}

// Complete Project Document
export interface FormoraProject {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  objects: PackagingObject[];
  selectedObjectId: string | null;
  lighting: StudioLighting;
  camera: StudioCamera;
  background: SceneBackground;
  settings: {
    preferredUnit: Unit;
    language: 'ar' | 'en';
    renderQuality: 'performance' | 'balanced' | 'high';
  };
}

// Calculated surface dimensions for live panel
export interface SurfaceDimensions {
  key: SurfaceKey;
  labelAr: string;
  labelEn: string;
  width: number;  // in current display unit
  height: number; // in current display unit
  aspectRatio: number;
}

// Export Configuration
export interface ExportConfig {
  format: 'png' | 'jpeg' | 'webp' | 'glb';
  width: number;
  height: number;
  transparentBackground: boolean;
  qualityPreset: 'preview' | '1080p' | '2k' | '4k' | '8k' | 'custom';
  imageQuality: number; // 0.1 to 1.0 (for jpeg/webp)
  includeShadows: boolean;
  fileName: string;
}
