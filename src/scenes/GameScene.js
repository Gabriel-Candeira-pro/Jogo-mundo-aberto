import { TouchControls } from '../utils/controls.js';

// Cena principal do jogo
export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.score = 0;
    }

    create() {
        this.setupPlatforms();
        this.setupPlayer();
        this.setupStars();
        this.setupEnemies();
        this.setupUI();
        this.setupCollisions();
        this.setupControls();
        this.setupResize();
    }

    setupPlatforms() {
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'platform').setScale(2).refreshBody();
        platforms.create(600, 400, 'platform');
        platforms.create(50, 250, 'platform');
        platforms.create(750, 220, 'platform');
        this.platforms = platforms;
    }

    setupPlayer() {
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
    }

    setupStars() {
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

        this.physics.add.collider(this.stars, this.platforms);
    }

    setupEnemies() {
        this.enemies = this.physics.add.group();
        this.createEnemies();
        this.physics.add.collider(this.enemies, this.platforms);
    }

    createEnemies() {
        const enemy1 = this.enemies.create(700, 300, 'enemy');
        enemy1.setBounce(1, 1);
        enemy1.setVelocity(-100, 0);

        const enemy2 = this.enemies.create(100, 200, 'enemy');
        enemy2.setBounce(1, 1);
        enemy2.setVelocity(100, 0);
    }

    setupCollisions() {
        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStar,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.hitEnemy,
            null,
            this
        );
    }

    setupUI() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#FFF',
            fontFamily: 'Arial'
        });
        this.scoreText.setDepth(100);
        this.showInstructions();
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.touchControls = new TouchControls(this);
    }

    setupResize() {
        this.scale.on('resize', this.handleResize, this);
    }

    update() {
        this.handleMovement();
        this.updateEnemies();
        this.checkGameOver();
    }

    handleMovement() {
        const leftPressed = this.cursors.left.isDown || this.touchControls.getLeftInput();
        const rightPressed = this.cursors.right.isDown || this.touchControls.getRightInput();

        if (leftPressed) {
            this.player.setVelocityX(-160);
        } else if (rightPressed) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.jump();
        }
    }

    jump() {
        this.player.setVelocityY(-330);
    }

    updateEnemies() {
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.body.touching.right || enemy.body.x > this.scale.width - 30) {
                enemy.setVelocityX(-150);
            } else if (enemy.body.touching.left || enemy.body.x < 30) {
                enemy.setVelocityX(150);
            }
        });
    }

    checkGameOver() {
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

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

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
        if (this.scoreText) {
            this.scoreText.x = 16;
            this.scoreText.y = 16;
        }
    }
}
