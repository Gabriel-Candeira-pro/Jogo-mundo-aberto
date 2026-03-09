/**
 * Aplicação de física ao movimento
 * Responsabilidade: Calcular e aplicar aceleração e velocidade ao jogador
 */
export function applyNoInputPhysics(scene) {
    scene.player.setAcceleration(0, 0);
}

export function calculateAcceleration(scene, dirX, dirY) {
    const maxSpeed = scene.character.speed;
    const acceleration = maxSpeed * 6;
    const turnBoost = 1.35;

    let accelX = dirX * acceleration;
    let accelY = dirY * acceleration;

    const velocity = scene.player.body?.velocity;
    
    if (velocity) {
        // Aumenta resposta ao inverter direção sem perder suavidade da inércia
        if (dirX !== 0 && velocity.x !== 0 && Math.sign(velocity.x) !== Math.sign(dirX)) {
            accelX *= turnBoost;
        }

        if (dirY !== 0 && velocity.y !== 0 && Math.sign(velocity.y) !== Math.sign(dirY)) {
            accelY *= turnBoost;
        }
    }

    return { accelX, accelY };
}

export function applyAcceleration(scene, accelX, accelY) {
    scene.player.setAcceleration(accelX, accelY);
}

export function detectStuckPlayer(scene, inputX, inputY) {
    const velocity = scene.player.body?.velocity;
    if (!velocity) return false;

    const hasDirectionalInput = inputX !== 0 || inputY !== 0;
    const isAlmostStopped = Math.abs(velocity.x) < 3 && Math.abs(velocity.y) < 3;
    const blocked = scene.player.body?.blocked || {};
    
    const movementBlockedByCollision =
        (inputX < 0 && blocked.left) ||
        (inputX > 0 && blocked.right) ||
        (inputY < 0 && blocked.up) ||
        (inputY > 0 && blocked.down);

    return {
        hasDirectionalInput,
        isAlmostStopped,
        movementBlockedByCollision,
        isStuck: hasDirectionalInput && isAlmostStopped && !movementBlockedByCollision
    };
}
