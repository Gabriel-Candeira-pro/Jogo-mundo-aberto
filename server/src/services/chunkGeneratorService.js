// Módulo refatorado: delega para chunkGenerator
const chunkGenerator = require('./chunkGenerator');

module.exports = {
    GENERATOR_VERSION: chunkGenerator.GENERATOR_VERSION,
    DEFAULT_CHUNK_CONFIG: require('./chunkGenerator/chunkUtils').DEFAULT_CHUNK_CONFIG,
    BIOMES: require('./chunkGenerator/biomes').BIOMES,
    createChunkSeed: require('./chunkGenerator/chunkUtils').createChunkSeed,
    generateChunk: chunkGenerator.generateChunk,
    getChunkWorldOrigin: require('./chunkGenerator/chunkUtils').getChunkWorldOrigin,
    toWorldPosition: require('./chunkGenerator/chunkUtils').toWorldPosition,
    toLocalPosition: require('./chunkGenerator/chunkUtils').toLocalPosition
};