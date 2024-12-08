import * as THREE from 'three';
import { GameCamera } from './Camera';
import { Grid } from './Grid';
import { getResponsiveScale } from '../utils/responsive';

export class Game {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: GameCamera;
  private grid: Grid;
  private isInitialized = false;

  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.camera = new GameCamera();
    this.grid = new Grid(this.scene);
    
    this.init();
    this.setupEventListeners();
  }

  private async init(): Promise<void> {
    try {
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      
      const scale = getResponsiveScale();
      this.scene.scale.set(scale, scale, 1);

      await this.grid.initialize();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Touch events for mobile
    let touchStartX: number;
    let touchStartY: number;
    
    this.renderer.domElement.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    this.renderer.domElement.addEventListener('touchmove', (e) => {
      const deltaX = (touchStartX - e.touches[0].clientX) * 0.5;
      const deltaY = (touchStartY - e.touches[0].clientY) * 0.5;
      
      this.camera.pan(deltaX, deltaY);
      
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    // Pinch zoom
    let initialPinchDistance: number | null = null;
    
    this.renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });

    this.renderer.domElement.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDistance !== null) {
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        
        const delta = (currentDistance - initialPinchDistance) * 0.01;
        this.camera.zoom(delta);
        
        initialPinchDistance = currentDistance;
      }
    });
  }

  private onWindowResize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.resize();
    
    const scale = getResponsiveScale();
    this.scene.scale.set(scale, scale, 1);
  }

  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    if (this.isInitialized) {
      this.grid.update();
      this.renderer.render(this.scene, this.camera.instance);
    }
  }
}