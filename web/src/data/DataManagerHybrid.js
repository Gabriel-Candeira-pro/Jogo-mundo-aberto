import { HybridDataManagerCore } from './managerHybrid/core/HybridDataManagerCore.js';
import { attachInitializationMethods } from './managerHybrid/modules/initialization.js';
import { attachMultiplayerMethods } from './managerHybrid/modules/multiplayer.js';
import { attachUserMethods } from './managerHybrid/modules/user.js';
import { attachCharacterMethods } from './managerHybrid/modules/character.js';
import { attachMapMethods } from './managerHybrid/modules/map.js';
import { attachSessionMethods } from './managerHybrid/modules/session.js';
import { attachUtilityMethods } from './managerHybrid/modules/utility.js';

/**
 * Gerenciador de Dados Multiplayer
 * MODO MULTIPLAYER ONLINE OBRIGATÓRIO - Todos os jogadores compartilham o mesmo mapa
 */
export class HybridDataManager extends HybridDataManagerCore {}

attachInitializationMethods(HybridDataManager);
attachMultiplayerMethods(HybridDataManager);
attachUserMethods(HybridDataManager);
attachCharacterMethods(HybridDataManager);
attachMapMethods(HybridDataManager);
attachSessionMethods(HybridDataManager);
attachUtilityMethods(HybridDataManager);

// Exporta instância singleton
export const dataManager = new HybridDataManager();
