/**
 * HUD e elementos de status
 */
export function attachHUDMethods(GameSceneClass) {
    GameSceneClass.prototype.setupUI = function setupUI() {
        const padding = 16;

        this.scoreText = this.add.text(padding, padding, 'Score: 0', {
            fontSize: '28px',
            fill: '#FFF',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        this.scoreText.setDepth(100);

        this.characterText = this.add.text(padding, padding + 35,
            `${this.character.name} - Nv ${this.character.level}`, {
                fontSize: '18px',
                fill: '#FFD700',
                fontFamily: 'Arial'
            });
        this.characterText.setDepth(100);

        this.userText = this.add.text(padding, padding + 60,
            `${this.user.username} | High Score: ${this.user.highScore}`, {
                fontSize: '16px',
                fill: '#CCC',
                fontFamily: 'Arial'
            });
        this.userText.setDepth(100);

        this.mapText = this.add.text(padding, padding + 80,
            `🌍 MAPA GLOBAL: ${this.mapData.name}`, {
                fontSize: '16px',
                fill: '#00FF00',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            });
        this.mapText.setDepth(100);

        this.playersText = this.add.text(padding, padding + 100,
            '👥 Jogadores online: ...', {
                fontSize: '14px',
                fill: '#FFFF00',
                fontFamily: 'Arial'
            });
        this.playersText.setDepth(100);

        this.updatePlayersCount();
        this.showInstructions();
    };
}
