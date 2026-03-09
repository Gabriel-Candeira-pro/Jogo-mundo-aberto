// Cena de Pré-carregamento - cria assets dinâmicos
export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Não precisamos carregar assets - usaremos gráficos dinâmicos
    }

    create() {
        this.createPlayerTexture();
        this.createPlatformTexture();
        this.createStarTexture();
        this.createEnemyTexture();
        this.scene.start('GameScene');
    }

    createPlayerTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x00b300);
        graphics.fillRect(0, 0, 32, 48);
        graphics.generateTexture('player', 32, 48);
        graphics.destroy();
    }

    createPlatformTexture() {
        const platformGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        platformGraphics.fillStyle(0x888888);
        platformGraphics.fillRect(0, 0, 400, 24);
        platformGraphics.generateTexture('platform', 400, 24);
        platformGraphics.destroy();
    }

    createStarTexture() {
        const starGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        starGraphics.fillStyle(0xffff00);
        starGraphics.fillCircle(8, 8, 8);
        starGraphics.generateTexture('star', 16, 16);
        starGraphics.destroy();
    }

    createEnemyTexture() {
        const enemyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        enemyGraphics.fillStyle(0xff0000);
        enemyGraphics.fillRect(0, 0, 32, 32);
        enemyGraphics.generateTexture('enemy', 32, 32);
        enemyGraphics.destroy();
    }
}
