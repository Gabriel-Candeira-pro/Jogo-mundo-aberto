/**
 * Sistema de colisões do mapa
 */
export function attachCollisionMethods(GameSceneClass) {
    GameSceneClass.prototype.setupMapCollisions = function setupMapCollisions() {
        this.setupBuildingCollisions();
        this.setupObstacleCollisions();
        this.setupWaterCollisions();
    };

    GameSceneClass.prototype.setupBuildingCollisions = function setupBuildingCollisions() {
        if (this.mapData.buildings && this.mapData.buildings.length > 0) {
            this.buildings = this.physics.add.staticGroup();
            this.mapData.buildings.forEach(building => {
                if (building.collision) {
                    this.buildings.create(building.x + building.width / 2, building.y + building.height / 2)
                        .setDisplaySize(building.width, building.height)
                        .setName(building.id);
                }
            });
            this.physics.add.collider(this.player, this.buildings);
        }
    };

    GameSceneClass.prototype.setupObstacleCollisions = function setupObstacleCollisions() {
        if (this.mapData.obstacles && this.mapData.obstacles.length > 0) {
            this.obstacles = this.physics.add.staticGroup();
            this.mapData.obstacles.forEach(obstacle => {
                if (obstacle.collision) {
                    this.obstacles.create(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2)
                        .setDisplaySize(obstacle.width, obstacle.height)
                        .setName(obstacle.id);
                }
            });
            this.physics.add.collider(this.player, this.obstacles);
        }
    };

    GameSceneClass.prototype.setupWaterCollisions = function setupWaterCollisions() {
        if (this.mapData.water && this.mapData.water.length > 0) {
            this.waterZones = this.physics.add.staticGroup();
            this.mapData.water.forEach(water => {
                if (water.collision) {
                    this.waterZones.create(water.x + water.width / 2, water.y + water.height / 2)
                        .setDisplaySize(water.width, water.height)
                        .setName(water.id);
                }
            });
            this.physics.add.collider(this.player, this.waterZones);
        }
    };
}
