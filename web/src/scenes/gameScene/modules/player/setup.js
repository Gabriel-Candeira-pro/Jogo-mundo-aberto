/**
 * Setup do sprite do jogador - Orquestrador
 * Responsabilidade: Coordenar a inicialização do jogador
 */
import { createPlayerSprite } from './setup/playerSprite.js';
import {
    setupPhysicsWorld,
    setupPlayerPhysics,
    setupPlayerHitbox
} from './setup/playerPhysics.js';
import {
    createDebugCircle,
    setupDebugCircleSync
} from './setup/playerDebug.js';

export function attachPlayerSetupMethods(GameSceneClass) {
    GameSceneClass.prototype.setupPlayer = function setupPlayer() {
        // Renderizar mapa primeiro
        this.renderMap();
        
        const spawn = this.mapData.playerSpawn;
        
        // Criar sprite do jogador
        this.player = createPlayerSprite(this, spawn, this.character);
        
        // Configurar física do mundo e do jogador
        setupPhysicsWorld(this);
        setupPlayerPhysics(this.player, this.character.speed);
        setupPlayerHitbox(this.player);
        
        // Debug visual
        const debugCircle = createDebugCircle(this, spawn);
        this.syncDebugCircle = setupDebugCircleSync(this, this.player, debugCircle);
        
        // Inicializar sistema de movimento baseado em tiles
        this.initTileBasedMovement();
        
        // Configurar colisões do mapa
        this.setupMapCollisions();
    };
}
