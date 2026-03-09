// Definição dos biomas
const BIOMES = [
    {
        id: 'plains',
        skyColor: '#8ED6FF',
        terrainType: 'grass',
        terrainColor: '#4FA24A',
        obstacleTypes: ['tree', 'bush']
    },
    {
        id: 'forest',
        skyColor: '#78B0E4',
        terrainType: 'forest_floor',
        terrainColor: '#3D7A39',
        obstacleTypes: ['tree', 'big_tree', 'rock']
    },
    {
        id: 'desert',
        skyColor: '#BFE6FF',
        terrainType: 'sand',
        terrainColor: '#CFAE63',
        obstacleTypes: ['cactus', 'rock']
    },
    {
        id: 'tundra',
        skyColor: '#DCEEFF',
        terrainType: 'frozen_ground',
        terrainColor: '#A9B6C2',
        obstacleTypes: ['ice_rock', 'bare_tree']
    }
];

function pickBiome(random) {
    const index = Math.floor(random() * BIOMES.length);
    return BIOMES[index];
}

module.exports = {
    BIOMES,
    pickBiome
};
