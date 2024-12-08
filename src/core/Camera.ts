import * as THREE from 'three';
import { VIEWPORT } from '../config/constants';

export class GameCamera {
  private camera: THREE.OrthographicCamera;
  private minZoom = 0.5;
  private maxZoom = 2;
  private currentZoom = 1;

  constructor() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = VIEWPORT.HEIGHT;

    this.camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      1000
    );
    
    this.camera.position.z = 100;
    this.camera.position.x = VIEWPORT.WIDTH / 2;
    this.camera.position.y = VIEWPORT.HEIGHT / 2;
  }

  get instance(): THREE.OrthographicCamera {
    return this.camera;
  }

  zoom(delta: number): void {
    this.currentZoom = Math.max(this.minZoom, 
      Math.min(this.maxZoom, this.currentZoom + delta));
    this.camera.zoom = this.currentZoom;
    this.camera.updateProjectionMatrix();
  }

  pan(deltaX: number, deltaY: number): void {
    this.camera.position.x += deltaX;
    this.camera.position.y += deltaY;
    this.camera.updateProjectionMatrix();
  }

  resize(): void {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = VIEWPORT.HEIGHT;

    this.camera.left = frustumSize * aspect / -2;
    this.camera.right = frustumSize * aspect / 2;
    this.camera.top = frustumSize / 2;
    this.camera.bottom = frustumSize / -2;
    
    this.camera.updateProjectionMatrix();
  }
}