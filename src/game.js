// Configuração do Phaser - Responsivo e Multi-plataforma
const gameConfig = {
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: GameScene,
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

const game = new Phaser.Game(gameConfig);

// Cena principal do jogo
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Grupo de plataformas
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'platform').setScale(2).refreshBody();

        // Adicionar mais plataformas
        platforms.create(600, 400, 'platform');
        platforms.create(50, 250, 'platform');
        platforms.create(750, 220, 'platform');

        // Criar jogador
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // Física
        this.physics.add.collider(this.player, platforms);

        // Cursores e controles touch
        this.cursors = this.input.keyboard.createCursorKeys();
        this.setupTouchControls();

        // Criar estrelas (colecionar)
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.entries.forEach(star => {
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            star.setCollideWorldBounds(true);
            star.setBounce(1, 1);
            star.setVelocity(
                Phaser.Math.Between(-200, 200),
                20
            );
        });

        // Colisões
        this.physics.add.collider(this.stars, platforms);
        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStar,
            null,
            this
        );

        // Criar inimigos
        this.enemies = this.physics.add.group();
        this.createEnemies(platforms);

        // Colisão com inimigos
        this.physics.add.collider(this.enemies, platforms);
        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.hitEnemy,
            null,
            this
        );

        // Score
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#FFF',
            fontFamily: 'Arial'
        });
        this.scoreText.setDepth(100);

        // Mostrar instruções
        this.showInstructions();

        // Ajustar escala quando janela redimensiona
        this.scale.on('resize', this.handleResize, this);
    }

    createEnemies(platforms) {
        const enemy1 = this.enemies.create(700, 300, 'enemy');
        enemy1.setBounce(1, 1);
        enemy1.setVelocity(-100, 0);
        enemy1.platforms = platforms;

        const enemy2 = this.enemies.create(100, 200, 'enemy');
        enemy2.setBounce(1, 1);
        enemy2.setVelocity(100, 0);
        enemy2.platforms = platforms;
    }

    setupTouchControls() {
        // Controles touch para mobile
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height - 100;

        this.isTouchingLeft = false;
        this.isTouchingRight = false;

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x < centerX / 2) {
                this.isTouchingLeft = true;
            }
            if (pointer.x > (centerX * 1.5)) {
                this.isTouchingRight = true;
            }
            // Pular ao tocar na área superior
            if (pointer.y < this.scale.height / 3) {
                this.jump();
            }
        });

        this.input.on('pointerup', (pointer) => {
            this.isTouchingLeft = false;
            this.isTouchingRight = false;
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                if (pointer.x < centerX / 2) {
                    this.isTouchingLeft = true;
                    this.isTouchingRight = false;
                } else if (pointer.x > (centerX * 1.5)) {
                    this.isTouchingRight = true;
                    this.isTouchingLeft = false;
                }
            }
        });
    }

    update() {
        // Movimentação pelo teclado (desktop)
        if (this.cursors.left.isDown || this.isTouchingLeft) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown || this.isTouchingRight) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        // Pulo
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.jump();
        }

        // Inimigos se movem
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.body.touching.right || enemy.body.x > this.scale.width - 30) {
                enemy.setVelocityX(-150);
            } else if (enemy.body.touching.left || enemy.body.x < 30) {
                enemy.setVelocityX(150);
            }
        });

        // Game Over - cair da tela
        if (this.player.y > this.scale.height) {
            this.physics.pause();
            this.add.text(
                this.scale.width / 2,
                this.scale.height / 2,
                'Game Over!',
                {
                    fontSize: '64px',
                    fill: '#FF0000',
                    fontFamily: 'Arial'
                }
            ).setOrigin(0.5);
            this.add.text(
                this.scale.width / 2,
                this.scale.height / 2 + 100,
                'Atualize a página para jogar novamente',
                {
                    fontSize: '24px',
                    fill: '#FFF',
                    fontFamily: 'Arial'
                }
            ).setOrigin(0.5);
        }
    }

    jump() {
        this.player.setVelocityY(-330);
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // Criar novas estrelas
        if (this.stars.countActive(true) === 0) {
            this.stars.children.entries.forEach(star => {
                star.enableBody(true, star.x, 0, true, true);
                star.setVelocity(
                    Phaser.Math.Between(-200, 200),
                    20
                );
            });
        }
    }

    hitEnemy(player, enemy) {
        this.physics.pause();
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'Colidiu com o inimigo!',
            {
                fontSize: '48px',
                fill: '#FF0000',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 80,
            'Atualize a página para jogar novamente',
            {
                fontSize: '24px',
                fill: '#FFF',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);
    }

    showInstructions() {
        const isMobile = this.scale.isPortrait() || 
                        this.input.keyboard.keys.length === 0;
        
        let instructions = isMobile 
            ? 'Toque esquerda/direita para mover\nToque em cima para pular'
            : 'Use SETAS para mover\nESPAÇO para pular';

        this.add.text(
            this.scale.width / 2,
            50,
            instructions,
            {
                fontSize: '18px',
                fill: '#FFF',
                fontFamily: 'Arial',
                align: 'center'
            }
        ).setOrigin(0.5);
    }

    handleResize(gameSize) {
        // Jogo se ajusta automaticamente ao redimensionar a janela
        if (this.scoreText) {
            this.scoreText.x = 16;
            this.scoreText.y = 16;
        }
    }
}

// Pré-carregar assets (usando forma simples com gráficos dinâmicos)
const PreloadScene = new Phaser.Scene('PreloadScene');
PreloadScene.preload = function() {
    // Não precisamos carregar assets - usaremos gráficos dinâmicos
};

PreloadScene.create = function() {
    // Criar players visualmente
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x00b300);
    graphics.fillRect(0, 0, 32, 48);
    graphics.generateTexture('player', 32, 48);
    graphics.destroy();

    // Criar plataforma
    const platformGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    platformGraphics.fillStyle(0x888888);
    platformGraphics.fillRect(0, 0, 400, 24);
    platformGraphics.generateTexture('platform', 400, 24);
    platformGraphics.destroy();

    // Criar estrela
    const starGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    starGraphics.fillStyle(0xffff00);
    starGraphics.fillCircle(8, 8, 8);
    starGraphics.generateTexture('star', 16, 16);
    starGraphics.destroy();

    // Criar inimigo
    const enemyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    enemyGraphics.fillStyle(0xff0000);
    enemyGraphics.fillRect(0, 0, 32, 32);
    enemyGraphics.generateTexture('enemy', 32, 32);
    enemyGraphics.destroy();

    this.scene.start('GameScene');
};

// Iniciar cena de prê-carregamento
const preloadConfig = {
    ...gameConfig,
    scene: PreloadScene
};

// Atualizar game com pré-carregamento
const gameWithPreload = new Phaser.Game({
    ...gameConfig,
    scene: [PreloadScene, GameScene]
});
