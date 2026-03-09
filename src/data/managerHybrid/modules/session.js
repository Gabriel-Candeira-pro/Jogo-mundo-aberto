/**
 * Métodos de sessão do DataManager híbrido
 */
export function attachSessionMethods(HybridDataManagerClass) {
    HybridDataManagerClass.prototype.startGameSession = function startGameSession() {
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

    HybridDataManagerClass.prototype.updateSession = function updateSession(data) {
        const sessionData = localStorage.getItem(this.storagePrefix + 'current_session');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            const updated = { ...session, ...data };
            localStorage.setItem(this.storagePrefix + 'current_session', JSON.stringify(updated));
            return updated;
        }
        return null;
    };

    HybridDataManagerClass.prototype.endGameSession = async function endGameSession(won = false) {
        const sessionData = localStorage.getItem(this.storagePrefix + 'current_session');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            const duration = Math.floor((Date.now() - session.startTime) / 1000);

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

                await this.saveUser(this.currentUser);
            }

            if (this.currentCharacter) {
                this.currentCharacter.addExperience(Math.floor(session.score / 10));
                this.currentCharacter.addCoins(session.starsCollected);
                this.currentCharacter.updateLastPlayed();
                await this.saveCharacter(this.currentCharacter);
            }

            localStorage.removeItem(this.storagePrefix + 'current_session');
            return { session, duration };
        }
        return null;
    };

    HybridDataManagerClass.prototype.getCurrentSession = function getCurrentSession() {
        const data = localStorage.getItem(this.storagePrefix + 'current_session');
        return data ? JSON.parse(data) : null;
    };
}
