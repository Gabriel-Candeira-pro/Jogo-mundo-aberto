/**
 * Métodos de sessão do DataManager
 */
export function attachSessionMethods(DataManagerClass) {
    /**
     * Inicia uma nova sessão de jogo
     */
    DataManagerClass.prototype.startGameSession = function startGameSession() {
        const session = {
            startTime: Date.now(),
            score: 0,
            starsCollected: 0,
            enemiesDefeated: 0,
            jumps: 0,
            deaths: 0
        };

        localStorage.setItem(this.storagePrefix + 'current_session', JSON.stringify(session));
        return session;
    };

    /**
     * Atualiza a sessão atual
     */
    DataManagerClass.prototype.updateSession = function updateSession(data) {
        const sessionData = localStorage.getItem(this.storagePrefix + 'current_session');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            const updated = { ...session, ...data };
            localStorage.setItem(this.storagePrefix + 'current_session', JSON.stringify(updated));
            return updated;
        }
        return null;
    };

    /**
     * Finaliza a sessão de jogo
     */
    DataManagerClass.prototype.endGameSession = function endGameSession(won = false) {
        const sessionData = localStorage.getItem(this.storagePrefix + 'current_session');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            const duration = Math.floor((Date.now() - session.startTime) / 1000);

            // Atualiza estatísticas do usuário
            if (this.currentUser) {
                this.currentUser.updateScore(session.score);
                this.currentUser.recordGame(won);
                this.currentUser.updateStatistics('totalStarsCollected', session.starsCollected);
                this.currentUser.updateStatistics('totalEnemiesDefeated', session.enemiesDefeated);
                this.currentUser.updateStatistics('totalJumps', session.jumps);
                this.currentUser.updateStatistics('totalPlayTime', duration);
                this.currentUser.updateStatistics('deaths', session.deaths);

                if (won && (!this.currentUser.statistics.fastestWin || duration < this.currentUser.statistics.fastestWin)) {
                    this.currentUser.statistics.fastestWin = duration;
                }

                this.saveUser(this.currentUser);
            }

            // Atualiza personagem
            if (this.currentCharacter) {
                this.currentCharacter.addExperience(Math.floor(session.score / 10));
                this.currentCharacter.addCoins(session.starsCollected);
                this.currentCharacter.updateLastPlayed();
                this.saveCharacter(this.currentCharacter);
            }

            // Atualiza mapa
            if (this.currentMap && won) {
                this.currentMap.complete(session.score);
                this.saveMap(this.currentMap);
                this.saveMapToList(this.currentMap);
            }

            localStorage.removeItem(this.storagePrefix + 'current_session');
            return { session, duration };
        }
        return null;
    };

    /**
     * Obtém a sessão atual
     */
    DataManagerClass.prototype.getCurrentSession = function getCurrentSession() {
        const data = localStorage.getItem(this.storagePrefix + 'current_session');
        return data ? JSON.parse(data) : null;
    };
}
