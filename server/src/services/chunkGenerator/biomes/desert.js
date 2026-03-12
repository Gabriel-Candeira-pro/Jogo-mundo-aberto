// Bioma: desert
module.exports = {
    id: 'desert',
    skyColor: '#BFE6FF',
    terrainType: 'sand',
    terrainColor: '#CFAE63',
    obstacleTypes: ['cactus', 'rock'],
    generate(random, options = {}) {
        const width = options.width || 100;
        const height = options.height || 100;
        const count = Math.floor(random() * 3); // sparse
        const obstacles = [];
        for (let i = 0; i < count; i++) {
            const type = this.obstacleTypes[Math.floor(random() * this.obstacleTypes.length)];
            obstacles.push({ type, x: Math.floor(random() * width), y: Math.floor(random() * height) });
        }
        // desert may have dunes: return a simple height modifier
        const dunes = Math.floor(random() * 3);
        return { terrain: this.terrainType, dunes, obstacles };
    }
};
