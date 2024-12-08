import * as THREE from 'three';
import { GRID_CONFIG } from '../config/constants';
import { createFallbackTexture } from './createFallbackTexture';

export class TextureManager {
  private textureLoader: THREE.TextureLoader;
  private textures: THREE.Texture[] = [];
  private loadingStates: Map<number, boolean> = new Map();
  private fallbackTexture: THREE.Texture;

  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.fallbackTexture = createFallbackTexture();
    
    // Initialize loading states
    for (let i = 1; i <= GRID_CONFIG.TOTAL_CELLS; i++) {
      this.loadingStates.set(i, false);
    }
  }

  async loadAllTextures(): Promise<THREE.Texture[]> {
    const loadingPromises: Promise<void>[] = [];
    
    for (let i = 1; i <= GRID_CONFIG.TOTAL_CELLS; i++) {
      loadingPromises.push(this.loadTexture(i));
    }
    
    await Promise.allSettled(loadingPromises);
    return this.textures;
  }

  private async loadTexture(index: number): Promise<void> {
    if (this.loadingStates.get(index)) return;
    
    this.loadingStates.set(index, true);
    const textureIndex = index - 1;

    try {
      const textureNumber = index.toString().padStart(2, '0');
      const texture = await this.textureLoader.loadAsync(
        `/assets/T_${textureNumber}.webp`
      );
      
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      
      this.textures[textureIndex] = texture;
    } catch (error) {
      console.warn(`Texture ${index} not found, using fallback`);
      this.textures[textureIndex] = this.fallbackTexture.clone();
    }
  }

  getTexture(index: number): THREE.Texture {
    return this.textures[index] || this.fallbackTexture;
  }
}