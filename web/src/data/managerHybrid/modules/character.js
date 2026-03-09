import { Character } from '../../models/Character.js';
import { apiClient } from '../../APIClient.js';

/**
 * Métodos de personagem do DataManager híbrido
 */
export function attachCharacterMethods(HybridDataManagerClass) {
    HybridDataManagerClass.prototype.createDefaultCharacter = function createDefaultCharacter() {
        const character = new Character({ name: 'Herói' });
        this.saveCharacter(character);
        return character;
    };

    HybridDataManagerClass.prototype.saveCharacter = async function saveCharacter(character) {
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
    };

    HybridDataManagerClass.prototype.saveCharacterLocal = function saveCharacterLocal(character) {
        localStorage.setItem(this.storagePrefix + 'character', JSON.stringify(character.toJSON()));
    };

    HybridDataManagerClass.prototype.loadCharacterLocal = function loadCharacterLocal() {
        const data = localStorage.getItem(this.storagePrefix + 'character');
        return data ? Character.fromJSON(JSON.parse(data)) : null;
    };

    HybridDataManagerClass.prototype.updateCharacter = function updateCharacter(data) {
        if (this.currentCharacter) {
            Object.assign(this.currentCharacter, data);
            this.saveCharacter(this.currentCharacter);
        }
    };

    HybridDataManagerClass.prototype.getCharacter = function getCharacter() {
        return this.currentCharacter;
    };

    HybridDataManagerClass.prototype.resetCharacter = function resetCharacter() {
        this.currentCharacter = this.createDefaultCharacter();
        return this.currentCharacter;
    };

    HybridDataManagerClass.prototype.createCustomCharacter = function createCustomCharacter(data) {
        const character = new Character(data);
        this.saveCharacter(character);
        return character;
    };
}
