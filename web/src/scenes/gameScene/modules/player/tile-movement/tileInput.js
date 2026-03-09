/**
 * Detecção de input para movimento tile-based
 * Responsabilidade: Ler teclas e determinar direção do movimento
 */
export function getNextTileFromInput(scene, currentTileX, currentTileY) {
    if (!scene.keys) {
        return { nextTileX: currentTileX, nextTileY: currentTileY, direction: null, keyToConsume: null };
    }
    
    let nextTileX = currentTileX;
    let nextTileY = currentTileY;
    let direction = null;
    let keyToConsume = null;
    
    // Prioridade: cima > esquerda > baixo > direita (como Fire Red)
    if (scene.keys.W?.isDown) {
        nextTileY -= 1;
        direction = 'UP';
        keyToConsume = scene.keys.W;
    } else if (scene.keys.A?.isDown) {
        nextTileX -= 1;
        direction = 'LEFT';
        keyToConsume = scene.keys.A;
    } else if (scene.keys.S?.isDown) {
        nextTileY += 1;
        direction = 'DOWN';
        keyToConsume = scene.keys.S;
    } else if (scene.keys.D?.isDown) {
        nextTileX += 1;
        direction = 'RIGHT';
        keyToConsume = scene.keys.D;
    }
    
    return { nextTileX, nextTileY, direction, keyToConsume };
}

export function consumeKeyPress(key) {
    if (key) {
        key.isDown = false;
    }
}
