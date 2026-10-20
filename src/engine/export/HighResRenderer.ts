import * as THREE from 'three';
import { ExportConfig, FormoraProject } from '../../types';

export class HighResRenderer {
  /**
   * Renders the 3D scene at ultra-high resolution offscreen and returns a Blob/DataURL
   */
  public static async renderToImage(
    scene: THREE.Scene,
    camera: THREE.Camera,
    config: ExportConfig,
    onProgress?: (percent: number, status: string) => void
  ): Promise<{ dataUrl: string; blob: Blob }> {
    onProgress?.(10, 'Initializing high-resolution renderer...');

    const width = config.width || 1920;
    const height = config.height || 1080;

    // Create offscreen canvas and isolated WebGL renderer
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: config.transparentBackground,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = config.includeShadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if (config.transparentBackground) {
      renderer.setClearColor(0x000000, 0);
    } else {
      renderer.setClearColor(0x0d0f14, 1);
    }

    onProgress?.(30, 'Cloning camera for framing...');

    // Clone and adjust camera aspect ratio to match target render dimensions
    let renderCamera: THREE.Camera;
    if (camera instanceof THREE.PerspectiveCamera) {
      const persCamera = camera.clone();
      persCamera.aspect = width / height;
      persCamera.updateProjectionMatrix();
      renderCamera = persCamera;
    } else if (camera instanceof THREE.OrthographicCamera) {
      const orthoCamera = camera.clone();
      const frustumSize = (orthoCamera.top - orthoCamera.bottom);
      const aspect = width / height;
      orthoCamera.left = (-frustumSize * aspect) / 2;
      orthoCamera.right = (frustumSize * aspect) / 2;
      orthoCamera.updateProjectionMatrix();
      renderCamera = orthoCamera;
    } else {
      renderCamera = camera;
    }

    onProgress?.(60, 'Rendering scene buffers...');
    renderer.render(scene, renderCamera);

    onProgress?.(85, 'Encoding output image format...');

    const mimeType =
      config.format === 'jpeg'
        ? 'image/jpeg'
        : config.format === 'webp'
        ? 'image/webp'
        : 'image/png';

    const quality = config.imageQuality ?? 0.95;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to encode image blob'));
        },
        mimeType,
        quality
      );
    });

    const dataUrl = canvas.toDataURL(mimeType, quality);

    // Clean up GPU resources immediately
    renderer.dispose();
    renderer.forceContextLoss();

    onProgress?.(100, 'Render complete!');

    return { dataUrl, blob };
  }

  /**
   * Helper to trigger native browser file download
   */
  public static downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
