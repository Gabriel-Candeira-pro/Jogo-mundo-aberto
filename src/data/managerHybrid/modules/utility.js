import { Character } from '../../models/Character.js';
import { User } from '../../models/User.js';
import { Map } from '../../models/Map.js';
import { apiClient } from '../../APIClient.js';

/**
 * Métodos utilitários do DataManager híbrido
 */
export function attachUtilityMethods(HybridDataManagerClass) {
    HybridDataManagerClass.prototype.clearAllData = function clearAllData() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.storagePrefix)) {
                localStorage.removeItem(key);
            }
        });
        this.initialized = false;
        this.initPromise = this.init();
    };

    HybridDataManagerClass.prototype.exportData = async function exportData() {
        const data = {
            user: this.currentUser?.toJSON(),
            character: this.currentCharacter?.toJSON(),
            map: this.currentMap?.toJSON(),
            savedMaps: this.savedMaps.map(m => m.toJSON()),
            session: this.getCurrentSession(),
            exportDate: new Date().toISOString()
        };

        if (this.onlineMode) {
            try {
                const serverData = await apiClient.exportData();
                return serverData.data;
            } catch (error) {
                console.error('Erro ao exportar do servidor, usando dados locais:', error);
            }
        }

        return data;
    };

    HybridDataManagerClass.prototype.importData = async function importData(data) {
        try {
            if (data.user) {
                this.currentUser = User.fromJSON(data.user);
                await this.saveUser(this.currentUser);
            }
            if (data.character) {
                this.currentCharacter = Character.fromJSON(data.character);
                await this.saveCharacter(this.currentCharacter);
            }
            if (data.map) {
                this.currentMap = Map.fromJSON(data.map);
                await this.saveMap(this.currentMap);
            }
            if (data.savedMaps) {
                this.savedMaps = data.savedMaps.map(m => Map.fromJSON(m));
                localStorage.setItem(this.storagePrefix + 'maps', JSON.stringify(data.savedMaps));

                if (this.onlineMode) {
                    await apiClient.saveMaps(data.savedMaps);
                }
            }
            return true;
        } catch (e) {
            console.error('Erro ao importar dados:', e);
            return false;
        }
    };

    HybridDataManagerClass.prototype.getStorageInfo = function getStorageInfo() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(this.storagePrefix));
        let totalSize = 0;

        keys.forEach(key => {
            totalSize += localStorage.getItem(key).length;
        });

        return {
            mode: this.onlineMode ? 'online' : 'offline',
            keysCount: keys.length,
            totalSize: totalSize,
            totalSizeKB: (totalSize / 1024).toFixed(2)
        };
    };
}
