/**
 * Movimento do jogador
 */
export function attachMovementMethods(GameSceneClass) {
    GameSceneClass.prototype.handleMovement = function handleMovement() {
        const leftPressed = this.keys.A.isDown || this.touchControls.getLeftInput();
        const rightPressed = this.keys.D.isDown || this.touchControls.getRightInput();
        const upPressed = this.keys.W.isDown;
        const downPressed = this.keys.S.isDown;

        let velocityX = 0;
        let velocityY = 0;

        if (leftPressed) {
            velocityX = -this.character.speed;
        } else if (rightPressed) {
            velocityX = this.character.speed;
        }

        if (upPressed) {
            velocityY = -this.character.speed;
        } else if (downPressed) {
            velocityY = this.character.speed;
        }

        this.player.setVelocity(velocityX, velocityY);
    };
}
