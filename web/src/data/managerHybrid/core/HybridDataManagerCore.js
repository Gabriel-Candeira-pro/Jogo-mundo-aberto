/**
 * Núcleo do DataManager híbrido multiplayer
 */
export class HybridDataManagerCore {
    constructor() {
        this.storagePrefix = 'gayme_';
        this.currentUser = null;
        this.currentCharacter = null;
        this.currentMap = null;
        this.onlineMode = true;
        this.playersOnline = [];
        this.heartbeatInterval = null;
        this.initialized = false;
        this.initPromise = null;
        this.savedMaps = [];
        this.lastInitError = null;
        this.initPromise = this.init();
    }
}
