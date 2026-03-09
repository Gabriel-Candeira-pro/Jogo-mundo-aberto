import Phaser from 'phaser';

// Configuração do Phaser - Responsivo e Multi-plataforma
export const gameConfig = {
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: false,
            worldBounds: { x: 0, y: 0, width: 1200, height: 800 }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 1920,
            height: 1440
        },
        expandParent: true,
        fullscreenTarget: 'game-container',
        orientation: 'LANDSCAPE'
    },
    input: {
        touch: {
            target: window
        }
    },
    parent: 'game-container',
    backgroundColor: '#2d2d44'
};
