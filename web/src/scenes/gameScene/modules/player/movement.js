/**
 * Movimento do jogador - Orquestrador
 * Responsabilidade: Coordenar os diferentes módulos de movimento
 */
import {
    initInputBuffer,
    decrementInputBuffer,
    ensureKeyboardEnabled,
    initializeKeys,
    getInputState,
    calculateInputVector
} from './movement/inputDetection.js';

import {
    applyNoInputPhysics,
    calculateAcceleration,
    applyAcceleration,
    detectStuckPlayer
} from './movement/physicsMovement.js';

import {
    initMovementDebug,
    logKeyboardState,
    logInputChange,
    logNoInputState,
    logMovementApplication,
    logCollisionBlock,
    updateStuckFrames,
    logStuckWarning
} from './movement/movementDebug.js';

export function attachMovementMethods(GameSceneClass) {
    GameSceneClass.prototype.handleMovement = function handleMovement() {
        // Inicialização
        initMovementDebug(this);
        initInputBuffer(this);
        
        // Debug logging
        logKeyboardState(this);
        
        // Garantir teclado e teclas funcionando
        ensureKeyboardEnabled(this);
        initializeKeys(this);
        
        // Processar buffer
        decrementInputBuffer(this);
        
        // Obter estado de inputs
        const inputState = getInputState(this);
        const { inputX, inputY, dirX, dirY } = calculateInputVector(inputState);
        
        // Debug de mudança de input
        logInputChange(this, inputX, inputY, inputState.touch);
        
        // Se não há input, não aplicar física
        if (inputX === 0 && inputY === 0) {
            applyNoInputPhysics(this);
            logNoInputState(this);
            return;
        }
        
        // Calcular e aplicar aceleração
        const { accelX, accelY } = calculateAcceleration(this, dirX, dirY);
        applyAcceleration(this, accelX, accelY);
        
        // Debug de aplicação de movimento
        logMovementApplication(this, inputX, inputY, dirX, dirY, accelX, accelY);
        
        // Detectar jogador travado
        const stuckState = detectStuckPlayer(this, inputX, inputY);
        
        // Debug colisão
        if (stuckState.hasDirectionalInput && stuckState.isAlmostStopped && stuckState.movementBlockedByCollision) {
            logCollisionBlock(this, inputX, inputY);
        }
        
        // Atualizar contador de frames travados
        updateStuckFrames(this, stuckState.isStuck);
        
        // Debug warning de travamento
        logStuckWarning(this, inputX, inputY, accelX, accelY);
    };
}
