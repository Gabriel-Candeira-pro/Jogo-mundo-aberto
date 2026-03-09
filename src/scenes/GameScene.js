import Phaser from 'phaser';
import { TouchControls } from '../utils/controls.js';
import { dataManager } from '../data/DataManagerHybrid.js';

// Cena principal do jogo
export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.score = 0;
        this.starsCollected = 0;
    }

    create() {
        // Inicializa dados do jogo
        this.initGameData();

        this.setupPlayer();
        this.setupUI();
        this.setupControls();
        this.setupResize();
    }

    initGameData() {
        // Carrega dados do personagem, usuário e mapa GLOBAL
        this.character = dataManager.getCharacter();
        this.user = dataManager.getUser();
        this.mapData = dataManager.getMap(); // MAPA GLOBAL compartilhado
        
        // Verifica se os dados foram carregados
        if (!this.character || !this.user || !this.mapData) {
            console.error('❌ Dados não carregados. Voltando para tela de login...');
            this.scene.start('LoginScene');
            return;
        }
        
        // Inicia sessão de jogo
        this.session = dataManager.startGameSession();
        
        // Atualiza jogadores online
        this.updateOnlinePlayersDisplay();
        
        console.log('🌍 MODO MULTIPLAYER - Dados carregados:', {
            character: this.character.name,
            user: this.user.username,
            map: this.mapData.name + ' (GLOBAL)',
            level: this.mapData.level
        });
    }

    async updateOnlinePlayersDisplay() {
        const players = await dataManager.updateOnlinePlayers();
        console.log(`👥 Jogadores online: ${players.length}`);
        
        // Atualiza a cada 30 segundos
        this.time.addEvent({
            delay: 30000,
            callback: this.updateOnlinePlayersDisplay,
            callbackScope: this,
            loop: true
        });
    }

    setupPlayer() {
        // Renderiza o mapa
        this.renderMap();
        
        // Usa dados do personagem e mapa
        const spawn = this.mapData.playerSpawn;
        console.log('🎮 Criando jogador em:', spawn);
        
        this.player = this.physics.add.sprite(spawn.x, spawn.y, 'player');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);
        
        // Desativa gravidade para jogo top-down
        this.physics.world.gravity.y = 0;
        this.physics.world.gravity.x = 0;
        
        // Aplica cor do personagem
        this.player.setTint(this.character.color);
        
        // Desenha um círculo debug ao redor do jogador
        const debugCircle = this.add.circle(spawn.x, spawn.y, 20, 0x00FF00);
        debugCircle.setDepth(50);
        debugCircle.setStrokeStyle(2, 0x00FF00);
        
        // Cria colisores com os edifícios do mapa
        this.setupMapCollisions();
    }
    
    renderMap() {
        // Define cor de fundo (céu)
        this.cameras.main.setBackgroundColor(this.mapData.skyColor || '#87CEEB');
        
        console.log('🎨 Renderizando mapa com', this.mapData.buildings?.length || 0, 'edifícios');
        
        // Renderiza água
        if (this.mapData.water && this.mapData.water.length > 0) {
            this.mapData.water.forEach(water => {
                const centerX = water.x + water.width / 2;
                const centerY = water.y + water.height / 2;
                const rect = this.add.rectangle(centerX, centerY, water.width, water.height, 0x4A90E2);
                rect.setDepth(1);
                rect.setStrokeStyle(1, 0x0066CC);
            });
        }
        
        // Renderiza estradas
        if (this.mapData.roads && this.mapData.roads.length > 0) {
            this.mapData.roads.forEach(road => {
                const centerX = road.x + road.width / 2;
                const centerY = road.y + road.height / 2;
                const rect = this.add.rectangle(centerX, centerY, road.width, road.height, 0xD2B48C);
                rect.setDepth(2);
                rect.setStrokeStyle(2, 0x8B7355);
            });
        }
        
        // Renderiza obstáculos (árvores, rochas)
        if (this.mapData.obstacles && this.mapData.obstacles.length > 0) {
            this.mapData.obstacles.forEach(obstacle => {
                const color = obstacle.type === 'tree' ? 0x228B22 : 0x808080;
                const centerX = obstacle.x + obstacle.width / 2;
                const centerY = obstacle.y + obstacle.height / 2;
                const rect = this.add.rectangle(centerX, centerY, obstacle.width, obstacle.height, color);
                rect.setDepth(3);
            });
        }
        
        // Renderiza edifícios
        if (this.mapData.buildings && this.mapData.buildings.length > 0) {
            this.mapData.buildings.forEach(building => {
                const colors = {
                    house: 0xA0522D,
                    tower: 0x696969,
                    church: 0x8B4513,
                    mill: 0xCD853F,
                    market: 0xDAA520,
                    farm: 0x6B8E23,
                    decoration: 0xFF6347
                };
                const color = colors[building.type] || 0xA0522D;
                const centerX = building.x + building.width / 2;
                const centerY = building.y + building.height / 2;
                const rect = this.add.rectangle(centerX, centerY, building.width, building.height, color);
                rect.setDepth(3);
                rect.setStrokeStyle(2, 0x000000);
                
                // Adiciona label no edifício
                const text = this.add.text(centerX, centerY, building.name.substring(0, 10), {
                    fontSize: '10px',
                    fill: '#FFF',
                    backgroundColor: '#000000',
                    padding: { x: 2, y: 2 }
                }).setOrigin(0.5);
                text.setDepth(4);
            });
        }
        
        // Renderiza itens colecionáveis
        if (this.mapData.collectibles && this.mapData.collectibles.length > 0) {
            this.mapData.collectibles.forEach(item => {
                const color = item.type === 'coin' ? 0xFFD700 : 0xFF69B4;
                const circle = this.add.circle(item.x, item.y, 8, color);
                circle.setDepth(3);
                circle.setStrokeStyle(1, 0x000000);
            });
        }
        
        // Renderiza NPCs
        if (this.mapData.npcs && this.mapData.npcs.length > 0) {
            this.mapData.npcs.forEach(npc => {
                const circle = this.add.circle(npc.x, npc.y, 10, 0xFF00FF);
                circle.setDepth(3);
                circle.setStrokeStyle(1, 0xFF00FF);
                const text = this.add.text(npc.x, npc.y - 20, npc.name, {
                    fontSize: '10px',
                    fill: '#FF00FF',
                    backgroundColor: '#000000',
                    padding: { x: 2, y: 2 }
                }).setOrigin(0.5);
                text.setDepth(4);
            });
        }
        
        console.log('✅ Mapa renderizado');
    }
    
    setupMapCollisions() {
        // Cria objetos de colisão para os edifícios
        if (this.mapData.buildings && this.mapData.buildings.length > 0) {
            this.buildings = this.physics.add.staticGroup();
            this.mapData.buildings.forEach(building => {
                if (building.collision) {
                    this.buildings.create(building.x + building.width/2, building.y + building.height/2)
                        .setDisplaySize(building.width, building.height)
                        .setName(building.id);
                }
            });
            this.physics.add.collider(this.player, this.buildings);
        }
        
        // Cria colisores com obstáculos
        if (this.mapData.obstacles && this.mapData.obstacles.length > 0) {
            this.obstacles = this.physics.add.staticGroup();
            this.mapData.obstacles.forEach(obstacle => {
                if (obstacle.collision) {
                    this.obstacles.create(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2)
                        .setDisplaySize(obstacle.width, obstacle.height)
                        .setName(obstacle.id);
                }
            });
            this.physics.add.collider(this.player, this.obstacles);
        }
        
        // Cria colisores com água
        if (this.mapData.water && this.mapData.water.length > 0) {
            this.waterZones = this.physics.add.staticGroup();
            this.mapData.water.forEach(water => {
                if (water.collision) {
                    this.waterZones.create(water.x + water.width/2, water.y + water.height/2)
                        .setDisplaySize(water.width, water.height)
                        .setName(water.id);
                }
            });
            this.physics.add.collider(this.player, this.waterZones);
        }
    }

    setupUI() {
        // Painel de informações
        const padding = 16;
        
        // Score
        this.scoreText = this.add.text(padding, padding, 'Score: 0', {
            fontSize: '28px',
            fill: '#FFF',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        this.scoreText.setDepth(100);
        
        // Informações do personagem
        this.characterText = this.add.text(padding, padding + 35, 
            `${this.character.name} - Nv ${this.character.level}`, {
            fontSize: '18px',
            fill: '#FFD700',
            fontFamily: 'Arial'
        });
        this.characterText.setDepth(100);
        
        // Informações do usuário
        this.userText = this.add.text(padding, padding + 60,
            `${this.user.username} | High Score: ${this.user.highScore}`, {
            fontSize: '16px',
            fill: '#CCC',
            fontFamily: 'Arial'
        });
        this.userText.setDepth(100);
        
        // Informações do mapa GLOBAL (MULTIPLAYER)
        this.mapText = this.add.text(padding, padding + 80,
            `🌍 MAPA GLOBAL: ${this.mapData.name}`, {
            fontSize: '16px',
            fill: '#00FF00',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        this.mapText.setDepth(100);
        
        // Jogadores online
        this.playersText = this.add.text(padding, padding + 100,
            `👥 Jogadores online: ...`, {
            fontSize: '14px',
            fill: '#FFFF00',
            fontFamily: 'Arial'
        });
        this.playersText.setDepth(100);
        
        // Atualiza contagem de jogadores
        this.updatePlayersCount();
        
        this.showInstructions();
    }

    async updatePlayersCount() {
        const players = dataManager.getOnlinePlayers();
        this.playersText.setText(`👥 Jogadores online: ${players.length}`);
        
        // Atualiza a cada 30 segundos
        this.time.addEvent({
            delay: 30000,
            callback: async () => {
                await dataManager.updateOnlinePlayers();
                this.updatePlayersCount();
            },
            loop: true
        });
    }

    setupControls() {
        // WASD keys
        this.keys = {
            W: this.input.keyboard.addKey('W'),
            A: this.input.keyboard.addKey('A'),
            S: this.input.keyboard.addKey('S'),
            D: this.input.keyboard.addKey('D')
        };
        this.touchControls = new TouchControls(this);
    }

    setupResize() {
        this.scale.on('resize', this.handleResize, this);
    }

    update() {
        this.handleMovement();
    }

    handleMovement() {
        const leftPressed = this.keys.A.isDown || this.touchControls.getLeftInput();
        const rightPressed = this.keys.D.isDown || this.touchControls.getRightInput();
        const upPressed = this.keys.W.isDown;
        const downPressed = this.keys.S.isDown;

        let velocityX = 0;
        let velocityY = 0;

        // Movimento horizontal
        if (leftPressed) {
            velocityX = -this.character.speed;
        } else if (rightPressed) {
            velocityX = this.character.speed;
        }

        // Movimento vertical
        if (upPressed) {
            velocityY = -this.character.speed;
        } else if (downPressed) {
            velocityY = this.character.speed;
        }

        // Aplica velocidade
        this.player.setVelocity(velocityX, velocityY);
    }

    gameOver(won = false) {
        this.physics.pause();
        
        // Salva dados da sessão
        const result = dataManager.endGameSession(won);
        
        const title = won ? 'Você Venceu!' : 'Game Over!';
        const color = won ? '#00FF00' : '#FF0000';
        
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 - 80,
            title,
            {
                fontSize: '64px',
                fill: color,
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
        
        // Mostra estatísticas
        const stats = [
            `Score: ${this.score}`,
            `Estrelas: ${this.starsCollected}`,
            `Tempo: ${result ? result.duration : 0}s`
        ];
        
        if (this.character.experience > 0) {
            stats.push(`XP ganho: ${Math.floor(this.score / 10)}`);
        }
        
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            stats.join('\n'),
            {
                fontSize: '24px',
                fill: '#FFF',
                fontFamily: 'Arial',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 120,
            'Atualize a página para jogar novamente',
            {
                fontSize: '20px',
                fill: '#CCC',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);
    }

    showInstructions() {
        const isMobile = this.scale.isPortrait || 
                        this.sys.game.device.os.android || 
                        this.sys.game.device.os.iOS;
        
        let instructions = isMobile 
            ? 'Use os botões para explorar a vila\nAproxime-se de NPCs para interagir'
            : 'Use WASD para se mover\nExplore a vila e colete itens';

        const instructionsText = this.add.text(
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
        
        // Adiciona aviso de multiplayer
        this.add.text(
            this.scale.width / 2,
            85,
            '🌍 MODO MULTIPLAYER - Mapa compartilhado com todos os jogadores',
            {
                fontSize: '14px',
                fill: '#FFFF00',
                fontFamily: 'Arial',
                align: 'center'
            }
        ).setOrigin(0.5);
    }

    shutdown() {
        // Remove jogador da lista de online ao sair da cena
        if (dataManager && dataManager.leaveMultiplayer) {
            dataManager.leaveMultiplayer().catch(err => {
                console.error('Erro ao sair do multiplayer:', err);
            });
        }
    }

    handleResize(gameSize) {
        const padding = 16;
        if (this.scoreText) {
            this.scoreText.x = padding;
            this.scoreText.y = padding;
        }
        if (this.characterText) {
            this.characterText.x = padding;
            this.characterText.y = padding + 35;
        }
        if (this.userText) {
            this.userText.x = padding;
            this.userText.y = padding + 60;
        }
        if (this.mapText) {
            this.mapText.x = padding;
            this.mapText.y = padding + 80;
        }
    }
}
