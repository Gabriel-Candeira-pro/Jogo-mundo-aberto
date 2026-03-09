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
    if (isOutOfBounds(scene, pixelX, pixelY)) {
        return true;
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
    const mapWidth = scene.mapData.width || 800;
    const mapHeight = scene.mapData.height || 600;
    
    return (
        pixelX < 0 || 
        pixelY < 0 || 
        pixelX >= mapWidth || 
        pixelY >= mapHeight
    );
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
