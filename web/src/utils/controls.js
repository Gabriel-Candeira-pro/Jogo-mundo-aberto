// Utilitários para controles touch
export class TouchControls {
    constructor(scene) {
        this.scene = scene;
        this.isTouchingLeft = false;
        this.isTouchingRight = false;
        this.isTouchingUp = false;
        this.isTouchingDown = false;
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

            const middleLeft = centerX / 2;
            const middleRight = centerX * 1.5;
            if (pointer.x >= middleLeft && pointer.x <= middleRight) {
                if (pointer.y < scene.scale.height / 3) {
                    this.isTouchingUp = true;
                }
                if (pointer.y > (scene.scale.height * 2) / 3) {
                    this.isTouchingDown = true;
                }
            }
        });

        scene.input.on('pointerup', (pointer) => {
            this.isTouchingLeft = false;
            this.isTouchingRight = false;
            this.isTouchingUp = false;
            this.isTouchingDown = false;
        });

        scene.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                if (pointer.x < centerX / 2) {
                    this.isTouchingLeft = true;
                    this.isTouchingRight = false;
                    this.isTouchingUp = false;
                    this.isTouchingDown = false;
                } else if (pointer.x > (centerX * 1.5)) {
                    this.isTouchingRight = true;
                    this.isTouchingLeft = false;
                    this.isTouchingUp = false;
                    this.isTouchingDown = false;
                } else {
                    this.isTouchingLeft = false;
                    this.isTouchingRight = false;
                    this.isTouchingUp = pointer.y < scene.scale.height / 3;
                    this.isTouchingDown = pointer.y > (scene.scale.height * 2) / 3;
                }
            }
        });
    }

    getLeftInput() {
        return this.isTouchingLeft;
    }

    getRightInput() {
        return this.isTouchingRight;
    }

    getUpInput() {
        return this.isTouchingUp;
    }

    getDownInput() {
        return this.isTouchingDown;
    }
}
