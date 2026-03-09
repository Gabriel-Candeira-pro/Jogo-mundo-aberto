import { dataManager } from '../../../../data/DataManagerHybrid.js';

/**
 * Sincronização de jogadores online
 */
export function attachMultiplayerSyncMethods(GameSceneClass) {
    GameSceneClass.prototype.updateOnlinePlayersDisplay = async function updateOnlinePlayersDisplay() {
        const players = await dataManager.updateOnlinePlayers();
        console.log(`👥 Jogadores online: ${players.length}`);

        this.time.addEvent({
            delay: 30000,
            callback: this.updateOnlinePlayersDisplay,
            callbackScope: this,
            loop: true
        });
    };

    GameSceneClass.prototype.updatePlayersCount = async function updatePlayersCount() {
        const players = dataManager.getOnlinePlayers();
        this.playersText.setText(`👥 Jogadores online: ${players.length}`);

        this.time.addEvent({
            delay: 30000,
            callback: async () => {
                await dataManager.updateOnlinePlayers();
                this.updatePlayersCount();
            },
            loop: true
        });
    };
}
