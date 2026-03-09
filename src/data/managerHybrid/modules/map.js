import { Map } from '../../models/Map.js';

/**
 * Métodos de mapa do DataManager híbrido
 */
export function attachMapMethods(HybridDataManagerClass) {
    /**
     * Cria mapa padrão (não usado em multiplayer - mapa é global)
     * @deprecated Em modo multiplayer, o mapa é global e criado automaticamente
     */
    HybridDataManagerClass.prototype.createDefaultMap = function createDefaultMap() {
        console.warn('createDefaultMap() não é usado em multiplayer - o mapa global é carregado do servidor');
        return new Map({ name: 'Arena Multiplayer', level: 1 });
    };

    /**
     * Salva mapa global (apenas admin/sistema pode modificar)
     * @deprecated Jogadores não podem modificar o mapa global
     */
    HybridDataManagerClass.prototype.saveMap = async function saveMap(map) {
        console.warn('saveMap() não altera o mapa global em modo multiplayer');
    };

    /**
     * @deprecated Não usado em modo multiplayer
     */
    HybridDataManagerClass.prototype.saveMapLocal = function saveMapLocal(map) {
        console.warn('saveMapLocal() não é usado em modo multiplayer');
    };

    /**
     * @deprecated Não usado em modo multiplayer
     */
    HybridDataManagerClass.prototype.loadMapLocal = function loadMapLocal() {
        console.warn('loadMapLocal() não é usado em modo multiplayer');
        return null;
    };

    /**
     * @deprecated Não usado em modo multiplayer
     */
    HybridDataManagerClass.prototype.saveMapToList = async function saveMapToList(map) {
        console.warn('saveMapToList() não é usado em modo multiplayer');
    };

    /**
     * @deprecated Não usado em modo multiplayer
     */
    HybridDataManagerClass.prototype.loadAllMapsLocal = function loadAllMapsLocal() {
        console.warn('loadAllMapsLocal() não é usado em modo multiplayer');
        return [];
    };

    HybridDataManagerClass.prototype.getMap = function getMap() {
        return this.currentMap;
    };

    /**
     * @deprecated Não há lista de mapas em modo multiplayer - apenas um mapa global
     */
    HybridDataManagerClass.prototype.getAllMaps = function getAllMaps() {
        console.warn('getAllMaps() não é usado em modo multiplayer - há apenas um mapa global');
        return [this.currentMap];
    };

    /**
     * @deprecated Não usado em modo multiplayer
     */
    HybridDataManagerClass.prototype.getMapById = function getMapById(id) {
        console.warn('getMapById() não é usado em modo multiplayer');
        return this.currentMap;
    };

    /**
     * @deprecated Não é possível trocar de mapa em modo multiplayer
     */
    HybridDataManagerClass.prototype.setCurrentMap = function setCurrentMap(map) {
        console.warn('setCurrentMap() não é usado em modo multiplayer - mapa global é fixo');
    };

    /**
     * @deprecated Não é possível criar mapas customizados em modo multiplayer
     */
    HybridDataManagerClass.prototype.createCustomMap = function createCustomMap(data) {
        console.warn('createCustomMap() não é usado em modo multiplayer');
        return this.currentMap;
    };

    /**
     * @deprecated Não é possível deletar mapas em modo multiplayer
     */
    HybridDataManagerClass.prototype.deleteMap = function deleteMap(id) {
        console.warn('deleteMap() não é usado em modo multiplayer');
    };

    /**
     * @deprecated Não é possível resetar mapa em modo multiplayer
     */
    HybridDataManagerClass.prototype.resetMap = function resetMap() {
        console.warn('resetMap() não é usado em modo multiplayer');
        return this.currentMap;
    };
}
