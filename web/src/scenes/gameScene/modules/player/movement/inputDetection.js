/**
 * Detecção e bufferização de inputs
 * Responsabilidade: Capturar e gerenciar estado de inputs do teclado e touch
 */
export function initInputBuffer(scene) {
    if (!scene.inputBuffer) {
        scene.inputBuffer = {
            W: 0, A: 0, S: 0, D: 0
        };
    }
}

export function decrementInputBuffer(scene) {
    if (scene.inputBuffer.W > 0) scene.inputBuffer.W--;
    if (scene.inputBuffer.A > 0) scene.inputBuffer.A--;
    if (scene.inputBuffer.S > 0) scene.inputBuffer.S--;
    if (scene.inputBuffer.D > 0) scene.inputBuffer.D--;
}

export function ensureKeyboardEnabled(scene) {
    const keyboard = scene.input?.keyboard;
    
    if (keyboard && !keyboard.enabled) {
        keyboard.enabled = true;
        console.warn('[InputDetection] ⚠️ Teclado desabilitado detectado e reativado');
    }
}

export function initializeKeys(scene) {
    const keyboard = scene.input?.keyboard;
    
    if (!scene.keys || Object.keys(scene.keys).length === 0) {
        if (keyboard) {
            scene.keys = {
                W: keyboard.addKey('W'),
                A: keyboard.addKey('A'),
                S: keyboard.addKey('S'),
                D: keyboard.addKey('D')
            };
            console.warn('[InputDetection] ⚠️ Keys foram reinicializadas');
        } else {
            scene.keys = {};
        }
    }
}

export function getInputState(scene) {
    const keys = scene.keys || {};
    const touchLeft = scene.touchControls?.getLeftInput?.() ?? false;
    const touchRight = scene.touchControls?.getRightInput?.() ?? false;
    const touchUp = scene.touchControls?.getUpInput?.() ?? false;
    const touchDown = scene.touchControls?.getDownInput?.() ?? false;

    return {
        leftPressed: (scene.inputBuffer.A > 0) || touchLeft,
        rightPressed: (scene.inputBuffer.D > 0) || touchRight,
        upPressed: (scene.inputBuffer.W > 0) || touchUp,
        downPressed: (scene.inputBuffer.S > 0) || touchDown,
        touch: { touchLeft, touchRight, touchUp, touchDown }
    };
}

export function calculateInputVector(inputState) {
    const inputX = Number(inputState.rightPressed) - Number(inputState.leftPressed);
    const inputY = Number(inputState.downPressed) - Number(inputState.upPressed);

    if (inputX === 0 && inputY === 0) {
        return { inputX: 0, inputY: 0, dirX: 0, dirY: 0, magnitude: 0 };
    }

    const magnitude = Math.hypot(inputX, inputY);
    const dirX = inputX / magnitude;
    const dirY = inputY / magnitude;

    return { inputX, inputY, dirX, dirY, magnitude };
}
