// Bioma: tundra
module.exports = {
    id: 'tundra',
    skyColor: '#DCEEFF',
    terrainType: 'frozen_ground',
    terrainColor: '#A9B6C2',
    obstacleTypes: ['ice_rock', 'bare_tree'],
    generate(random, options = {}) {
        const width = options.width || 100;
        const height = options.height || 100;
        const count = Math.floor(random() * 2); // very sparse
        const obstacles = [];
        for (let i = 0; i < count; i++) {
            const type = this.obstacleTypes[Math.floor(random() * this.obstacleTypes.length)];
            obstacles.push({ type, x: Math.floor(random() * width), y: Math.floor(random() * height) });
        }
        const icePatches = Math.floor(random() * 2);
        return { terrain: this.terrainType, icePatches, obstacles };
    }
};
