/**
 * Renderização do mapa
 */
export function attachMapRenderMethods(GameSceneClass) {
    GameSceneClass.prototype.renderMap = function renderMap() {
        this.cameras.main.setBackgroundColor(this.mapData.skyColor || '#87CEEB');

        console.log('🎨 Renderizando mapa com', this.mapData.buildings?.length || 0, 'edifícios');

        this.renderWater();
        this.renderRoads();
        this.renderObstacles();
        this.renderBuildings();
        this.renderCollectibles();
        this.renderNPCs();

        console.log('✅ Mapa renderizado');
    };

    GameSceneClass.prototype.renderWater = function renderWater() {
        if (this.mapData.water && this.mapData.water.length > 0) {
            this.mapData.water.forEach(water => {
                const centerX = water.x + water.width / 2;
                const centerY = water.y + water.height / 2;
                const rect = this.add.rectangle(centerX, centerY, water.width, water.height, 0x4A90E2);
                rect.setDepth(1);
                rect.setStrokeStyle(1, 0x0066CC);
            });
        }
    };

    GameSceneClass.prototype.renderRoads = function renderRoads() {
        if (this.mapData.roads && this.mapData.roads.length > 0) {
            this.mapData.roads.forEach(road => {
                const centerX = road.x + road.width / 2;
                const centerY = road.y + road.height / 2;
                const rect = this.add.rectangle(centerX, centerY, road.width, road.height, 0xD2B48C);
                rect.setDepth(2);
                rect.setStrokeStyle(2, 0x8B7355);
            });
        }
    };

    GameSceneClass.prototype.renderObstacles = function renderObstacles() {
        const obs = this.mapData.obstacles || [];
        console.log('[Render] Obstáculos encontrados:', obs.length);
        if (obs.length > 0) {
            obs.forEach(obstacle => {
                const typeColorMap = {
                    tree: 0x228B22,
                    bush: 0x2E8B57,
                    big_tree: 0x006400,
                    rock: 0x808080,
                    cactus: 0x9ACD32,
                    ice_rock: 0xB0E0E6,
                    bare_tree: 0x8B4513
                };
                const color = typeColorMap[obstacle.type] || 0xAAAAAA;
                const centerX = obstacle.x + obstacle.width / 2;
                const centerY = obstacle.y + obstacle.height / 2;
                const rect = this.add.rectangle(centerX, centerY, Math.max(2, obstacle.width), Math.max(2, obstacle.height), color);
                rect.setDepth(3);
                // desenhar contorno para maior visibilidade
                rect.setStrokeStyle(1, 0x000000);
            });
        }
    };

    GameSceneClass.prototype.renderBuildings = function renderBuildings() {
        if (this.mapData.buildings && this.mapData.buildings.length > 0) {
            this.mapData.buildings.forEach(building => {
                const colors = {
                    house: 0xA0522D,
                    tower: 0x696969,
                    church: 0x8B4513,
                    mill: 0xCD853F,
                    market: 0xDAA520,
                    farm: 0x6B8E23,
                    decoration: 0xFF6347
                };
                const color = colors[building.type] || 0xA0522D;
                const centerX = building.x + building.width / 2;
                const centerY = building.y + building.height / 2;
                const rect = this.add.rectangle(centerX, centerY, building.width, building.height, color);
                rect.setDepth(3);
                rect.setStrokeStyle(2, 0x000000);

                const text = this.add.text(centerX, centerY, building.name.substring(0, 10), {
                    fontSize: '10px',
                    fill: '#FFF',
                    backgroundColor: '#000000',
                    padding: { x: 2, y: 2 }
                }).setOrigin(0.5);
                text.setDepth(4);
            });
        }
    };

    GameSceneClass.prototype.renderCollectibles = function renderCollectibles() {
        if (this.mapData.collectibles && this.mapData.collectibles.length > 0) {
            this.mapData.collectibles.forEach(item => {
                const color = item.type === 'coin' ? 0xFFD700 : 0xFF69B4;
                const circle = this.add.circle(item.x, item.y, 8, color);
                circle.setDepth(3);
                circle.setStrokeStyle(1, 0x000000);
            });
        }
    };

    GameSceneClass.prototype.renderNPCs = function renderNPCs() {
        if (this.mapData.npcs && this.mapData.npcs.length > 0) {
            this.mapData.npcs.forEach(npc => {
                const circle = this.add.circle(npc.x, npc.y, 10, 0xFF00FF);
                circle.setDepth(3);
                circle.setStrokeStyle(1, 0xFF00FF);
                const text = this.add.text(npc.x, npc.y - 20, npc.name, {
                    fontSize: '10px',
                    fill: '#FF00FF',
                    backgroundColor: '#000000',
                    padding: { x: 2, y: 2 }
                }).setOrigin(0.5);
                text.setDepth(4);
            });
        }
    };
}
