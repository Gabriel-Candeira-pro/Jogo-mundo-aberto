import { gameConfig } from './config/gameConfig.js';
import { GameScene } from './scenes/GameScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';

// Inicializar jogo com todas as cenas
const game = new Phaser.Game({
    ...gameConfig,
    scene: [PreloadScene, GameScene]
});
