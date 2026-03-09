/**
 * Movimento do jogador
 */
export function attachMovementMethods(GameSceneClass) {
    GameSceneClass.prototype.handleMovement = function handleMovement() {
        const leftPressed = this.keys.A.isDown || this.touchControls.getLeftInput();
        const rightPressed = this.keys.D.isDown || this.touchControls.getRightInput();
        const upPressed = this.keys.W.isDown;
        const downPressed = this.keys.S.isDown;

        const acceleration = this.character.speed * 6;

        let accelX = 0;
        let accelY = 0;

        if (leftPressed) {
            accelX = -acceleration;
        } else if (rightPressed) {
            accelX = acceleration;
        }

        if (upPressed) {
            accelY = -acceleration;
        } else if (downPressed) {
            accelY = acceleration;
        }

        if (accelX !== 0 && accelY !== 0) {
            const norm = Math.SQRT2;
            accelX /= norm;
            accelY /= norm;
        }

        this.player.setAcceleration(accelX, accelY);
    };
}
