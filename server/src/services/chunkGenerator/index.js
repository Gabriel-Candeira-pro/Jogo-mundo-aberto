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
    let biome = pickBiome(random);
    // Segurança: garanta que o biome retornado é válido e pertence à lista BIOMES
    if (!biome || !biome.id || !BIOMES.find(b => b.id === biome.id)) {
        // Fallback determinístico para o primeiro bioma definido
        biome = BIOMES[0];
    }
    // Execute a lógica específica do bioma para gerar dados contextuais
    const biomeGenerated = (typeof biome.generate === 'function')
        ? biome.generate(random, { config, width: config.tilesX * config.tileSize, height: config.tilesY * config.tileSize })
        : {};
    // Mescla propriedades estáticas do bioma com os dados gerados dinamicamente
    const biomeContext = { ...biome, ...biomeGenerated };
    // Obstáculos: agora são gerados pelo próprio bioma (se fornecer `obstacles` em `biome.generate`).
    // Mantemos compatibilidade: se o bioma não fornecer obstáculos, não geramos globalmente.
    const obstacles = Array.isArray(biomeContext.obstacles) ? biomeContext.obstacles : [];
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
