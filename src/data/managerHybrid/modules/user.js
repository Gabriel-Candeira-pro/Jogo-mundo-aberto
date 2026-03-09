import { User } from '../../models/User.js';
import { apiClient } from '../../APIClient.js';

/**
 * Métodos de usuário do DataManager híbrido
 */
export function attachUserMethods(HybridDataManagerClass) {
    HybridDataManagerClass.prototype.createDefaultUser = function createDefaultUser() {
        const user = new User({ username: 'Jogador', email: '' });
        this.saveUser(user);
        return user;
    };

    HybridDataManagerClass.prototype.saveUser = async function saveUser(user) {
        if (user instanceof User) {
            this.currentUser = user;
            this.saveUserLocal(user);

            if (this.onlineMode) {
                try {
                    await apiClient.saveUser(user.toJSON());
                } catch (error) {
                    console.error('Erro ao salvar usuário no servidor:', error);
                }
            }
        }
    };

    HybridDataManagerClass.prototype.saveUserLocal = function saveUserLocal(user) {
        localStorage.setItem(this.storagePrefix + 'user', JSON.stringify(user.toJSON()));
    };

    HybridDataManagerClass.prototype.loadUserLocal = function loadUserLocal() {
        const data = localStorage.getItem(this.storagePrefix + 'user');
        return data ? User.fromJSON(JSON.parse(data)) : null;
    };

    HybridDataManagerClass.prototype.updateUser = function updateUser(data) {
        if (this.currentUser) {
            Object.assign(this.currentUser, data);
            this.saveUser(this.currentUser);
        }
    };

    HybridDataManagerClass.prototype.getUser = function getUser() {
        return this.currentUser;
    };

    HybridDataManagerClass.prototype.resetUser = function resetUser() {
        this.currentUser = this.createDefaultUser();
        return this.currentUser;
    };
}
