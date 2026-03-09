import { TouchControls } from '../../../../utils/controls.js';

/**
 * Configuração de entrada de controles
 */
export function attachInputMethods(GameSceneClass) {
    GameSceneClass.prototype.setupControls = function setupControls() {
        this.keys = {
            W: this.input.keyboard.addKey('W'),
            A: this.input.keyboard.addKey('A'),
            S: this.input.keyboard.addKey('S'),
            D: this.input.keyboard.addKey('D')
        };
        this.touchControls = new TouchControls(this);
    };
}
