import { TouchControls } from '../../../../utils/controls.js';
import Phaser from 'phaser';

/**
 * Configuração de entrada de controles
 */
export function attachInputMethods(GameSceneClass) {
    GameSceneClass.prototype.setupControls = function setupControls() {
        console.info('[InputDebug] 🔧 setupControls chamado');
        
        const keyboard = this.input?.keyboard;

        if (!keyboard) {
            console.warn('❌ [InputDebug] Teclado indisponivel nesta plataforma.');
            this.keys = {};
            this.touchControls = new TouchControls(this);
            return;
        }

        keyboard.enabled = true;
        keyboard.addCapture(['W', 'A', 'S', 'D']);
        console.info('[InputDebug] Teclado inicializado com captura WASD.');

        this.keys = {
            W: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };

        console.log('[InputDebug] ✅ Keys criadas (polling puro, sem event listeners):', {
            W: this.keys.W ? 'OK' : 'FAIL',
            A: this.keys.A ? 'OK' : 'FAIL',
            S: this.keys.S ? 'OK' : 'FAIL',
            D: this.keys.D ? 'OK' : 'FAIL'
        });

        this.touchControls = new TouchControls(this);
        console.info('[InputDebug] ✅ setupControls completado com sucesso');
    };
}
