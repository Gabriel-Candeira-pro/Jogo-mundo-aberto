// Funções para obstáculos e água
const { randomInt } = require('./utils/math');

function rectanglesOverlap(a, b) {
    const separatedHorizontally = a.x + a.width <= b.x || b.x + b.width <= a.x;
    const separatedVertically = a.y + a.height <= b.y || b.y + b.height <= a.y;
    return !(separatedHorizontally || separatedVertically);
}

function createObstacle(random, config, biome, index, existingObstacles) {
    const minTiles = 1;
    const maxTiles = 3;
    const widthTiles = randomInt(random, minTiles, maxTiles);
    const heightTiles = randomInt(random, minTiles, maxTiles);
    const width = widthTiles * config.tileSize;
    const height = heightTiles * config.tileSize;
    const maxX = config.tilesX * config.tileSize - width;
    const maxY = config.tilesY * config.tileSize - height;
    for (let attempt = 0; attempt < config.maxObstaclePlacementAttempts; attempt += 1) {
        const obstacle = {
            id: `obs_${index}_${attempt}`,
            x: randomInt(random, 0, Math.max(0, maxX)),
            y: randomInt(random, 0, Math.max(0, maxY)),
            width,
            height,
            type: biome.obstacleTypes[randomInt(random, 0, biome.obstacleTypes.length - 1)],
            collision: true
        };
        const hasCollision = existingObstacles.some(existing => rectanglesOverlap(existing, obstacle));
        if (!hasCollision) {
            return obstacle;
        }
    }
    return null;
}

function createWaterAreas(random, config) {
    const waterAreas = [];
    const lakesCount = randomInt(random, 0, config.maxLakes);
    for (let i = 0; i < lakesCount; i += 1) {
        const width = randomInt(random, 2, 5) * config.tileSize;
        const height = randomInt(random, 2, 4) * config.tileSize;
        const maxX = config.tilesX * config.tileSize - width;
        const maxY = config.tilesY * config.tileSize - height;
        waterAreas.push({
            id: `water_${i}`,
            x: randomInt(random, 0, Math.max(0, maxX)),
            y: randomInt(random, 0, Math.max(0, maxY)),
            width,
            height,
            type: 'water',
            walkable: false
        });
    }
    return waterAreas;
}

module.exports = {
    rectanglesOverlap,
    createObstacle,
    createWaterAreas
};
