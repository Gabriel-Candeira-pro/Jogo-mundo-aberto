// Funções para manipulação de posições e chunks
const { hashStringToUint32 } = require('./utils/random');
const { clamp } = require('./utils/math');

const DEFAULT_CHUNK_CONFIG = {
    tilesX: 25,
    tilesY: 15,
    tileSize: 32,
    minObstacles: 3,
    maxObstacles: 12,
    maxObstaclePlacementAttempts: 60,
    maxLakes: 2
};

function createChunkSeed(worldSeed, chunkX, chunkY) {
    return hashStringToUint32(`${worldSeed}:${chunkX}:${chunkY}`);
}

function getChunkWorldOrigin(chunkX, chunkY, chunkConfig = {}) {
    const config = { ...DEFAULT_CHUNK_CONFIG, ...chunkConfig };
    return {
        x: chunkX * config.tilesX * config.tileSize,
        y: chunkY * config.tilesY * config.tileSize
    };
}

function toWorldPosition(chunkX, chunkY, localX, localY, chunkConfig = {}) {
    const origin = getChunkWorldOrigin(chunkX, chunkY, chunkConfig);
    return {
        x: origin.x + localX,
        y: origin.y + localY
    };
}

function toLocalPosition(worldX, worldY, chunkConfig = {}) {
    const config = { ...DEFAULT_CHUNK_CONFIG, ...chunkConfig };
    const chunkWidth = config.tilesX * config.tileSize;
    const chunkHeight = config.tilesY * config.tileSize;
    const chunkX = Math.floor(worldX / chunkWidth);
    const chunkY = Math.floor(worldY / chunkHeight);
    const localX = worldX - chunkX * chunkWidth;
    const localY = worldY - chunkY * chunkHeight;
    return {
        chunkX,
        chunkY,
        localX,
        localY
    };
}

module.exports = {
    DEFAULT_CHUNK_CONFIG,
    createChunkSeed,
    getChunkWorldOrigin,
    toWorldPosition,
    toLocalPosition
};
