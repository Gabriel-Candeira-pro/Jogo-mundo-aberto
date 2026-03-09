import { Character } from '../../models/Character.js';

/**
 * Métodos de personagem do DataManager
 */
export function attachCharacterMethods(DataManagerClass) {
    /**
     * Cria um personagem padrão
     */
    DataManagerClass.prototype.createDefaultCharacter = function createDefaultCharacter() {
        const character = new Character({
            name: 'Herói'
        });
        this.saveCharacter(character);
        return character;
    };

    /**
     * Salva o personagem no localStorage
     */
    DataManagerClass.prototype.saveCharacter = function saveCharacter(character) {
        if (character instanceof Character) {
            localStorage.setItem(this.storagePrefix + 'character', JSON.stringify(character.toJSON()));
            this.currentCharacter = character;
        }
    };

    /**
     * Carrega o personagem do localStorage
     */
    DataManagerClass.prototype.loadCharacter = function loadCharacter() {
        const data = localStorage.getItem(this.storagePrefix + 'character');
        if (data) {
            try {
                return Character.fromJSON(JSON.parse(data));
            } catch (e) {
                console.error('Erro ao carregar personagem:', e);
                return null;
            }
        }
        return null;
    };

    /**
     * Atualiza dados do personagem
     */
    DataManagerClass.prototype.updateCharacter = function updateCharacter(data) {
        if (this.currentCharacter) {
            Object.assign(this.currentCharacter, data);
            this.saveCharacter(this.currentCharacter);
        }
    };

    /**
     * Obtém o personagem atual
     */
    DataManagerClass.prototype.getCharacter = function getCharacter() {
        return this.currentCharacter;
    };

    /**
     * Reseta dados do personagem
     */
    DataManagerClass.prototype.resetCharacter = function resetCharacter() {
        this.currentCharacter = this.createDefaultCharacter();
        return this.currentCharacter;
    };

    /**
     * Cria um novo personagem customizado
     */
    DataManagerClass.prototype.createCustomCharacter = function createCustomCharacter(data) {
        const character = new Character(data);
        this.saveCharacter(character);
        return character;
    };
}
