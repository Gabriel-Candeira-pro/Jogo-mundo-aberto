import { apiClient } from '../../APIClient.js';

/**
 * Métodos de gerenciamento multiplayer
 */
export function attachMultiplayerMethods(HybridDataManagerClass) {
    /**
     * Entra no mapa multiplayer
     */
    HybridDataManagerClass.prototype.joinMultiplayer = async function joinMultiplayer() {
        try {
            const result = await apiClient.joinMultiplayer(
                this.currentUser?.username || 'Jogador',
                this.currentCharacter?.name || 'Herói'
            );
            console.log(`✅ Entrou no mapa multiplayer. Jogadores online: ${result.players || '?'}`);
            await this.updateOnlinePlayers();
        } catch (error) {
            console.error('Erro ao entrar no multiplayer:', error);
        }
    };

    /**
     * Sai do mapa multiplayer
     */
    HybridDataManagerClass.prototype.leaveMultiplayer = async function leaveMultiplayer() {
        try {
            await apiClient.leaveMultiplayer();
            this.stopHeartbeat();
            console.log('👋 Saiu do mapa multiplayer');
        } catch (error) {
            console.error('Erro ao sair do multiplayer:', error);
        }
    };

    /**
     * Atualiza lista de jogadores online
     */
    HybridDataManagerClass.prototype.updateOnlinePlayers = async function updateOnlinePlayers() {
        try {
            const result = await apiClient.getOnlinePlayers();
            this.playersOnline = result.players || [];
            return this.playersOnline;
        } catch (error) {
            console.error('Erro ao atualizar jogadores online:', error);
            return [];
        }
    };

    /**
     * Obtém jogadores online
     */
    HybridDataManagerClass.prototype.getOnlinePlayers = function getOnlinePlayers() {
        return this.playersOnline;
    };

    /**
     * Inicia heartbeat para manter jogador ativo
     */
    HybridDataManagerClass.prototype.startHeartbeat = function startHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        this.heartbeatInterval = setInterval(async () => {
            try {
                await apiClient.sendHeartbeat();
                await this.updateOnlinePlayers();
            } catch (error) {
                console.error('Erro no heartbeat:', error);
            }
        }, 30000);
    };

    /**
     * Para o heartbeat
     */
    HybridDataManagerClass.prototype.stopHeartbeat = function stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    };
}
