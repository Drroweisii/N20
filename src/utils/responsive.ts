import { VIEWPORT } from '../config/constants';

export function getResponsiveScale(): number {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  const scaleX = windowWidth / VIEWPORT.WIDTH;
  const scaleY = windowHeight / VIEWPORT.HEIGHT;
  
  return Math.min(scaleX, scaleY);
}

export function updateViewportMetaTag(): void {
  const viewport = document.querySelector('meta[name=viewport]');
  viewport?.setAttribute('content', 
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}