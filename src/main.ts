import './style.css';
import { Game } from './core/Game';
import { updateViewportMetaTag } from './utils/responsive';

// Prevent mobile browser scaling
updateViewportMetaTag();

// Create and start the game
const game = new Game();
game.animate();