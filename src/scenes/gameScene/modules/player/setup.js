/**
 * Setup do sprite do jogador
 */
export function attachPlayerSetupMethods(GameSceneClass) {
    GameSceneClass.prototype.setupPlayer = function setupPlayer() {
        this.renderMap();

        const spawn = this.mapData.playerSpawn;
        console.log('🎮 Criando jogador em:', spawn);

        this.player = this.physics.add.sprite(spawn.x, spawn.y, 'player');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);

        this.physics.world.gravity.y = 0;
        this.physics.world.gravity.x = 0;

        this.player.setDrag(900, 900);
        this.player.setMaxVelocity(this.character.speed, this.character.speed);

        this.player.setTint(this.character.color);

        const debugCircle = this.add.circle(spawn.x, spawn.y, 20, 0x00FF00);
        debugCircle.setDepth(50);
        debugCircle.setStrokeStyle(2, 0x00FF00);

        this.setupMapCollisions();
    };
}
