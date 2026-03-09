/**
 * Métodos de autenticação do cliente API
 */
export function attachAuthMethods(APIClientClass) {
    /**
     * Registra novo usuário
     */
    APIClientClass.prototype.register = async function register(username, password, email = '') {
        const data = await this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password, email })
        });

        if (data.token) {
            this.setToken(data.token);
        }

        return data;
    };

    /**
     * Faz login
     */
    APIClientClass.prototype.login = async function login(username, password) {
        const data = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (data.token) {
            this.setToken(data.token);
        }

        return data;
    };

    /**
     * Verifica token
     */
    APIClientClass.prototype.verify = async function verify() {
        return await this.request('/api/auth/verify');
    };

    /**
     * Faz logout
     */
    APIClientClass.prototype.logout = function logout() {
        this.clearToken();
    };
}
