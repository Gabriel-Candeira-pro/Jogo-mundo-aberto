import { Character } from './models/Character.js';
import { User } from './models/User.js';
import { Map } from './models/Map.js';
import { apiClient } from './APIClient.js';
import { authManager } from './AuthManager.js';

/**
 * Gerenciador de Dados Multiplayer
 * MODO MULTIPLAYER ONLINE OBRIGATÓRIO - Todos os jogadores compartilham o mesmo mapa
 */
export class HybridDataManager {
    constructor() {
        this.storagePrefix = 'gayme_';
        this.currentUser = null;
        this.currentCharacter = null;
        this.currentMap = null;
        this.onlineMode = true; // SEMPRE online
        this.playersOnline = [];
        this.heartbeatInterval = null;
        this.initialized = false; // Flag de inicialização
        this.initPromise = null; // Promise de inicialização
        this.initPromise = this.init();
    }

    /**
     * Inicializa o gerenciador de dados (ONLINE obrigatório)
     */
    async init() {
        try {
            // Verifica se está autenticado no servidor
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
            this.initialized = false;
            this.initPromise = null;
            throw error;
        }
    }

    /**
     * Aguarda a inicialização completa do DataManager
     */
    async waitForInit() {
        if (this.initialized) {
            return true;
        }

        // Permite re-tentar inicializacao quando o usuario acabou de autenticar.
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
    }

    /**
     * Carrega dados do servidor
     */
    async loadFromServer() {
        try {
            // Carrega personagem
            try {
                const charData = await apiClient.loadCharacter();
                this.currentCharacter = charData.data ? Character.fromJSON(charData.data) : this.createDefaultCharacter();
            } catch {
                this.currentCharacter = this.createDefaultCharacter();
            }

            // Carrega usuário
            try {
                const userData = await apiClient.loadUser();
                this.currentUser = userData.data ? User.fromJSON(userData.data) : this.createDefaultUser();
            } catch {
                this.currentUser = this.createDefaultUser();
            }

            // Carrega MAPA GLOBAL compartilhado (MULTIPLAYER)
            try {
                const mapData = await apiClient.loadGlobalMap();
                this.currentMap = mapData.data ? Map.fromJSON(mapData.data) : this.createDefaultMap();
                console.log(`🗺️  Mapa global carregado: ${this.currentMap.name}`);
            } catch (error) {
                console.error('Erro ao carregar mapa global:', error);
                this.currentMap = this.createDefaultMap();
            }

            console.log('✅ Dados carregados do servidor');
        } catch (error) {
            console.error('❌ Erro ao carregar do servidor:', error);
            throw error;
        }
    }

    /**
     * DEPRECATED - Modo offline não está disponível
     */
    loadFromLocal() {
        console.error('❌ Modo offline não disponível. Login obrigatório.');
        throw new Error('Modo offline não disponível');
    }

    /**
     * DEPRECATED - Modo online é obrigatório
     */
    async enableOnlineMode() {
        console.warn('Modo online já está ativado (obrigatório)');
        return true;
    }

    /**
     * DEPRECATED - Modo online é obrigatório
     */
    disableOnlineMode() {
        console.error('❌ Não é possível desativar modo online - é obrigatório');
        throw new Error('Modo online é obrigatório');
    }

    // ==================== MULTIPLAYER MANAGEMENT ====================

    /**
     * Entra no mapa multiplayer
     */
    async joinMultiplayer() {
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
    }

    /**
     * Sai do mapa multiplayer
     */
    async leaveMultiplayer() {
        try {
            await apiClient.leaveMultiplayer();
            this.stopHeartbeat();
            console.log('👋 Saiu do mapa multiplayer');
        } catch (error) {
            console.error('Erro ao sair do multiplayer:', error);
        }
    }

    /**
     * Atualiza lista de jogadores online
     */
    async updateOnlinePlayers() {
        try {
            const result = await apiClient.getOnlinePlayers();
            this.playersOnline = result.players || [];
            return this.playersOnline;
        } catch (error) {
            console.error('Erro ao atualizar jogadores online:', error);
            return [];
        }
    }

    /**
     * Obtém jogadores online
     */
    getOnlinePlayers() {
        return this.playersOnline;
    }

