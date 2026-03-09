/**
 * Métodos de backup/restore do cliente API
 */
export function attachBackupMethods(APIClientClass) {
    /**
     * Exporta todos os dados do servidor
     */
    APIClientClass.prototype.exportData = async function exportData() {
        return await this.request('/api/export');
    };

    /**
     * Importa dados para o servidor
     */
    APIClientClass.prototype.importData = async function importData(data) {
        return await this.request('/api/import', {
            method: 'POST',
            body: JSON.stringify({ data })
        });
    };
}
