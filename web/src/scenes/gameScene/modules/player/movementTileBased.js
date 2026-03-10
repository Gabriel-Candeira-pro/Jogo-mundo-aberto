import { apiClient } from '../../../../data/APIClient.js';
/**
 * Sistema de movimento baseado em tiles (estilo Fire Red/Pokémon) - Orquestrador
 * Responsabilidade: Coordenar os diferentes módulos de movimento tile-based
 */
import {
    initTileMovementState,
    alignPlayerToTile,
    disablePhysics,
    updateMovementProgress,
    completeMovement,
    startMovement
} from './tile-movement/tileMovementState.js';

import { interpolatePosition } from './tile-movement/tileAnimation.js';
import { getNextTileFromInput, consumeKeyPress } from './tile-movement/tileInput.js';
import { checkTileCollision } from './tile-movement/tileCollision.js';

export function attachTileBasedMovementMethods(GameSceneClass) {
    GameSceneClass.prototype.initTileBasedMovement = function initTileBasedMovement() {
        // Inicializar estado
        initTileMovementState(this, this.mapData);
        
        // Alinhar sprite ao tile inicial
        alignPlayerToTile(this.player, this.tileMovement);
        
        // Desabilitar physics para evitar conflitos
        disablePhysics(this.player);
    };

    GameSceneClass.prototype.handleTileBasedMovement = function handleTileBasedMovement() {
        const tm = this.tileMovement;
        
        // Se está em movimento, animar transição
        if (tm.isMoving) {
            const { progress } = updateMovementProgress(this);
            
            // Interpolar posição
            interpolatePosition(this.player, tm, progress);
            
            // Se completou
            if (progress === 1) {
                completeMovement(this);
            }
            return;
        }
        
        // Se NÃO está movendo, processar input
        const { nextTileX, nextTileY, direction, keyToConsume } = getNextTileFromInput(
            this,
            tm.currentTileX,
            tm.currentTileY
        );
        
        // Se nenhuma direção, não fazer nada
        if (!direction) return;
        
        // Checar colisão ou transição de chunk
        const collisionResult = checkTileCollision(this, nextTileX, nextTileY);
        if (typeof collisionResult === 'string') {
            // Direção de saída: transição de chunk
                this.handleChunkTransition(collisionResult);
            consumeKeyPress(keyToConsume);
            return;
        } else if (collisionResult === true) {
            // Colisão normal
            consumeKeyPress(keyToConsume);
            if (tm.debug) {
                console.log('[TileMovement] Movimento bloqueado por colisão', { direction, nextTileX, nextTileY });
            }
            return;
        }
        
        // Consumir tecla para evitar leitura repetida
        consumeKeyPress(keyToConsume);
        
        // Iniciar movimento
        startMovement(this, nextTileX, nextTileY, direction);
    };

    // Lógica de transição de chunk
    GameSceneClass.prototype.chunkCache = {};
    GameSceneClass.prototype.handleChunkTransition = function handleChunkTransition(direction) {
        const tm = this.tileMovement;
        // Atualiza coordenadas globais de chunk
        if (!tm.chunkX) tm.chunkX = 0;
        if (!tm.chunkY) tm.chunkY = 0;
        const chunkWidth = this.mapData.width || 800;
        const chunkHeight = this.mapData.height || 600;
        let newChunkX = tm.chunkX;
        let newChunkY = tm.chunkY;
        let newTileX = tm.currentTileX;
        let newTileY = tm.currentTileY;
        if (direction === 'left') {
            newChunkX -= 1;
            newTileX = Math.floor(chunkWidth / tm.TILE_SIZE) - 1;
        } else if (direction === 'right') {
            newChunkX += 1;
            newTileX = 0;
        } else if (direction === 'up') {
            newChunkY -= 1;
            newTileY = Math.floor(chunkHeight / tm.TILE_SIZE) - 1;
        } else if (direction === 'down') {
            newChunkY += 1;
            newTileY = 0;
        }
        tm.chunkX = newChunkX;
        tm.chunkY = newChunkY;
        tm.currentTileX = newTileX;
        tm.currentTileY = newTileY;
        // Carrega chunk e atualiza cache
        this.loadChunkAndCache(newChunkX, newChunkY);
        // Reposiciona player
        alignPlayerToTile(this.player, tm);
        if (tm.debug) {
            console.log('[ChunkTransition] Transição para chunk', { chunkX: newChunkX, chunkY: newChunkY, tileX: newTileX, tileY: newTileY });
        }
    };

    // Carrega chunk e mantém cache 3x3
    GameSceneClass.prototype.loadChunkAndCache = function loadChunkAndCache(chunkX, chunkY) {
        // Mantém cache 3x3 ao redor do player
        const cache = {};
        // ...existing code...
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const cx = chunkX + dx;
                const cy = chunkY + dy;
                const key = `${cx}:${cy}`;
                if (!this.chunkCache[key]) {
                    // Carrega chunk procedural do backend
                    // Assíncrono: salva placeholder, depois atualiza
                    this.chunkCache[key] = { chunkX: cx, chunkY: cy, loading: true };
                    apiClient.request(`/api/map/chunk?x=${cx}&y=${cy}`)
                        .then(resp => {
                            if (resp && resp.chunk) {
                                this.chunkCache[key] = { ...resp.chunk, chunkX: cx, chunkY: cy, loading: false };
                                if (cx === chunkX && cy === chunkY) {
                                    // Atualiza o mapa central e renderiza
                                    this.mapData = resp.chunk;
                                    this.renderMap();
                                }
                                if (this.tileMovement.debug) {
                                    console.log(`[ChunkCache] Chunk carregado: ${key}`);
                                }
                            }
                        })
                        .catch(err => {
                            this.chunkCache[key] = { chunkX: cx, chunkY: cy, error: true };
                            if (this.tileMovement.debug) {
                                console.error(`[ChunkCache] Erro ao carregar chunk: ${key}`, err);
                            }
                        });
                }
                cache[key] = this.chunkCache[key];
            }
        }
        // Remove chunks fora do raio 1
        this.chunkCache = cache;
        if (this.tileMovement.debug) {
            console.log('[ChunkCache] Cache atualizado', Object.keys(this.chunkCache));
        }
    };

    // Manter retrocompatibilidade com código existente
    GameSceneClass.prototype._tileHasCollision = function _tileHasCollision(tileX, tileY) {
        return checkTileCollision(this, tileX, tileY);
    };
}
