/**
 * Módulo de configuração do jogador.
 *
 * Responsável por:
 *  - Criar o sprite do jogador na posição de spawn definida pelo mapa
 *  - Renderizar os elementos visuais do mapa (água, estradas, obstáculos,
 *    edifícios, colecionáveis e NPCs)
 *  - Registrar colisores de física entre o jogador e os objetos do mapa
 *    (edifícios, obstáculos e zonas de água)
 */

/**
 * Cria o sprite do jogador, desativa a gravidade para o modo top-down e
 * configura as colisões com os objetos do mapa.
 *
 * @param {Phaser.Scene} scene - A cena do jogo que contém o contexto completo.
 */
export function setupPlayer(scene) {
    renderMap(scene);

    const spawn = scene.mapData.playerSpawn;
    console.log('🎮 Criando jogador em:', spawn);

    scene.player = scene.physics.add.sprite(spawn.x, spawn.y, 'player');
    scene.player.setBounce(0);
    scene.player.setCollideWorldBounds(true);

    // Desativa gravidade para jogo top-down
    scene.physics.world.gravity.y = 0;
    scene.physics.world.gravity.x = 0;

    // Aplica cor do personagem
    scene.player.setTint(scene.character.color);

    // Desenha um círculo debug ao redor do jogador
    const debugCircle = scene.add.circle(spawn.x, spawn.y, 20, 0x00FF00);
    debugCircle.setDepth(50);
    debugCircle.setStrokeStyle(2, 0x00FF00);

    setupMapCollisions(scene);
}

/**
 * Renderiza todos os elementos visuais do mapa: água, estradas, obstáculos,
 * edifícios (com label), colecionáveis e NPCs.
 *
 * @param {Phaser.Scene} scene - A cena do jogo que contém os dados do mapa.
 */
export function renderMap(scene) {
    scene.cameras.main.setBackgroundColor(scene.mapData.skyColor || '#87CEEB');

    console.log('🎨 Renderizando mapa com', scene.mapData.buildings?.length || 0, 'edifícios');

    // Renderiza água
    if (scene.mapData.water && scene.mapData.water.length > 0) {
        scene.mapData.water.forEach(water => {
            const centerX = water.x + water.width / 2;
            const centerY = water.y + water.height / 2;
            const rect = scene.add.rectangle(centerX, centerY, water.width, water.height, 0x4A90E2);
            rect.setDepth(1);
            rect.setStrokeStyle(1, 0x0066CC);
        });
    }

    // Renderiza estradas
    if (scene.mapData.roads && scene.mapData.roads.length > 0) {
        scene.mapData.roads.forEach(road => {
            const centerX = road.x + road.width / 2;
            const centerY = road.y + road.height / 2;
            const rect = scene.add.rectangle(centerX, centerY, road.width, road.height, 0xD2B48C);
            rect.setDepth(2);
            rect.setStrokeStyle(2, 0x8B7355);
        });
    }

    // Renderiza obstáculos (árvores, rochas)
    if (scene.mapData.obstacles && scene.mapData.obstacles.length > 0) {
        scene.mapData.obstacles.forEach(obstacle => {
            const color = obstacle.type === 'tree' ? 0x228B22 : 0x808080;
            const centerX = obstacle.x + obstacle.width / 2;
            const centerY = obstacle.y + obstacle.height / 2;
            const rect = scene.add.rectangle(centerX, centerY, obstacle.width, obstacle.height, color);
            rect.setDepth(3);
        });
    }

    // Renderiza edifícios
    if (scene.mapData.buildings && scene.mapData.buildings.length > 0) {
        scene.mapData.buildings.forEach(building => {
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
            const rect = scene.add.rectangle(centerX, centerY, building.width, building.height, color);
            rect.setDepth(3);
            rect.setStrokeStyle(2, 0x000000);

            const text = scene.add.text(centerX, centerY, building.name.substring(0, 10), {
                fontSize: '10px',
                fill: '#FFF',
                backgroundColor: '#000000',
                padding: { x: 2, y: 2 }
            }).setOrigin(0.5);
            text.setDepth(4);
        });
    }

    // Renderiza itens colecionáveis
    if (scene.mapData.collectibles && scene.mapData.collectibles.length > 0) {
        scene.mapData.collectibles.forEach(item => {
            const color = item.type === 'coin' ? 0xFFD700 : 0xFF69B4;
            const circle = scene.add.circle(item.x, item.y, 8, color);
            circle.setDepth(3);
            circle.setStrokeStyle(1, 0x000000);
        });
    }

    // Renderiza NPCs
    if (scene.mapData.npcs && scene.mapData.npcs.length > 0) {
        scene.mapData.npcs.forEach(npc => {
            const circle = scene.add.circle(npc.x, npc.y, 10, 0xFF00FF);
            circle.setDepth(3);
            circle.setStrokeStyle(1, 0xFF00FF);
            const text = scene.add.text(npc.x, npc.y - 20, npc.name, {
                fontSize: '10px',
                fill: '#FF00FF',
                backgroundColor: '#000000',
                padding: { x: 2, y: 2 }
            }).setOrigin(0.5);
            text.setDepth(4);
        });
    }

    console.log('✅ Mapa renderizado');
}

/**
 * Cria os corpos estáticos de colisão para edifícios, obstáculos e zonas de
 * água presentes no mapa e os registra como colisores contra o jogador.
 *
 * @param {Phaser.Scene} scene - A cena do jogo que contém o jogador e o mapa.
 */
export function setupMapCollisions(scene) {
    // Cria objetos de colisão para os edifícios
    if (scene.mapData.buildings && scene.mapData.buildings.length > 0) {
        scene.buildings = scene.physics.add.staticGroup();
        scene.mapData.buildings.forEach(building => {
            if (building.collision) {
                scene.buildings.create(building.x + building.width/2, building.y + building.height/2)
                    .setDisplaySize(building.width, building.height)
                    .setName(building.id);
            }
        });
        scene.physics.add.collider(scene.player, scene.buildings);
    }

    // Cria colisores com obstáculos
    if (scene.mapData.obstacles && scene.mapData.obstacles.length > 0) {
        scene.obstacles = scene.physics.add.staticGroup();
        scene.mapData.obstacles.forEach(obstacle => {
            if (obstacle.collision) {
                scene.obstacles.create(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2)
                    .setDisplaySize(obstacle.width, obstacle.height)
                    .setName(obstacle.id);
            }
        });
        scene.physics.add.collider(scene.player, scene.obstacles);
    }

    // Cria colisores com água
    if (scene.mapData.water && scene.mapData.water.length > 0) {
        scene.waterZones = scene.physics.add.staticGroup();
        scene.mapData.water.forEach(water => {
            if (water.collision) {
                scene.waterZones.create(water.x + water.width/2, water.y + water.height/2)
                    .setDisplaySize(water.width, water.height)
                    .setName(water.id);
            }
        });
        scene.physics.add.collider(scene.player, scene.waterZones);
    }
}
