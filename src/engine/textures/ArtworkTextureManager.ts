import * as THREE from 'three';
import { ArtworkConfig, SurfaceDimensions } from '../../types';

export class ArtworkTextureManager {
  private static imageCache: Map<string, HTMLImageElement> = new Map();
  private static textureCache: Map<string, THREE.CanvasTexture> = new Map();

  /**
   * Preload an image from URL or Data URL
   */
  public static async loadImage(src: string): Promise<HTMLImageElement> {
    if (this.imageCache.has(src)) {
      return this.imageCache.get(src)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = src;
    });
  }

  /**
   * Generates a composite Three.js CanvasTexture for a specific packaging surface
   */
  public static async createSurfaceTexture(
    artwork: ArtworkConfig | null,
    surfaceDim?: SurfaceDimensions,
    baseColor: string = '#ffffff',
    resolution: number = 1024
  ): Promise<THREE.CanvasTexture | null> {
    if (typeof document === 'undefined') return null;

    const cacheKey = artwork
      ? `${artwork.id}_${artwork.fitMode}_${artwork.offsetX}_${artwork.offsetY}_${artwork.scaleX}_${artwork.scaleY}_${artwork.rotation}_${artwork.flipHorizontal}_${artwork.flipVertical}_${artwork.opacity}_${baseColor}_${resolution}`
      : `base_${baseColor}_${resolution}`;

    if (this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey)!;
    }

    // Determine canvas dimensions from surface aspect ratio
    const aspect = surfaceDim ? surfaceDim.aspectRatio : 1.0;
    let canvasW = resolution;
    let canvasH = Math.round(resolution / Math.max(0.01, aspect));

    // Clamp dimensions to reasonable texture size
    canvasH = Math.min(2048, Math.max(256, canvasH));
    canvasW = Math.min(2048, Math.max(256, canvasW));

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Fill base substrate color
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // If there is artwork assigned, composite it
    if (artwork && artwork.imageSrc) {
      try {
        const img = await this.loadImage(artwork.imageSrc);
        const imgAspect = img.width / Math.max(1, img.height);

        let drawW = canvasW;
        let drawH = canvasH;

        if (artwork.fitMode === 'fit') {
          if (imgAspect > aspect) {
            // Image is wider than surface
            drawW = canvasW;
            drawH = canvasW / imgAspect;
          } else {
            // Image is taller than surface
            drawH = canvasH;
            drawW = canvasH * imgAspect;
          }
        } else if (artwork.fitMode === 'fill') {
          if (imgAspect > aspect) {
            drawH = canvasH;
            drawW = canvasH * imgAspect;
          } else {
            drawW = canvasW;
            drawH = canvasW / imgAspect;
          }
        } else {
          // stretch
          drawW = canvasW;
          drawH = canvasH;
        }

        // Apply scale multipliers
        drawW *= (artwork.scaleX ?? 1.0);
        drawH *= (artwork.scaleY ?? 1.0);

        // Center position + user offsets
        const centerX = canvasW / 2 + (artwork.offsetX ?? 0) * canvasW;
        const centerY = canvasH / 2 + (artwork.offsetY ?? 0) * canvasH;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, artwork.opacity ?? 1.0));

        // Move to center of transformed artwork
        ctx.translate(centerX, centerY);

        // Rotation (convert degrees to radians)
        if (artwork.rotation) {
          ctx.rotate((artwork.rotation * Math.PI) / 180);
        }

        // Horizontal and Vertical flips
        const scaleX = artwork.flipHorizontal ? -1 : 1;
        const scaleY = artwork.flipVertical ? -1 : 1;
        ctx.scale(scaleX, scaleY);

        // Draw image centered at origin
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

        // Repeat pattern support if enabled
        if (artwork.repeat) {
          // Optional tile borders
        }

        ctx.restore();
      } catch (e) {
        console.warn('Failed to load artwork image:', e);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    this.textureCache.set(cacheKey, texture);
    return texture;
  }

  /**
   * Clears cached textures and frees WebGL memory
   */
  public static clearCache() {
    this.textureCache.forEach((tex) => tex.dispose());
    this.textureCache.clear();
  }
}
