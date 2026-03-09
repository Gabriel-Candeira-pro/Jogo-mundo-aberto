import { User } from '../../models/User.js';

/**
 * Métodos de usuário do DataManager
 */
export function attachUserMethods(DataManagerClass) {
    /**
     * Cria um usuário padrão
     */
    DataManagerClass.prototype.createDefaultUser = function createDefaultUser() {
        const user = new User({
            username: 'Jogador',
            email: ''
        });
        this.saveUser(user);
        return user;
    };

    /**
     * Salva o usuário no localStorage
     */
    DataManagerClass.prototype.saveUser = function saveUser(user) {
        if (user instanceof User) {
            localStorage.setItem(this.storagePrefix + 'user', JSON.stringify(user.toJSON()));
            this.currentUser = user;
        }
    };

    /**
     * Carrega o usuário do localStorage
     */
    DataManagerClass.prototype.loadUser = function loadUser() {
        const data = localStorage.getItem(this.storagePrefix + 'user');
        if (data) {
            try {
                return User.fromJSON(JSON.parse(data));
            } catch (e) {
                console.error('Erro ao carregar usuário:', e);
                return null;
            }
        }
        return null;
    };

    /**
     * Atualiza dados do usuário
     */
    DataManagerClass.prototype.updateUser = function updateUser(data) {
        if (this.currentUser) {
            Object.assign(this.currentUser, data);
            this.saveUser(this.currentUser);
        }
    };

    /**
     * Obtém o usuário atual
     */
    DataManagerClass.prototype.getUser = function getUser() {
        return this.currentUser;
    };

    /**
     * Reseta dados do usuário
     */
    DataManagerClass.prototype.resetUser = function resetUser() {
        this.currentUser = this.createDefaultUser();
        return this.currentUser;
    };
}
