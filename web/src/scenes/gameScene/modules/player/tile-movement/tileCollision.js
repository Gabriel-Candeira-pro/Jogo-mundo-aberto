/**
 * Sistema de detecção de colisão para tiles
 * Responsabilidade: Verificar se um tile específico tem colisão
 */
import Phaser from 'phaser';

export function checkTileCollision(scene, tileX, tileY) {
    const TILE_SIZE = scene.tileMovement.TILE_SIZE;
    const pixelX = tileX * TILE_SIZE;
    const pixelY = tileY * TILE_SIZE;
    
    // Checar limites do mapa (world bounds)
    const outDir = getOutOfBoundsDirection(scene, pixelX, pixelY);
    if (outDir) {
        // Retorna direção de saída para transição de chunk
        return outDir;
    }
    
    // Criar zona de teste para overlap
    const testZone = new Phaser.Geom.Rectangle(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
    
    // Checar colisões com diferentes tipos de obstáculos
    return (
        hasCollisionWithGroup(scene.buildings, testZone) ||
        hasCollisionWithGroup(scene.obstacles, testZone) ||
        hasCollisionWithGroup(scene.waterZones, testZone)
    );
}

function isOutOfBounds(scene, pixelX, pixelY) {
    // Substituído por getOutOfBoundsDirection
    // Mantido para compatibilidade, mas não usado
    return false;

}

// Retorna direção de saída se estiver fora dos limites
function getOutOfBoundsDirection(scene, pixelX, pixelY) {
    const mapWidth = scene.mapData.width || 800;
    const mapHeight = scene.mapData.height || 600;
    if (pixelX < 0) return 'left';
    if (pixelX >= mapWidth) return 'right';
    if (pixelY < 0) return 'up';
    if (pixelY >= mapHeight) return 'down';
    return null;
}

function hasCollisionWithGroup(group, testZone) {
    if (!group || !group.children || group.children.entries.length === 0) {
        return false;
    }
    
    for (let child of group.children.entries) {
        if (Phaser.Geom.Rectangle.Overlaps(testZone, child.getBounds())) {
            return true;
        }
    }
    
    return false;
}
