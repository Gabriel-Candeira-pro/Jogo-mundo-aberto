import { Character } from '../../models/Character.js';
import { User } from '../../models/User.js';
import { Map } from '../../models/Map.js';
import { apiClient } from '../../APIClient.js';
import { authManager } from '../../AuthManager.js';

function hasRenderableMapStructure(map) {
    return (
        (Array.isArray(map.buildings) && map.buildings.length > 0) ||
        (Array.isArray(map.roads) && map.roads.length > 0) ||
        (Array.isArray(map.obstacles) && map.obstacles.length > 0) ||
        (Array.isArray(map.water) && map.water.length > 0) ||
        (Array.isArray(map.npcs) && map.npcs.length > 0) ||
        (Array.isArray(map.collectibles) && map.collectibles.length > 0) ||
        (Array.isArray(map.platforms) && map.platforms.length > 0)
    );
}

/**
 * Métodos de inicialização e carga remota
 */
export function attachInitializationMethods(HybridDataManagerClass) {
    /**
     * Inicializa o gerenciador de dados (ONLINE obrigatório)
     */
    HybridDataManagerClass.prototype.init = async function init() {
        try {
            this.lastInitError = null;
            this.onlineMode = await authManager.checkAuthStatus();

            if (!this.onlineMode) {
                console.error('❌ LOGIN OBRIGATÓRIO - O jogo requer autenticação para modo multiplayer');
                throw new Error('Login obrigatório para jogar');
            }

            console.log('🌐 MODO MULTIPLAYER ONLINE - Mapa compartilhado com todos os jogadores');
            await this.loadFromServer();
            await this.joinMultiplayer();
            this.startHeartbeat();
            this.initialized = true;
            console.log('✅ DataManager inicializado com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao inicializar DataManager:', error);
            this.lastInitError = error?.message || 'Erro ao inicializar dados';
            this.initialized = false;
            this.initPromise = null;
            throw error;
        }
    };

    /**
     * Aguarda a inicialização completa do DataManager
     */
    HybridDataManagerClass.prototype.waitForInit = async function waitForInit() {
        if (this.initialized) {
            return true;
        }

        if (!this.initPromise) {
            this.initPromise = this.init();
        }

        try {
            await this.initPromise;
            return this.initialized;
        } catch (error) {
            this.initPromise = null;
            throw error;
        }
    };

    /**
     * Carrega dados do servidor
     */
    HybridDataManagerClass.prototype.loadFromServer = async function loadFromServer() {
        try {
            try {
                const charData = await apiClient.loadCharacter();
                this.currentCharacter = charData.data ? Character.fromJSON(charData.data) : this.createDefaultCharacter();
            } catch {
                this.currentCharacter = this.createDefaultCharacter();
            }

            try {
                const userData = await apiClient.loadUser();
                this.currentUser = userData.data ? User.fromJSON(userData.data) : this.createDefaultUser();
            } catch {
                this.currentUser = this.createDefaultUser();
            }

            try {
                const mapData = await apiClient.loadGlobalMap();
                if (!mapData?.data) {
                    throw new Error('API retornou mapa global vazio');
                }

                this.currentMap = Map.fromJSON(mapData.data);

                if (!hasRenderableMapStructure(this.currentMap)) {
                    throw new Error('Mapa global sem estruturas renderizaveis');
                }

                console.log(`🗺️  Mapa global carregado: ${this.currentMap.name}`);
            } catch (error) {
                console.error('Erro ao carregar mapa global:', error);
                this.currentMap = null;
                throw new Error('Falha ao carregar mapa global do servidor');
            }

            console.log('✅ Dados carregados do servidor');
        } catch (error) {
            console.error('❌ Erro ao carregar do servidor:', error);
            throw error;
        }
    };

    /**
     * DEPRECATED - Modo offline não está disponível
     */
    HybridDataManagerClass.prototype.loadFromLocal = function loadFromLocal() {
        console.error('❌ Modo offline não disponível. Login obrigatório.');
        throw new Error('Modo offline não disponível');
    };

    /**
     * DEPRECATED - Modo online é obrigatório
     */
    HybridDataManagerClass.prototype.enableOnlineMode = async function enableOnlineMode() {
        console.warn('Modo online já está ativado (obrigatório)');
        return true;
    };

    /**
     * DEPRECATED - Modo online é obrigatório
     */
    HybridDataManagerClass.prototype.disableOnlineMode = function disableOnlineMode() {
        console.error('❌ Não é possível desativar modo online - é obrigatório');
        throw new Error('Modo online é obrigatório');
    };
}
