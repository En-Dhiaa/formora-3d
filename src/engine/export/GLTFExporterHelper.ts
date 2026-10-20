import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export class GLTFExporterHelper {
  /**
   * Exports a 3D scene or selected mesh to binary GLB or JSON glTF
   */
  public static async exportToGLB(
    objectOrScene: THREE.Object3D,
    binary: boolean = true
  ): Promise<Blob> {
    const exporter = new GLTFExporter();

    return new Promise((resolve, reject) => {
      exporter.parse(
        objectOrScene,
        (gltf) => {
          if (binary) {
            const blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
            resolve(blob);
          } else {
            const output = JSON.stringify(gltf, null, 2);
            const blob = new Blob([output], { type: 'application/json' });
            resolve(blob);
          }
        },
        (error) => {
          reject(error);
        },
        {
          binary,
          embedImages: true,
          onlyVisible: true,
        }
      );
    });
  }
}
