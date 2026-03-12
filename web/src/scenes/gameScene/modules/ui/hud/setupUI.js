// Responsabilidade única: criar e configurar elementos visuais do HUD
export function attachSetupUI(GameSceneClass) {
    GameSceneClass.prototype.setupUI = function setupUI() {
        const padding = 16;

        this.playersText = this.add.text(padding, padding,
            '👥 Jogadores online: ...', {
                fontSize: '16px',
                fill: '#FFFF00',
                fontFamily: 'Arial'
            });
        this.playersText.setDepth(100);

        this.locationText = this.add.text(padding, padding + 28,
            'Bioma: ... — 0:0 (0,0)', {
                fontSize: '14px',
                fill: '#00FF00',
                fontFamily: 'Arial'
            });
        this.locationText.setDepth(100);

        // Invoca atualizações se as funções existirem (coesa e desacoplada)
        if (typeof this.updatePlayersCount === 'function') {
            this.updatePlayersCount();
        }
        if (typeof this.updateLocationDisplay === 'function') {
            this.updateLocationDisplay();
        }

        if (!this.locationTimer && this.time && typeof this.time.addEvent === 'function') {
            this.locationTimer = this.time.addEvent({
                delay: 500,
                callback: this.updateLocationDisplay,
                callbackScope: this,
                loop: true
            });
        }
    };
}
