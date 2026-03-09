import { DataManagerCore } from './manager/core/DataManagerCore.js';
import { attachUserMethods } from './manager/modules/user.js';
import { attachCharacterMethods } from './manager/modules/character.js';
import { attachMapMethods } from './manager/modules/map.js';
import { attachSessionMethods } from './manager/modules/session.js';
import { attachUtilityMethods } from './manager/modules/utility.js';

/**
 * Gerenciador de Dados
 * Gerencia o armazenamento e recuperação de dados usando localStorage
 */
export class DataManager extends DataManagerCore {}

attachUserMethods(DataManager);
attachCharacterMethods(DataManager);
attachMapMethods(DataManager);
attachSessionMethods(DataManager);
attachUtilityMethods(DataManager);

// Exporta instância singleton
export const dataManager = new DataManager();
