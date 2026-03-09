import Phaser from 'phaser';
import { dataManager } from '../data/DataManagerHybrid.js';
import { setupPlayer } from './gameScene/modules/player/setup.js';
import { setupControls, handleMovement } from './gameScene/modules/player/movement.js';

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
        setupPlayer(this);
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
        setupControls(this);
    }

    setupResize() {
        this.scale.on('resize', this.handleResize, this);
    }

    update() {
        this.handleMovement();
    }

    handleMovement() {
        handleMovement(this);
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
