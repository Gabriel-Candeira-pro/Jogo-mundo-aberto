// Bioma: plains
module.exports = {
    id: 'plains',
    skyColor: '#7db3f1',
    terrainType: 'grass',
    terrainColor: '#4FA24A',
    obstacleTypes: ['tree', 'bush'],
    generate(random, options = {}) {
        const config = options.config || {};
        const width = options.width || (config.tilesX && config.tileSize ? config.tilesX * config.tileSize : 100);
        const height = options.height || (config.tilesY && config.tileSize ? config.tilesY * config.tileSize : 100);
        const tileSize = (config.tileSize) || 16;
        const minTiles = 1;
        const maxTiles = 3;
        const count = Math.floor(random() * 4);
        const obstacles = [];
        for (let i = 0; i < count; i++) {
            const type = this.obstacleTypes[Math.floor(random() * this.obstacleTypes.length)];
            const widthTiles = Math.floor(random() * (maxTiles - minTiles + 1)) + minTiles;
            const heightTiles = Math.floor(random() * (maxTiles - minTiles + 1)) + minTiles;
            const w = widthTiles * tileSize;
            const h = heightTiles * tileSize;
            const maxX = Math.max(0, width - w);
            const maxY = Math.max(0, height - h);
            const x = Math.floor(random() * (maxX + 1));
            const y = Math.floor(random() * (maxY + 1));
            obstacles.push({ id: `plains_obs_${i}`, type, x, y, width: w, height: h, collision: true });
        }
        return { terrain: this.terrainType, obstacles };
    }
};
