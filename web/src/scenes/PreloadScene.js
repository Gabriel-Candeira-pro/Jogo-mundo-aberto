import Phaser from 'phaser';
import { dataManager } from '../data/DataManagerHybrid.js';

// Cena de Pré-carregamento - cria assets dinâmicos
export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Não precisamos carregar assets - usaremos gráficos dinâmicos
        
        // Mostra texto de carregamento
        const width = this.scale.width;
        const height = this.scale.height;
        
        this.loadingText = this.add.text(width / 2, height / 2, 'Carregando...', {
            fontSize: '32px',
            fill: '#00b300',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }

    async create() {
        try {
            // Aguarda a inicialização do DataManager
            this.loadingText.setText('Carregando dados do servidor...');
            const initialized = await Promise.race([
                dataManager.waitForInit(),
                new Promise((_, reject) => {
                    this.time.delayedCall(12000, () => {
                        reject(new Error('Tempo limite excedido ao inicializar jogo'));
                    });
                })
            ]);
            
            if (!initialized) {
                throw new Error('Falha ao inicializar dados do jogo');
            }
            
            this.loadingText.setText('Criando texturas...');
            this.createPlayerTexture();
            
            this.loadingText.setText('Iniciando jogo...');
            
            // Pequeno delay para mostrar a mensagem
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
            });
        } catch (error) {
            console.error('❌ Erro ao carregar jogo:', error);
            this.loadingText.setText('Erro ao carregar! Voltando ao login...');
            this.loadingText.setColor('#ff0000');
            
            // Volta para tela de login após 2 segundos
            this.time.delayedCall(2000, () => {
                this.scene.start('LoginScene');
            });
        }
    }

    createPlayerTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x00b300);
        graphics.fillRect(0, 0, 32, 48);
        graphics.generateTexture('player', 32, 48);
        graphics.destroy();
    }

}
