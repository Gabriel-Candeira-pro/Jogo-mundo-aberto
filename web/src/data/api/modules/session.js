/**
 * Métodos de sessão do cliente API
 */
export function attachSessionMethods(APIClientClass) {
    /**
     * Salva sessão no servidor
     */
    APIClientClass.prototype.saveSession = async function saveSession(sessionData) {
        return await this.request('/api/session', {
            method: 'POST',
            body: JSON.stringify(sessionData)
        });
    };

    /**
     * Carrega sessão do servidor
     */
    APIClientClass.prototype.loadSession = async function loadSession() {
        return await this.request('/api/session');
    };
}
