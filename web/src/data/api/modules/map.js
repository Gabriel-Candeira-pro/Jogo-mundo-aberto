/**
 * Métodos de mapa do cliente API
 */
export function attachMapMethods(APIClientClass) {
    /**
     * Carrega mapa global compartilhado (multiplayer)
     */
    APIClientClass.prototype.loadGlobalMap = async function loadGlobalMap() {
        return await this.request('/api/map/global');
    };

    /**
     * Atualiza mapa global (admin/sistema)
     */
    APIClientClass.prototype.saveGlobalMap = async function saveGlobalMap(mapData) {
        return await this.request('/api/map/global', {
            method: 'POST',
            body: JSON.stringify(mapData)
        });
    };

    /**
     * Registra jogador entrando no mapa multiplayer
     */
    APIClientClass.prototype.joinMultiplayer = async function joinMultiplayer(username, characterName) {
        return await this.request('/api/players/join', {
            method: 'POST',
            body: JSON.stringify({ username, characterName })
        });
    };

    /**
     * Registra jogador saindo do mapa multiplayer
     */
    APIClientClass.prototype.leaveMultiplayer = async function leaveMultiplayer() {
        return await this.request('/api/players/leave', {
            method: 'POST',
            body: JSON.stringify({})
        });
    };

    /**
     * Lista jogadores online no mapa
     */
    APIClientClass.prototype.getOnlinePlayers = async function getOnlinePlayers() {
        return await this.request('/api/players/online');
    };

    /**
     * Envia heartbeat para manter jogador ativo
     */
    APIClientClass.prototype.sendHeartbeat = async function sendHeartbeat() {
        return await this.request('/api/players/heartbeat', {
            method: 'POST',
            body: JSON.stringify({})
        });
    };

    // ========== MÉTODOS LEGADOS (MANTER PARA COMPATIBILIDADE) ==========
    
    /**
     * @deprecated Use loadGlobalMap() para modo multiplayer
     */
    APIClientClass.prototype.saveCurrentMap = async function saveCurrentMap(mapData) {
        console.warn('saveCurrentMap() está deprecated. Use saveGlobalMap() para multiplayer.');
        return await this.saveGlobalMap(mapData);
    };

    /**
     * @deprecated Use loadGlobalMap() para modo multiplayer
     */
    APIClientClass.prototype.loadCurrentMap = async function loadCurrentMap() {
        console.warn('loadCurrentMap() está deprecated. Use loadGlobalMap() para multiplayer.');
        return await this.loadGlobalMap();
    };

    /**
     * @deprecated Não usado em modo multiplayer
     */
    APIClientClass.prototype.saveMaps = async function saveMaps(mapsData) {
        console.warn('saveMaps() não é usado em modo multiplayer.');
        return { success: false, message: 'Não disponível em modo multiplayer' };
    };

    /**
     * @deprecated Não usado em modo multiplayer
     */
    APIClientClass.prototype.loadMaps = async function loadMaps() {
        console.warn('loadMaps() não é usado em modo multiplayer.');
        return { success: false, data: [] };
    };
}
