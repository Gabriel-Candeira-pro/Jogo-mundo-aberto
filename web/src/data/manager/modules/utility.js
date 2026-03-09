import { Character } from '../../models/Character.js';
import { User } from '../../models/User.js';
import { Map } from '../../models/Map.js';

/**
 * Métodos utilitários do DataManager
 */
export function attachUtilityMethods(DataManagerClass) {
    /**
     * Limpa todos os dados salvos
     */
    DataManagerClass.prototype.clearAllData = function clearAllData() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.storagePrefix)) {
                localStorage.removeItem(key);
            }
        });
        this.init();
    };

    /**
     * Exporta todos os dados
     */
    DataManagerClass.prototype.exportData = function exportData() {
        return {
            user: this.currentUser?.toJSON(),
            character: this.currentCharacter?.toJSON(),
            map: this.currentMap?.toJSON(),
            savedMaps: this.savedMaps.map(m => m.toJSON()),
            session: this.getCurrentSession(),
            exportDate: new Date().toISOString()
        };
    };

    /**
     * Importa dados
     */
    DataManagerClass.prototype.importData = function importData(data) {
        try {
            if (data.user) {
                this.currentUser = User.fromJSON(data.user);
                this.saveUser(this.currentUser);
            }
            if (data.character) {
                this.currentCharacter = Character.fromJSON(data.character);
                this.saveCharacter(this.currentCharacter);
            }
            if (data.map) {
                this.currentMap = Map.fromJSON(data.map);
                this.saveMap(this.currentMap);
            }
            if (data.savedMaps) {
                localStorage.setItem(this.storagePrefix + 'maps', JSON.stringify(data.savedMaps));
                this.savedMaps = data.savedMaps.map(m => Map.fromJSON(m));
            }
            return true;
        } catch (e) {
            console.error('Erro ao importar dados:', e);
            return false;
        }
    };

    /**
     * Obtém informações de armazenamento
     */
    DataManagerClass.prototype.getStorageInfo = function getStorageInfo() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(this.storagePrefix));
        let totalSize = 0;

        keys.forEach(key => {
            totalSize += localStorage.getItem(key).length;
        });

        return {
            keysCount: keys.length,
            totalSize: totalSize,
            totalSizeKB: (totalSize / 1024).toFixed(2)
        };
    };
}
