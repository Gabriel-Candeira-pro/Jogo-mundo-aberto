/**
 * Gerenciador de Autenticação
 * Gerencia login, registro e sessão do usuário
 */

import { apiClient } from './APIClient.js';

export class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isOnline = false;
        this.initializeFromStorage();
        this.checkAuthStatus();
    }

    /**
     * Inicializa sessão com dados persistidos para evitar "falso deslogado" no refresh.
     */
    initializeFromStorage() {
        const stored = localStorage.getItem('gayme_current_user');
        if (stored) {
            try {
                this.currentUser = JSON.parse(stored);
            } catch (error) {
                console.warn('Dados de usuário local inválidos. Limpando sessão local.');
                localStorage.removeItem('gayme_current_user');
            }
        }

        this.isOnline = apiClient.isAuthenticated() && !!this.currentUser;
    }

    /**
     * Mensagens amigáveis para falhas comuns de autenticação.
     */
    formatAuthError(error) {
        const message = (error && error.message ? error.message : '').toLowerCase();

        if (message.includes('timeout')) {
            return 'Timeout ao conectar com servidor';
        }

        if (message.includes('failed to fetch') || message.includes('networkerror')) {
            return 'Servidor indisponível ou sem conexão de rede';
        }

        return error?.message || 'Erro inesperado na autenticação';
    }

    /**
     * Verifica status de autenticação
     */
    async checkAuthStatus() {
        if (apiClient.isAuthenticated()) {
            try {
                await apiClient.verify();
                this.isOnline = true;
                return true;
            } catch (error) {
                console.warn('Token inválido, fazendo logout');
                this.logout();
                return false;
            }
        }

        this.isOnline = false;
        return false;
    }

    /**
     * Registra novo usuário
     */
    async register(username, password, email = '') {
        try {
            const response = await apiClient.register(username, password, email);
            
            if (response.success) {
                this.currentUser = {
                    id: response.userId,
                    username: response.username
                };
                this.isOnline = true;
                
                // Salva info do usuário localmente
                localStorage.setItem('gayme_current_user', JSON.stringify(this.currentUser));
                
                return {
                    success: true,
                    user: this.currentUser
                };
            }
            
            return response;
        } catch (error) {
            console.error('Erro no registro:', error);
            return {
                success: false,
                error: this.formatAuthError(error)
            };
        }
    }

    /**
     * Faz login
     */
    async login(username, password) {
        try {
            const response = await apiClient.login(username, password);
            
            if (response.success) {
                this.currentUser = {
                    id: response.userId,
                    username: response.username
                };
                this.isOnline = true;
                
                // Salva info do usuário localmente
                localStorage.setItem('gayme_current_user', JSON.stringify(this.currentUser));
                
                return {
                    success: true,
                    user: this.currentUser
                };
            }
            
            return response;
        } catch (error) {
            console.error('Erro no login:', error);
            return {
                success: false,
                error: this.formatAuthError(error)
            };
        }
    }

    /**
     * Faz logout
     */
    logout() {
        apiClient.logout();
        this.currentUser = null;
        this.isOnline = false;
        localStorage.removeItem('gayme_current_user');
    }

    /**
     * Verifica se está autenticado
     */
    isAuthenticated() {
        return this.isOnline && apiClient.isAuthenticated();
    }

    /**
     * Obtém usuário atual
     */
    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('gayme_current_user');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    /**
     * Verifica se o servidor está online
     */
    async checkServerStatus() {
        try {
            const health = await apiClient.healthCheck();
            return health.status === 'ok';
        } catch (error) {
            return false;
        }
    }
}

// Exporta instância singleton
export const authManager = new AuthManager();
