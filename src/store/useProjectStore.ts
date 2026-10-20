import { create } from 'zustand';
import {
  FormoraProject,
  PackagingObject,
  TemplateType,
  GeometryParameters,
  Transform3D,
  MaterialProperties,
  ArtworkConfig,
  StudioLighting,
  StudioCamera,
  SceneBackground,
  ViewMode,
  TransformMode,
  Unit,
} from '../types';
import { createDefaultProject, DEFAULT_LIGHTING, DEFAULT_CAMERA } from '../utils/sampleData';
import { MATERIAL_PRESETS } from '../engine/materials/MaterialFactory';

export type ActiveSidebarTab =
  | 'dimensions'
  | 'artwork'
  | 'materials'
  | 'lighting'
  | 'camera'
  | 'background'
  | 'scene';

interface ProjectState {
  project: FormoraProject;
  history: FormoraProject[];
  future: FormoraProject[];
  language: 'ar' | 'en';
  viewMode: ViewMode;
  transformMode: TransformMode | null;
  activeTab: ActiveSidebarTab;
  showGrid: boolean;

  // Modals
  isExportModalOpen: boolean;
  isDielineModalOpen: boolean;
  isTemplatesModalOpen: boolean;
  isAIAssistantModalOpen: boolean;
  isDeveloperModalOpen: boolean;

  // Actions
  setLanguage: (lang: 'ar' | 'en') => void;
  setViewMode: (mode: ViewMode) => void;
  setTransformMode: (mode: TransformMode | null) => void;
  setActiveTab: (tab: ActiveSidebarTab) => void;
  setShowGrid: (show: boolean) => void;

  setExportModalOpen: (open: boolean) => void;
  setDielineModalOpen: (open: boolean) => void;
  setTemplatesModalOpen: (open: boolean) => void;
  setAIAssistantModalOpen: (open: boolean) => void;
  setDeveloperModalOpen: (open: boolean) => void;
  applySceneArrangement: (type: 'duo' | 'trio' | 'hero_companion' | 'lineup') => void;

  // Project Actions
  setProject: (project: FormoraProject) => void;
  updateProjectName: (name: string) => void;
  setSelectedObjectId: (id: string | null) => void;

  // Object Actions
  addObjectByTemplate: (type: TemplateType) => void;
  duplicateObject: (id: string) => void;
  deleteObject: (id: string) => void;
  toggleObjectVisibility: (id: string) => void;
  toggleObjectLocked: (id: string) => void;
  renameObject: (id: string, newName: string) => void;

  updateObjectGeometry: (id: string, geometry: GeometryParameters) => void;
  updateObjectTransform: (id: string, transform: Partial<Transform3D>) => void;
  updateObjectMaterial: (
    id: string,
    part: 'body' | 'cap' | 'label' | 'seal',
    props: Partial<MaterialProperties>
  ) => void;
  updateObjectArtwork: (id: string, surfaceKey: string, artwork: ArtworkConfig | null) => void;
  setObjectUnit: (id: string, unit: Unit) => void;
  toggleAspectRatioLock: (id: string) => void;

  // Studio Environment Actions
  updateLighting: (lighting: Partial<StudioLighting>) => void;
  updateCamera: (camera: Partial<StudioCamera>) => void;
  updateBackground: (bg: Partial<SceneBackground>) => void;

  // Alignments
  snapObjectToGround: (id: string) => void;
  centerSelectedObject: (id: string) => void;

  // History
  undo: () => void;
  redo: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: createDefaultProject(),
  history: [],
  future: [],
  language: 'ar',
  viewMode: 'rendered',
  transformMode: 'translate',
  activeTab: 'dimensions',
  showGrid: true,

  isExportModalOpen: false,
  isDielineModalOpen: false,
  isTemplatesModalOpen: false,
  isAIAssistantModalOpen: false,

