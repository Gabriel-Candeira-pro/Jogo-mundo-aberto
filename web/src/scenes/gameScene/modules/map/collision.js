/**
 * Sistema de colisões do mapa
 */
export function attachCollisionMethods(GameSceneClass) {
    GameSceneClass.prototype.createStaticCollider = function createStaticCollider(group, entity) {
        const collider = group.create(
            entity.x + entity.width / 2,
            entity.y + entity.height / 2
        )
            .setDisplaySize(entity.width, entity.height)
            .setName(entity.id);

        // Em corpos estaticos, e necessario recalcular o body apos resize.
        if (typeof collider.refreshBody === 'function') {
            collider.refreshBody();
        }

        return collider;
    };

    GameSceneClass.prototype.setupMapCollisions = function setupMapCollisions() {
        this.setupBuildingCollisions();
        this.setupObstacleCollisions();
        this.setupWaterCollisions();
    };

    GameSceneClass.prototype.setupBuildingCollisions = function setupBuildingCollisions() {
        if (this.mapData.buildings && this.mapData.buildings.length > 0) {
            this.buildings = this.physics.add.staticGroup();
            let collidableCount = 0;
            this.mapData.buildings.forEach(building => {
                if (building.collision) {
                    this.createStaticCollider(this.buildings, building);
                    collidableCount += 1;
                }
            });
            this.physics.add.collider(this.player, this.buildings);
            console.info('[CollisionDebug] Predios com colisao:', collidableCount);
        }
    };

    GameSceneClass.prototype.setupObstacleCollisions = function setupObstacleCollisions() {
        if (this.mapData.obstacles && this.mapData.obstacles.length > 0) {
            this.obstacles = this.physics.add.staticGroup();
            let collidableCount = 0;
            this.mapData.obstacles.forEach(obstacle => {
                if (obstacle.collision) {
                    this.createStaticCollider(this.obstacles, obstacle);
                    collidableCount += 1;
                }
            });
            this.physics.add.collider(this.player, this.obstacles);
            console.info('[CollisionDebug] Obstaculos com colisao:', collidableCount);
        }
    };

    GameSceneClass.prototype.setupWaterCollisions = function setupWaterCollisions() {
        if (this.mapData.water && this.mapData.water.length > 0) {
            this.waterZones = this.physics.add.staticGroup();
            let collidableCount = 0;
            this.mapData.water.forEach(water => {
                if (water.collision) {
                    this.createStaticCollider(this.waterZones, water);
                    collidableCount += 1;
                }
            });
            this.physics.add.collider(this.player, this.waterZones);
            console.info('[CollisionDebug] Areas de agua com colisao:', collidableCount);
        }
    };
}
