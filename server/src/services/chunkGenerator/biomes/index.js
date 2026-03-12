const plains = require('./plains');
const forest = require('./forest');
const desert = require('./desert');
const tundra = require('./tundra');

const BIOMES = [plains, forest, desert, tundra];

function pickBiome(random) {
    const index = Math.floor(random() * BIOMES.length);
    return BIOMES[index];
}

module.exports = {
    BIOMES,
    pickBiome
};
