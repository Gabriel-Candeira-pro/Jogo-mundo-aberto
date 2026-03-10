/**
 * Gerenciamento de estado do movimento baseado em tiles
 * Responsabilidade: Inicializar e manter o estado do sistema tile-based
 */
export function initTileMovementState(scene, mapData) {
    scene.tileMovement = {
        TILE_SIZE: 16,
        MOVE_DURATION: 300, // ms para se mover de um tile para outro
        // Estado do movimento
        isMoving: false,
        moveStartTime: 0,
        currentTileX: 0,
        currentTileY: 0,
        nextTileX: 0,
        nextTileY: 0,
        chunkX: 0,
        chunkY: 0,
        debug: false  // Desativado para reduzir spam de logs
    };
    
    // Calcular tile inicial baseado na posição pixel do spawn
    const spawn = mapData.playerSpawn;
    scene.tileMovement.currentTileX = Math.round(spawn.x / scene.tileMovement.TILE_SIZE);
    scene.tileMovement.currentTileY = Math.round(spawn.y / scene.tileMovement.TILE_SIZE);
    // Inicializa chunkX e chunkY
    scene.tileMovement.chunkX = 0;
    scene.tileMovement.chunkY = 0;
    
    console.info('[TileMovement] Sistema inicializado', {
        tileX: scene.tileMovement.currentTileX,
        tileY: scene.tileMovement.currentTileY
    });
}

export function alignPlayerToTile(player, tileMovement) {
    player.x = tileMovement.currentTileX * tileMovement.TILE_SIZE;
    player.y = tileMovement.currentTileY * tileMovement.TILE_SIZE;
}

export function disablePhysics(player) {
    if (player.body) {
        player.body.setVelocity(0, 0);
        player.body.setAcceleration(0, 0);
    }
}

export function updateMovementProgress(scene) {
    const tm = scene.tileMovement;
    const now = scene.time.now;
    const elapsed = now - tm.moveStartTime;
    const progress = Math.min(elapsed / tm.MOVE_DURATION, 1);
    
    return { progress, elapsed };
}

export function completeMovement(scene) {
    const tm = scene.tileMovement;
    tm.isMoving = false;
    tm.currentTileX = tm.nextTileX;
    tm.currentTileY = tm.nextTileY;
    
    if (tm.debug) {
        console.log('[TileMovement] Movimento completado', {
            tileX: tm.currentTileX,
            tileY: tm.currentTileY
        });
    }
}

export function startMovement(scene, nextTileX, nextTileY, direction) {
    const tm = scene.tileMovement;
    tm.isMoving = true;
    tm.nextTileX = nextTileX;
    tm.nextTileY = nextTileY;
    tm.moveStartTime = scene.time.now;
    
    if (tm.debug) {
        console.log('[TileMovement] Iniciando movimento', {
            direction,
            from: { x: tm.currentTileX, y: tm.currentTileY },
            to: { x: nextTileX, y: nextTileY }
        });
    }
}
