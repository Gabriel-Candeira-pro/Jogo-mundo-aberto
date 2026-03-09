/**
 * Métodos de usuário do cliente API
 */
export function attachUserMethods(APIClientClass) {
    /**
     * Salva dados do usuário no servidor
     */
    APIClientClass.prototype.saveUser = async function saveUser(userData) {
        return await this.request('/api/user', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    };

    /**
     * Carrega dados do usuário do servidor
     */
    APIClientClass.prototype.loadUser = async function loadUser() {
        return await this.request('/api/user');
    };
}
