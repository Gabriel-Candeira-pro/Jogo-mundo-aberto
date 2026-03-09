// Utilitários para controles touch
export class TouchControls {
    constructor(scene) {
        this.scene = scene;
        this.isTouchingLeft = false;
        this.isTouchingRight = false;
        this.setupTouchControls();
    }

    setupTouchControls() {
        const scene = this.scene;
        const centerX = scene.scale.width / 2;

        scene.input.on('pointerdown', (pointer) => {
            if (pointer.x < centerX / 2) {
                this.isTouchingLeft = true;
            }
            if (pointer.x > (centerX * 1.5)) {
                this.isTouchingRight = true;
            }
            // Pular ao tocar na área superior
            if (pointer.y < scene.scale.height / 3) {
                this.jump();
            }
        });

        scene.input.on('pointerup', (pointer) => {
            this.isTouchingLeft = false;
            this.isTouchingRight = false;
        });

        scene.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                if (pointer.x < centerX / 2) {
                    this.isTouchingLeft = true;
                    this.isTouchingRight = false;
                } else if (pointer.x > (centerX * 1.5)) {
                    this.isTouchingRight = true;
                    this.isTouchingLeft = false;
                }
            }
        });
    }

    jump() {
        if (this.scene.player && this.scene.player.body.touching.down) {
            this.scene.player.setVelocityY(-330);
        }
    }

    getLeftInput() {
        return this.isTouchingLeft;
    }

    getRightInput() {
        return this.isTouchingRight;
    }
}
