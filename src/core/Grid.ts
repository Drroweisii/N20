import * as THREE from 'three';
import { GRID_CONFIG } from '../config/constants';
import { TextureManager } from '../utils/TextureLoader';

export class Grid {
  private cells: THREE.Mesh[] = [];
  private textureManager: TextureManager;
  private isInitialized = false;

  constructor(private scene: THREE.Scene) {
    this.textureManager = new TextureManager();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.textureManager.loadAllTextures();
      this.createGrid();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize grid:', error);
    }
  }

  private createGrid(): void {
    const geometry = new THREE.PlaneGeometry(
      GRID_CONFIG.CELL_WIDTH,
      GRID_CONFIG.CELL_HEIGHT
    );

    for (let row = 0; row < GRID_CONFIG.ROWS; row++) {
      for (let col = 0; col < GRID_CONFIG.COLUMNS; col++) {
        const index = row * GRID_CONFIG.COLUMNS + col;
        
        const material = new THREE.MeshBasicMaterial({
          transparent: true,
          map: this.textureManager.getTexture(index)
        });

        const cell = new THREE.Mesh(geometry, material);
        
        cell.position.x = col * GRID_CONFIG.CELL_WIDTH;
        cell.position.y = (GRID_CONFIG.ROWS - row - 1) * GRID_CONFIG.CELL_HEIGHT;
        
        this.cells.push(cell);
        this.scene.add(cell);
      }
    }
  }

  update(): void {
    // Update grid state here if needed
  }
}