  setLanguage: (lang) => {
    set((state) => ({
      language: lang,
      project: {
        ...state.project,
        settings: { ...state.project.settings, language: lang },
      },
    }));
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setTransformMode: (mode) => set({ transformMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowGrid: (show) => set({ showGrid: show }),

  isExportModalOpen: false,
  isDielineModalOpen: false,
  isTemplatesModalOpen: false,
  isAIAssistantModalOpen: false,
  isDeveloperModalOpen: false,

  setExportModalOpen: (open) => set({ isExportModalOpen: open }),
  setDielineModalOpen: (open) => set({ isDielineModalOpen: open }),
  setTemplatesModalOpen: (open) => set({ isTemplatesModalOpen: open }),
  setAIAssistantModalOpen: (open) => set({ isAIAssistantModalOpen: open }),
  setDeveloperModalOpen: (open) => set({ isDeveloperModalOpen: open }),

  setProject: (project) => {
    const current = get().project;
    set((state) => ({
      project,
      history: [...state.history.slice(-15), current],
      future: [],
    }));
  },

  updateProjectName: (name) => {
    set((state) => ({
      project: { ...state.project, name, updatedAt: new Date().toISOString() },
    }));
  },

  setSelectedObjectId: (id) => {
    set((state) => ({
      project: { ...state.project, selectedObjectId: id },
    }));
  },

  addObjectByTemplate: (type) => {
    const current = get().project;
    const count = current.objects.length + 1;
    let newObject: PackagingObject;

    if (type === 'cylinder_bottle') {
      newObject = {
        id: `prod-bottle-${Date.now()}`,
        name: `زجاجة جديدة ${count}`,
        visible: true,
        locked: false,
        templateType: 'cylinder_bottle',
        dimensionUnit: 'mm',
        lockAspectRatio: false,
        geometry: {
          type: 'cylinder_bottle',
          params: {
            totalHeight: 140,
            bodyDiameter: 55,
            shoulderHeight: 18,
            shoulderStyle: 'rounded',
            neckDiameter: 24,
            neckHeight: 16,
            capDiameter: 26,
            capHeight: 24,
            taper: 1,
          },
        },
        surfaceArtworks: {},
        materials: {
          body: { ...MATERIAL_PRESETS.clear_glass },
          cap: { ...MATERIAL_PRESETS.glossy_plastic },
        },
        transform: {
          position: [0.15 * (count - 1), 0.07, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        },
      };
    } else if (type === 'squeeze_tube') {
      newObject = {
        id: `prod-tube-${Date.now()}`,
        name: `أنبوب مرن ${count}`,
        visible: true,
        locked: false,
        templateType: 'squeeze_tube',
        dimensionUnit: 'mm',
        lockAspectRatio: false,
        geometry: {
          type: 'squeeze_tube',
          params: {
            totalLength: 150,
            bodyDiameter: 40,
            shoulderHeight: 12,
            nozzleDiameter: 8,
            nozzleLength: 10,
            capDiameter: 36,
            capHeight: 25,
            crimpHeight: 10,
          },
        },
        surfaceArtworks: {},
        materials: {
          body: { ...MATERIAL_PRESETS.opaque_plastic },
          cap: { ...MATERIAL_PRESETS.glossy_plastic, color: '#4f46e5' },
        },
        transform: {
          position: [0.12 * (count - 1), 0.075, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        },
      };
    } else if (type === 'flexible_pouch') {
      newObject = {
        id: `prod-pouch-${Date.now()}`,
        name: `كيس مرن قائم ${count}`,
        visible: true,
        locked: false,
        templateType: 'flexible_pouch',
        dimensionUnit: 'mm',
        lockAspectRatio: false,
        geometry: {
          type: 'flexible_pouch',
          params: {
            width: 140,
            height: 200,
            gussetDepth: 60,
            sealWidth: 8,
            hasZipLock: true,
            cornerRadius: 4,
            standUpBase: true,
          },
        },
        surfaceArtworks: {},
        materials: {
          body: { ...MATERIAL_PRESETS.foil_pouch },
        },
        transform: {
          position: [0.14 * (count - 1), 0.1, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        },
      };
    } else {
      // Default Box
      newObject = {
        id: `prod-box-${Date.now()}`,
        name: `علبة كرتون ${count}`,
        visible: true,
        locked: false,
        templateType: 'box',
        dimensionUnit: 'mm',
        lockAspectRatio: false,
        geometry: {
          type: 'box',
          params: {
            width: 80,
            height: 120,
            depth: 80,
            cornerRadius: 1,
            hasLid: true,
          },
        },
        surfaceArtworks: {},
        materials: {
          body: { ...MATERIAL_PRESETS.matte_cardboard },
        },
        transform: {
          position: [0.12 * (count - 1), 0.06, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        },
      };
    }

    set((state) => ({
      history: [...state.history.slice(-15), current],
      future: [],
      project: {
        ...state.project,
        objects: [...state.project.objects, newObject],
        selectedObjectId: newObject.id,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  duplicateObject: (id) => {
    const current = get().project;
    const target = current.objects.find((o) => o.id === id);
    if (!target) return;

    const duplicated: PackagingObject = {
      ...JSON.parse(JSON.stringify(target)),
      id: `prod-${Date.now()}`,
      name: `${target.name} (نسخة)`,
      transform: {
        ...target.transform,
        position: [
          target.transform.position[0] + 0.08,
          target.transform.position[1],
          target.transform.position[2] + 0.04,
        ],
      },
    };

    set((state) => ({
      history: [...state.history.slice(-15), current],
      future: [],
      project: {
        ...state.project,
        objects: [...state.project.objects, duplicated],
        selectedObjectId: duplicated.id,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  deleteObject: (id) => {
    const current = get().project;
    const filtered = current.objects.filter((o) => o.id !== id);
    const nextSelected = filtered.length > 0 ? filtered[0].id : null;

    set((state) => ({
      history: [...state.history.slice(-15), current],
      future: [],
      project: {
        ...state.project,
        objects: filtered,
        selectedObjectId: nextSelected,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  toggleObjectVisibility: (id) => {
    set((state) => ({
      project: {
        ...state.project,
        objects: state.project.objects.map((o) =>
          o.id === id ? { ...o, visible: !o.visible } : o
        ),
      },
    }));
  },

  toggleObjectLocked: (id) => {
    set((state) => ({
      project: {
        ...state.project,
        objects: state.project.objects.map((o) =>
          o.id === id ? { ...o, locked: !o.locked } : o
        ),
      },
    }));
  },

  renameObject: (id, newName) => {
    set((state) => ({
      project: {
        ...state.project,
        objects: state.project.objects.map((o) =>
          o.id === id ? { ...o, name: newName } : o
        ),
      },
    }));
  },

  updateObjectGeometry: (id, geometry) => {
    set((state) => ({
      project: {
        ...state.project,
        objects: state.project.objects.map((o) =>
          o.id === id ? { ...o, geometry } : o
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  updateObjectTransform: (id, partialTransform) => {
    set((state) => ({
      project: {
        ...state.project,
        objects: state.project.objects.map((o) =>
          o.id === id
            ? { ...o, transform: { ...o.transform, ...partialTransform } }
            : o
        ),
      },
    }));
  },

  updateObjectMaterial: (id, part, props) => {
    set((state) => ({
      project: {
        ...state.project,
        objects: state.project.objects.map((o) => {
          if (o.id !== id) return o;
          const currentMat = o.materials[part] || MATERIAL_PRESETS.matte_cardboard;
          return {
            ...o,
            materials: {
              ...o.materials,
              [part]: { ...currentMat, ...props },
            },
          };
        }),
      },
    }));
  },

  updateObjectArtwork: (id, surfaceKey, artwork) => {
    set((state) => ({
      project: {
        ...state.project,
        objects: state.project.objects.map((o) => {
          if (o.id !== id) return o;
          return {
            ...o,
            surfaceArtworks: {
              ...o.surfaceArtworks,
              [surfaceKey]: artwork,
            },
          };
        }),
      },
    }));
  },

  setObjectUnit: (id, unit) => {
    set((state) => ({
      project: {
        ...state.project,
        objects: state.project.objects.map((o) =>
          o.id === id ? { ...o, dimensionUnit: unit } : o
        ),
      },
    }));
  },

  toggleAspectRatioLock: (id) => {
    set((state) => ({
      project: {
        ...state.project,
        objects: state.project.objects.map((o) =>
          o.id === id ? { ...o, lockAspectRatio: !o.lockAspectRatio } : o
        ),
      },
    }));
  },

  updateLighting: (partialLighting) => {
    set((state) => ({
      project: {
        ...state.project,
        lighting: { ...state.project.lighting, ...partialLighting },
      },
    }));
  },

  updateCamera: (partialCamera) => {
    set((state) => ({
      project: {
        ...state.project,
        camera: { ...state.project.camera, ...partialCamera },
      },
    }));
  },

  updateBackground: (partialBg) => {
    set((state) => ({
      project: {
        ...state.project,
        background: { ...state.project.background, ...partialBg },
      },
    }));
  },

  snapObjectToGround: (id) => {
    const current = get().project;
    const target = current.objects.find((o) => o.id === id);
    if (!target) return;

    let halfH = 0.05;
    if (target.geometry.type === 'box') {
      halfH = (target.geometry.params.height * 0.001) / 2;
    } else if (target.geometry.type === 'cylinder_bottle') {
      halfH = (target.geometry.params.totalHeight * 0.001) / 2;
    } else if (target.geometry.type === 'squeeze_tube') {
      halfH = (target.geometry.params.totalLength * 0.001) / 2;
    } else if (target.geometry.type === 'flexible_pouch') {
      halfH = (target.geometry.params.height * 0.001) / 2;
    }

    set((state) => ({
      project: {
        ...state.project,
        objects: state.project.objects.map((o) =>
          o.id === id
            ? {
                ...o,
                transform: {
                  ...o.transform,
                  position: [o.transform.position[0], halfH, o.transform.position[2]],
                },
              }
            : o
        ),
      },
    }));
  },

  centerSelectedObject: (id) => {
    set((state) => ({
      project: {
        ...state.project,
        objects: state.project.objects.map((o) =>
          o.id === id
            ? {
                ...o,
                transform: {
                  ...o.transform,
                  position: [0, o.transform.position[1], 0],
                },
              }
            : o
        ),
      },
    }));
  },

  applySceneArrangement: (type) => {
    const { project } = get();
    const count = project.objects.length;
    if (count === 0) return;

    const current = project;
    const updatedObjects = project.objects.map((obj, index) => {
      let x = 0;
      let z = 0;
      let rotY = obj.transform.rotation[1];

      if (type === 'duo') {
        const spacing = 0.14;
        x = (index - (count - 1) / 2) * spacing;
        z = index % 2 === 0 ? 0.02 : -0.02;
        rotY = index === 0 ? 0.15 : -0.15;
      } else if (type === 'hero_companion') {
        if (index === 0) {
          x = -0.04;
          z = 0.04;
          rotY = -0.1;
        } else {
          x = 0.12 * index;
          z = -0.06 * index;
          rotY = 0.25;
        }
      } else if (type === 'trio') {
        if (index === 0) {
          x = -0.18;
          z = -0.03;
          rotY = 0.2;
        } else if (index === 1) {
          x = 0;
          z = 0.03;
          rotY = 0;
        } else {
          x = 0.18;
          z = -0.03;
          rotY = -0.2;
        }
      } else {
        // lineup
        const spacing = 0.16;
        x = (index - (count - 1) / 2) * spacing;
        z = 0;
      }

      return {
        ...obj,
        transform: {
          ...obj.transform,
          position: [x, obj.transform.position[1], z] as [number, number, number],
          rotation: [obj.transform.rotation[0], rotY, obj.transform.rotation[2]] as [number, number, number],
        },
      };
    });

    set((state) => ({
      project: {
        ...state.project,
        objects: updatedObjects,
      },
      history: [...state.history.slice(-15), current],
      future: [],
    }));
  },

  undo: () => {
    const { history, project, future } = get();
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    set({
      project: previous,
      history: newHistory,
      future: [project, ...future],
    });
  },

  redo: () => {
    const { history, project, future } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      project: next,
      history: [...history, project],
      future: newFuture,
    });
  },
}));