    /**
     * Inicia heartbeat para manter jogador ativo
     */
    startHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        
        // Envia heartbeat a cada 30 segundos
        this.heartbeatInterval = setInterval(async () => {
            try {
                await apiClient.sendHeartbeat();
                await this.updateOnlinePlayers();
            } catch (error) {
                console.error('Erro no heartbeat:', error);
            }
        }, 30000);
    }

    /**
     * Para o heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    // ==================== USER MANAGEMENT ====================

    createDefaultUser() {
        const user = new User({ username: 'Jogador', email: '' });
        this.saveUser(user);
        return user;
    }

    async saveUser(user) {
        if (user instanceof User) {
            this.currentUser = user;
            this.saveUserLocal(user);
            
            if (this.onlineMode) {
                try {
                    await apiClient.saveUser(user.toJSON());
                } catch (error) {
                    console.error('Erro ao salvar usuário no servidor:', error);
                }
            }
        }
    }

    saveUserLocal(user) {
        localStorage.setItem(this.storagePrefix + 'user', JSON.stringify(user.toJSON()));
    }

    loadUserLocal() {
        const data = localStorage.getItem(this.storagePrefix + 'user');
        return data ? User.fromJSON(JSON.parse(data)) : null;
    }

    updateUser(data) {
        if (this.currentUser) {
            Object.assign(this.currentUser, data);
            this.saveUser(this.currentUser);
        }
    }

    getUser() {
        return this.currentUser;
    }

    resetUser() {
        this.currentUser = this.createDefaultUser();
        return this.currentUser;
    }

    // ==================== CHARACTER MANAGEMENT ====================

    createDefaultCharacter() {
        const character = new Character({ name: 'Herói' });
        this.saveCharacter(character);
        return character;
    }

    async saveCharacter(character) {
        if (character instanceof Character) {
            this.currentCharacter = character;
            this.saveCharacterLocal(character);
            
            if (this.onlineMode) {
                try {
                    await apiClient.saveCharacter(character.toJSON());
                } catch (error) {
                    console.error('Erro ao salvar personagem no servidor:', error);
                }
            }
        }
    }

    saveCharacterLocal(character) {
        localStorage.setItem(this.storagePrefix + 'character', JSON.stringify(character.toJSON()));
    }

    loadCharacterLocal() {
        const data = localStorage.getItem(this.storagePrefix + 'character');
        return data ? Character.fromJSON(JSON.parse(data)) : null;
    }

    updateCharacter(data) {
        if (this.currentCharacter) {
            Object.assign(this.currentCharacter, data);
            this.saveCharacter(this.currentCharacter);
        }
    }

    getCharacter() {
        return this.currentCharacter;
    }

    resetCharacter() {
        this.currentCharacter = this.createDefaultCharacter();
        return this.currentCharacter;
    }

    createCustomCharacter(data) {
        const character = new Character(data);
        this.saveCharacter(character);
        return character;
    }

    // ==================== MAP MANAGEMENT (MULTIPLAYER) ====================

    /**
     * Cria mapa padrão (não usado em multiplayer - mapa é global)
     * @deprecated Em modo multiplayer, o mapa é global e criado automaticamente
     */
    createDefaultMap() {
        console.warn('createDefaultMap() não é usado em multiplayer - o mapa global é carregado do servidor');
        const map = new Map({ name: 'Arena Multiplayer', level: 1 });
        return map;
    }

    /**
     * Salva mapa global (apenas admin/sistema pode modificar)
     * @deprecated Jogadores não podem modificar o mapa global
     */
    async saveMap(map) {
        console.warn('saveMap() não altera o mapa global em modo multiplayer');
        // Não faz nada - mapa global não pode ser modificado por jogadores individuais
    }

    /**
     * @deprecated Não usado em modo multiplayer
     */
    saveMapLocal(map) {
        console.warn('saveMapLocal() não é usado em modo multiplayer');
    }

    /**
     * @deprecated Não usado em modo multiplayer
     */
    loadMapLocal() {
        console.warn('loadMapLocal() não é usado em modo multiplayer');
        return null;
    }

    /**
     * @deprecated Não usado em modo multiplayer
     */
    async saveMapToList(map) {
        console.warn('saveMapToList() não é usado em modo multiplayer');
    }

    /**
     * @deprecated Não usado em modo multiplayer
     */
    loadAllMapsLocal() {
        console.warn('loadAllMapsLocal() não é usado em modo multiplayer');
        return [];
    }

    /**
     * Obtém o mapa global atual
     */
    getMap() {
        return this.currentMap;
    }

    /**
     * @deprecated Não há lista de mapas em modo multiplayer - apenas um mapa global
     */
    getAllMaps() {
        console.warn('getAllMaps() não é usado em modo multiplayer - há apenas um mapa global');
        return [this.currentMap];
    }

    /**
     * @deprecated Não usado em modo multiplayer
     */
    getMapById(id) {
        console.warn('getMapById() não é usado em modo multiplayer');
        return this.currentMap;
    }

    /**
     * @deprecated Não é possível trocar de mapa em modo multiplayer
     */
    setCurrentMap(map) {
        console.warn('setCurrentMap() não é usado em modo multiplayer - mapa global é fixo');
    }

    /**
     * @deprecated Não é possível criar mapas customizados em modo multiplayer
     */
    createCustomMap(data) {
        console.warn('createCustomMap() não é usado em modo multiplayer');
        return this.currentMap;
    }

    /**
     * @deprecated Não é possível deletar mapas em modo multiplayer
     */
    deleteMap(id) {
        console.warn('deleteMap() não é usado em modo multiplayer');
    }

    /**
     * @deprecated Não é possível resetar mapa em modo multiplayer
     */
    resetMap() {
        console.warn('resetMap() não é usado em modo multiplayer');
        return this.currentMap;
    }

    // ==================== SESSION MANAGEMENT ====================

    startGameSession() {
        const session = {
            startTime: Date.now(),
            score: 0,
            starsCollected: 0,
            enemiesDefeated: 0,
            jumps: 0,
            deaths: 0
        };
        
        localStorage.setItem(this.storagePrefix + 'current_session', JSON.stringify(session));
        return session;
    }

    updateSession(data) {
        const sessionData = localStorage.getItem(this.storagePrefix + 'current_session');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            const updated = { ...session, ...data };
            localStorage.setItem(this.storagePrefix + 'current_session', JSON.stringify(updated));
            return updated;
        }
        return null;
    }

    async endGameSession(won = false) {
        const sessionData = localStorage.getItem(this.storagePrefix + 'current_session');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            const duration = Math.floor((Date.now() - session.startTime) / 1000);

            if (this.currentUser) {
                this.currentUser.updateScore(session.score);
                this.currentUser.recordGame(won);
                this.currentUser.updateStatistics('totalStarsCollected', session.starsCollected);
                this.currentUser.updateStatistics('totalEnemiesDefeated', session.enemiesDefeated);
                this.currentUser.updateStatistics('totalJumps', session.jumps);
                this.currentUser.updateStatistics('totalPlayTime', duration);
                this.currentUser.updateStatistics('deaths', session.deaths);
                
                if (won && (!this.currentUser.statistics.fastestWin || duration < this.currentUser.statistics.fastestWin)) {
                    this.currentUser.statistics.fastestWin = duration;
                }

                await this.saveUser(this.currentUser);
            }

            if (this.currentCharacter) {
                this.currentCharacter.addExperience(Math.floor(session.score / 10));
                this.currentCharacter.addCoins(session.starsCollected);
                this.currentCharacter.updateLastPlayed();
                await this.saveCharacter(this.currentCharacter);
            }

            // MULTIPLAYER: Não modifica o mapa global
            // O mapa global é compartilhado e não é afetado por vitórias individuais
            
            localStorage.removeItem(this.storagePrefix + 'current_session');
            return { session, duration };
        }
        return null;
    }

    getCurrentSession() {
        const data = localStorage.getItem(this.storagePrefix + 'current_session');
        return data ? JSON.parse(data) : null;
    }

    // ==================== UTILITY METHODS ====================

    clearAllData() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.storagePrefix)) {
                localStorage.removeItem(key);
            }
        });
        this.initialized = false;
        this.initPromise = this.init();
    }

    async exportData() {
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
    }

    async importData(data) {
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
    }

    getStorageInfo() {
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
    }
}

// Exporta instância singleton
export const dataManager = new HybridDataManager();
