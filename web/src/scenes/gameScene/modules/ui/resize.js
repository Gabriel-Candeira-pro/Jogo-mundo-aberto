/**
 * Gerenciamento de resize
 */
export function attachResizeMethods(GameSceneClass) {
    GameSceneClass.prototype.setupResize = function setupResize() {
        this.scale.on('resize', this.handleResize, this);
    };

    GameSceneClass.prototype.handleResize = function handleResize(gameSize) {
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
    };
}
