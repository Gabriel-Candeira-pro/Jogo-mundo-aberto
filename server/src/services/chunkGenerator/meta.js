// Função para construir metadados do chunk
const { clamp } = require('./utils/math');

function buildChunkMeta({ worldSeed, chunkX, chunkY, config, biome, generatorVersion }) {
    const width = config.tilesX * config.tileSize;
    const height = config.tilesY * config.tileSize;
    const timestamp = new Date(0).toISOString();
    return {
        id: `chunk_${chunkX}_${chunkY}`,
        name: `Chunk ${chunkX},${chunkY}`,
        level: 1,
        difficulty: clamp(Math.abs(chunkX) + Math.abs(chunkY), 1, 100),
        width,
        height,
        gameType: 'topdown',
        playerSpawn: {
            x: Math.floor(width / 2),
            y: Math.floor(height / 2)
        },
        terrain: {
            type: biome.terrainType,
            textColor: biome.terrainColor
        },
        skyColor: biome.skyColor,
        completions: 0,
        bestTime: 0,
        highScore: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
        worldSeed,
        generatorVersion,
        chunkX,
        chunkY,
        tilesX: config.tilesX,
        tilesY: config.tilesY,
        tileSize: config.tileSize,
        biome: biome.id
    };
}

module.exports = {
    buildChunkMeta
};
