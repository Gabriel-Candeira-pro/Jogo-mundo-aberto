// Função principal de geração de chunk
const { DEFAULT_CHUNK_CONFIG, createChunkSeed } = require('./chunkUtils');
const { mulberry32 } = require('./utils/random');
const { randomInt } = require('./utils/math');
const { BIOMES, pickBiome } = require('./biomes');
const { createObstacle, createWaterAreas } = require('./obstacles');
const { buildChunkMeta } = require('./meta');

const GENERATOR_VERSION = 1;

function generateChunk(worldSeed, chunkX, chunkY, chunkConfig = {}) {
    const config = { ...DEFAULT_CHUNK_CONFIG, ...chunkConfig };
    const seed = createChunkSeed(worldSeed, chunkX, chunkY);
    const random = mulberry32(seed);
    const biome = pickBiome(random);
    const obstacles = [];
    const obstacleCount = randomInt(random, config.minObstacles, config.maxObstacles);
    for (let i = 0; i < obstacleCount; i += 1) {
        const obstacle = createObstacle(random, config, biome, i, obstacles);
        if (obstacle) {
            obstacles.push(obstacle);
        }
    }
    const water = createWaterAreas(random, config);
    const meta = buildChunkMeta({ worldSeed, chunkX, chunkY, config, biome, generatorVersion: GENERATOR_VERSION });
    return {
        ...meta,
        buildings: [],
        roads: [],
        obstacles,
        water,
        npcs: [],
        collectibles: []
    };
}

module.exports = {
    GENERATOR_VERSION,
    generateChunk
};
