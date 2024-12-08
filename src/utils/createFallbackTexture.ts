import * as THREE from 'three';

export function createFallbackTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 90;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add a visual indicator that this is a fallback
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}