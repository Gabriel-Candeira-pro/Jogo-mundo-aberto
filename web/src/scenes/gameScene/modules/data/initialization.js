import { dataManager } from '../../../../data/DataManagerHybrid.js';

/**
 * Inicialização de dados do jogo
 */
export function attachInitializationMethods(GameSceneClass) {
    GameSceneClass.prototype.initGameData = function initGameData() {
        this.character = dataManager.getCharacter();
        this.user = dataManager.getUser();
        this.mapData = dataManager.getMap();

        if (!this.character || !this.user || !this.mapData) {
            console.error('❌ Dados não carregados. Voltando para tela de login...');
            this.scene.start('LoginScene');
            return;
        }

        this.session = dataManager.startGameSession();
        this.updateOnlinePlayersDisplay();

        console.log('🌍 MODO MULTIPLAYER - Dados carregados:', {
            character: this.character.name,
            user: this.user.username,
            map: this.mapData.name + ' (GLOBAL)',
            level: this.mapData.level
        });
    };
}
