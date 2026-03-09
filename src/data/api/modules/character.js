/**
 * Métodos de personagem do cliente API
 */
export function attachCharacterMethods(APIClientClass) {
    /**
     * Salva personagem no servidor
     */
    APIClientClass.prototype.saveCharacter = async function saveCharacter(characterData) {
        return await this.request('/api/character', {
            method: 'POST',
            body: JSON.stringify(characterData)
        });
    };

    /**
     * Carrega personagem do servidor
     */
    APIClientClass.prototype.loadCharacter = async function loadCharacter() {
        return await this.request('/api/character');
    };
}
