import Phaser from 'phaser';

/**
 * Nucleo da cena principal do jogo.
 */
export class GameSceneCore extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.score = 0;
        this.starsCollected = 0;
    }

    create() {
        this.initGameData();
        this.setupPlayer();
        this.setupUI();
        this.setupControls();
        this.setupResize();
    }

    update() {
        this.handleTileBasedMovement();
    }
}
