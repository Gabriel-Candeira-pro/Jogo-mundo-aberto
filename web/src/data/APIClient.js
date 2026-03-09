/**
 * Cliente API para comunicação com o servidor
 */

import { APIClientCore } from './api/core/APIClientCore.js';
import { attachAuthMethods } from './api/modules/auth.js';
import { attachCharacterMethods } from './api/modules/character.js';
import { attachUserMethods } from './api/modules/user.js';
import { attachMapMethods } from './api/modules/map.js';
import { attachSessionMethods } from './api/modules/session.js';
import { attachBackupMethods } from './api/modules/backup.js';
import { attachHealthMethods } from './api/modules/health.js';

export class APIClient extends APIClientCore {}

attachAuthMethods(APIClient);
attachCharacterMethods(APIClient);
attachUserMethods(APIClient);
attachMapMethods(APIClient);
attachSessionMethods(APIClient);
attachBackupMethods(APIClient);
attachHealthMethods(APIClient);

// Exporta instância singleton
export const apiClient = new APIClient();
