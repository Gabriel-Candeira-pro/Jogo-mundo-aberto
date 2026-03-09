/**
 * Animação de transição entre tiles
 * Responsabilidade: Interpolar a posição do jogador durante o movimento
 */
export function interpolatePosition(player, tileMovement, progress) {
    const tm = tileMovement;
    const startX = tm.currentTileX * tm.TILE_SIZE;
    const startY = tm.currentTileY * tm.TILE_SIZE;
    const endX = tm.nextTileX * tm.TILE_SIZE;
    const endY = tm.nextTileY * tm.TILE_SIZE;
    
    player.x = startX + (endX - startX) * progress;
    player.y = startY + (endY - startY) * progress;
}
