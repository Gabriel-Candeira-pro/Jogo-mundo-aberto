import { Map } from '../../models/Map.js';

/**
 * Métodos de mapa do DataManager
 */
export function attachMapMethods(DataManagerClass) {
    /**
     * Cria um mapa padrão
     */
    DataManagerClass.prototype.createDefaultMap = function createDefaultMap() {
        const map = new Map({
            name: 'Nível 1',
            level: 1
        });
        this.saveMap(map);
        return map;
    };

    /**
     * Salva o mapa atual no localStorage
     */
    DataManagerClass.prototype.saveMap = function saveMap(map) {
        if (map instanceof Map) {
            localStorage.setItem(this.storagePrefix + 'current_map', JSON.stringify(map.toJSON()));
            this.currentMap = map;
        }
    };

    /**
     * Carrega o mapa atual do localStorage
     */
    DataManagerClass.prototype.loadMap = function loadMap() {
        const data = localStorage.getItem(this.storagePrefix + 'current_map');
        if (data) {
            try {
                return Map.fromJSON(JSON.parse(data));
            } catch (e) {
                console.error('Erro ao carregar mapa:', e);
                return null;
            }
        }
        return null;
    };

    /**
     * Salva um mapa específico na lista de mapas
     */
    DataManagerClass.prototype.saveMapToList = function saveMapToList(map) {
        if (!(map instanceof Map)) {
            return;
        }

        const maps = this.loadAllMaps();
        const existingIndex = maps.findIndex(m => m.id === map.id);

        if (existingIndex >= 0) {
            maps[existingIndex] = map.toJSON();
        } else {
            maps.push(map.toJSON());
        }

        localStorage.setItem(this.storagePrefix + 'maps', JSON.stringify(maps));
        this.savedMaps = maps.map(m => Map.fromJSON(m));
    };

    /**
     * Carrega todos os mapas salvos
     */
    DataManagerClass.prototype.loadAllMaps = function loadAllMaps() {
        const data = localStorage.getItem(this.storagePrefix + 'maps');
        if (data) {
            try {
                const mapsData = JSON.parse(data);
                return mapsData.map(m => Map.fromJSON(m));
            } catch (e) {
                console.error('Erro ao carregar mapas:', e);
                return [];
            }
        }
        return [];
    };

    /**
     * Obtém o mapa atual
     */
    DataManagerClass.prototype.getMap = function getMap() {
        return this.currentMap;
    };

    /**
     * Obtém todos os mapas
     */
    DataManagerClass.prototype.getAllMaps = function getAllMaps() {
        return this.savedMaps || [];
    };

    /**
     * Obtém um mapa específico pelo ID
     */
    DataManagerClass.prototype.getMapById = function getMapById(id) {
        const maps = this.getAllMaps();
        return maps.find(m => m.id === id);
    };

    /**
     * Define o mapa atual
     */
    DataManagerClass.prototype.setCurrentMap = function setCurrentMap(map) {
        this.currentMap = map;
        this.saveMap(map);
    };

    /**
     * Cria um novo mapa customizado
     */
    DataManagerClass.prototype.createCustomMap = function createCustomMap(data) {
        const map = new Map(data);
        this.saveMapToList(map);
        return map;
    };

    /**
     * Deleta um mapa
     */
    DataManagerClass.prototype.deleteMap = function deleteMap(id) {
        const maps = this.loadAllMaps();
        const filtered = maps.filter(m => m.id !== id);
        localStorage.setItem(this.storagePrefix + 'maps', JSON.stringify(filtered.map(m => m.toJSON())));
        this.savedMaps = filtered;
    };

    /**
     * Reseta o mapa atual
     */
    DataManagerClass.prototype.resetMap = function resetMap() {
        this.currentMap = this.createDefaultMap();
        return this.currentMap;
    };
}
