// Bioma: forest
module.exports = {
    id: 'forest',
    skyColor: '#78B0E4',
    terrainType: 'forest_floor',
    terrainColor: '#3D7A39',
    obstacleTypes: ['tree', 'big_tree', 'rock'],
    generate(random, options = {}) {
        const width = options.width || 100;
        const height = options.height || 100;
        const count = Math.floor(random() * 6) + 1; // denser
        const obstacles = [];
        for (let i = 0; i < count; i++) {
            const r = random();
            const type = r < 0.2 ? 'big_tree' : (r < 0.8 ? 'tree' : 'rock');
            obstacles.push({ type, x: Math.floor(random() * width), y: Math.floor(random() * height) });
        }
        return { terrain: this.terrainType, obstacles };
    }
};
