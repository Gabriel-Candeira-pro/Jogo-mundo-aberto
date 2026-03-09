/**
 * Sistema de debug de movimento
 * Responsabilidade: Logging e diagnóstico do sistema de movimento
 */
export function initMovementDebug(scene) {
    if (!scene.movementDebug) {
        scene.movementDebug = {
            enabled: true,
            logEveryMs: 1500,
            lastSummaryAt: 0,
            lastInputSignature: '',
            stuckFrames: 0,
            lastWarnAt: 0,
            lastBlockedSignature: ''
        };
        console.info('[MovementDebug] Diagnostico de movimento ativado.');
    }
}

export function logKeyboardState(scene) {
    const debug = scene.movementDebug;
    if (!debug.enabled) return;

    const now = scene.time?.now ?? Date.now();
    if (now - debug.lastSummaryAt < 1500) return;

    const keyboard = scene.input?.keyboard;
    console.log('[MovementDebug] Estado do teclado:', {
        keyboard: keyboard ? 'existe' : 'null',
        keyboard_enabled: keyboard?.enabled,
        keys_exists: Boolean(scene.keys),
        buffer: {
            W: scene.inputBuffer.W,
            A: scene.inputBuffer.A,
            S: scene.inputBuffer.S,
            D: scene.inputBuffer.D
        }
    });
    debug.lastSummaryAt = now;
}

export function logInputChange(scene, inputX, inputY, touch) {
    const debug = scene.movementDebug;
    if (!debug.enabled) return;

    const signature = `${inputX},${inputY}|b${scene.inputBuffer.W}${scene.inputBuffer.A}${scene.inputBuffer.S}${scene.inputBuffer.D}`;
    
    if (signature !== debug.lastInputSignature) {
        debug.lastInputSignature = signature;
        console.log('[MovementDebug] Mudanca de input', {
            inputX,
            inputY,
            buffer: {
                W: scene.inputBuffer.W,
                A: scene.inputBuffer.A,
                S: scene.inputBuffer.S,
                D: scene.inputBuffer.D
            },
            touch
        });
    }
}

export function logNoInputState(scene) {
    const debug = scene.movementDebug;
    if (!debug.enabled) return;

    const now = scene.time?.now ?? Date.now();
    if (now - debug.lastSummaryAt < debug.logEveryMs) return;

    const velocity = scene.player.body?.velocity;
    console.log('[MovementDebug] Sem input', {
        velocityX: velocity ? Number(velocity.x.toFixed(2)) : null,
        velocityY: velocity ? Number(velocity.y.toFixed(2)) : null
    });
    debug.lastSummaryAt = now;
}

export function logMovementApplication(scene, inputX, inputY, dirX, dirY, accelX, accelY) {
    const debug = scene.movementDebug;
    if (!debug.enabled) return;

    const now = scene.time?.now ?? Date.now();
    if (now - debug.lastSummaryAt < debug.logEveryMs) return;

    const velocity = scene.player.body?.velocity;
    if (!velocity) return;

    const speed = Math.hypot(velocity.x, velocity.y);
    console.log('[MovementDebug] Aplicando movimento', {
        inputX,
        inputY,
        dirX: Number(dirX.toFixed(3)),
        dirY: Number(dirY.toFixed(3)),
        accelX: Number(accelX.toFixed(2)),
        accelY: Number(accelY.toFixed(2)),
        velocityX: Number(velocity.x.toFixed(2)),
        velocityY: Number(velocity.y.toFixed(2)),
        speed: Number(speed.toFixed(2)),
        maxSpeed: scene.character.speed,
        position: {
            x: Number(scene.player.x.toFixed(2)),
            y: Number(scene.player.y.toFixed(2))
        },
        blocked: {
            left: Boolean(scene.player.body?.blocked?.left),
            right: Boolean(scene.player.body?.blocked?.right),
            up: Boolean(scene.player.body?.blocked?.up),
            down: Boolean(scene.player.body?.blocked?.down)
        },
        touching: {
            left: Boolean(scene.player.body?.touching?.left),
            right: Boolean(scene.player.body?.touching?.right),
            up: Boolean(scene.player.body?.touching?.up),
            down: Boolean(scene.player.body?.touching?.down)
        }
    });
    debug.lastSummaryAt = now;
}

export function logCollisionBlock(scene, inputX, inputY) {
    const debug = scene.movementDebug;
    if (!debug.enabled) return;

    const blocked = scene.player.body?.blocked || {};
    const blockedSignature = `${Number(inputX < 0 && blocked.left)}${Number(inputX > 0 && blocked.right)}${Number(inputY < 0 && blocked.up)}${Number(inputY > 0 && blocked.down)}`;
    
    if (blockedSignature !== debug.lastBlockedSignature) {
        debug.lastBlockedSignature = blockedSignature;
        console.info('[MovementDebug] Input ativo, mas bloqueado por colisao.', {
            inputX,
            inputY,
            position: {
                x: Number(scene.player.x.toFixed(2)),
                y: Number(scene.player.y.toFixed(2))
            },
            blocked: {
                left: Boolean(blocked.left),
                right: Boolean(blocked.right),
                up: Boolean(blocked.up),
                down: Boolean(blocked.down)
            }
        });
    }
}

export function updateStuckFrames(scene, isStuck) {
    const debug = scene.movementDebug;
    
    if (isStuck) {
        debug.stuckFrames += 1;
    } else {
        debug.stuckFrames = 0;
    }
}

export function logStuckWarning(scene, inputX, inputY, accelX, accelY) {
    const debug = scene.movementDebug;
    if (!debug.enabled) return;

    const now = scene.time?.now ?? Date.now();
    if (debug.stuckFrames < 12 || now - debug.lastWarnAt <= 1000) return;

    const velocity = scene.player.body?.velocity;
    const blocked = scene.player.body?.blocked || {};

    debug.lastWarnAt = now;
    console.warn('[MovementDebug] Possivel inconsistencia: input ativo com velocidade quase nula.', {
        stuckFrames: debug.stuckFrames,
        inputX,
        inputY,
        velocityX: Number(velocity.x.toFixed(2)),
        velocityY: Number(velocity.y.toFixed(2)),
        accelX: Number(accelX.toFixed(2)),
        accelY: Number(accelY.toFixed(2)),
        position: {
            x: Number(scene.player.x.toFixed(2)),
            y: Number(scene.player.y.toFixed(2))
        },
        blocked: {
            left: Boolean(blocked.left),
            right: Boolean(blocked.right),
            up: Boolean(blocked.up),
            down: Boolean(blocked.down)
        },
        dragX: scene.player.body?.drag?.x,
        dragY: scene.player.body?.drag?.y
    });
}
