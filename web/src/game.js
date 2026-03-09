import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig.js';
import { LoginScene } from './scenes/LoginScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';

// Inicializar jogo com todas as cenas
const game = new Phaser.Game({
    ...gameConfig,
    scene: [LoginScene, PreloadScene, GameScene]
});

// Navegadores modernos bloqueiam audio ate o primeiro gesto do usuario.
const unlockAudio = async () => {
    const context = game.sound?.context;
    if (context && context.state === 'suspended') {
        try {
            await context.resume();
        } catch (error) {
            // Ignora falhas transitórias; nova interação tentará novamente.
        }
    }
};

document.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
document.addEventListener('keydown', unlockAudio, { once: true });

// 🔧 DIAGNOSTICO: Verifica se teclado está respondendo no level DOM
document.addEventListener('keydown', (e) => {
    console.log('[DOM-KeyDown]', e.key, e.code);
});
document.addEventListener('keyup', (e) => {
    console.log('[DOM-KeyUp]', e.key, e.code);
});
