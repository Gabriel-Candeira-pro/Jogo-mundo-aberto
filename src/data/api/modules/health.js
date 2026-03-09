/**
 * Métodos utilitários do cliente API
 */
export function attachHealthMethods(APIClientClass) {
    /**
     * Verifica saúde do servidor
     */
    APIClientClass.prototype.healthCheck = async function healthCheck() {
        try {
            return await this.request('/api/health');
        } catch (error) {
            return { status: 'offline', error: error.message };
        }
    };
}
