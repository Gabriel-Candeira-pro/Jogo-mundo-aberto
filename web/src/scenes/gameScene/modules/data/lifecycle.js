import { dataManager } from '../../../../data/DataManagerHybrid.js';

/**
 * Lifecycle e game over
 */
export function attachLifecycleMethods(GameSceneClass) {
    GameSceneClass.prototype.shutdown = function shutdown() {
        if (this.onlinePlayersDisplayTimer) {
            this.onlinePlayersDisplayTimer.remove(false);
            this.onlinePlayersDisplayTimer = null;
        }

        if (this.playersCountTimer) {
            this.playersCountTimer.remove(false);
            this.playersCountTimer = null;
        }

        if (dataManager && dataManager.leaveMultiplayer) {
            dataManager.leaveMultiplayer().catch(err => {
                console.error('Erro ao sair do multiplayer:', err);
            });
        }
    };

    GameSceneClass.prototype.gameOver = function gameOver(won = false) {
        this.physics.pause();

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
    };
}
