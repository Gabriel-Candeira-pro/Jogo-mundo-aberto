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
        
        // Checar colisão
        if (checkTileCollision(this, nextTileX, nextTileY)) {
            // Evita "travar" em uma direcao bloqueada: consome a tecla
            // para que o proximo frame possa ler novo input/direcao.
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

    // Manter retrocompatibilidade com código existente
    GameSceneClass.prototype._tileHasCollision = function _tileHasCollision(tileX, tileY) {
        return checkTileCollision(this, tileX, tileY);
    };
}
