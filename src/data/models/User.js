/**
 * Modelo de Usuário
 * Representa os dados do usuário/jogador e suas estatísticas
 */
export class User {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.username = data.username || 'Jogador';
        this.email = data.email || '';
        this.highScore = data.highScore || 0;
        this.totalScore = data.totalScore || 0;
        this.gamesPlayed = data.gamesPlayed || 0;
        this.gamesWon = data.gamesWon || 0;
        this.achievements = data.achievements || [];
        this.settings = data.settings || this.getDefaultSettings();
        this.statistics = data.statistics || this.getDefaultStatistics();
        this.createdAt = data.createdAt || new Date().toISOString();
        this.lastLoginAt = data.lastLoginAt || new Date().toISOString();
    }

    /**
     * Gera um ID único para o usuário
     */
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Configurações padrão do usuário
     */
    getDefaultSettings() {
        return {
            soundEnabled: true,
            musicEnabled: true,
            volume: 0.7,
            difficulty: 'normal',
            theme: 'default'
        };
    }

    /**
     * Estatísticas padrão
     */
    getDefaultStatistics() {
        return {
            totalStarsCollected: 0,
            totalEnemiesDefeated: 0,
            totalJumps: 0,
            totalPlayTime: 0, // em segundos
            longestStreak: 0,
            fastestWin: null,
            deaths: 0
        };
    }

    /**
     * Atualiza a pontuação
     */
    updateScore(score) {
        this.totalScore += score;
        if (score > this.highScore) {
            this.highScore = score;
            this.checkAchievement('highscore_' + score);
        }
    }

    /**
     * Registra uma partida jogada
     */
    recordGame(won = false) {
        this.gamesPlayed++;
        if (won) {
            this.gamesWon++;
        }
        this.updateLastLogin();
    }

    /**
     * Adiciona uma conquista
     */
    addAchievement(achievement) {
        if (!this.achievements.includes(achievement)) {
            this.achievements.push(achievement);
        }
    }

    /**
     * Verifica e adiciona conquistas baseadas em marcos
     */
    checkAchievement(type) {
        const achievementMap = {
            'highscore_100': 'Primeira Centena',
            'highscore_500': 'Mestre das Estrelas',
            'highscore_1000': 'Lenda do Jogo',
            'games_10': 'Jogador Dedicado',
            'games_50': 'Veterano',
            'games_100': 'Campeão'
        };

        // Verifica marcos de partidas
        if (this.gamesPlayed >= 100 && !this.achievements.includes('games_100')) {
            this.addAchievement('games_100');
        } else if (this.gamesPlayed >= 50 && !this.achievements.includes('games_50')) {
            this.addAchievement('games_50');
        } else if (this.gamesPlayed >= 10 && !this.achievements.includes('games_10')) {
            this.addAchievement('games_10');
        }

        // Verifica conquistas específicas
        if (achievementMap[type]) {
            this.addAchievement(type);
        }
    }

    /**
     * Atualiza estatísticas
     */
    updateStatistics(stat, value) {
        if (this.statistics.hasOwnProperty(stat)) {
            this.statistics[stat] += value;
        }
    }

    /**
     * Atualiza configurações
     */
    updateSettings(settings) {
        this.settings = { ...this.settings, ...settings };
    }

    /**
     * Atualiza timestamp de último login
     */
    updateLastLogin() {
        this.lastLoginAt = new Date().toISOString();
    }

    /**
     * Calcula taxa de vitória
     */
    getWinRate() {
        return this.gamesPlayed > 0 
            ? ((this.gamesWon / this.gamesPlayed) * 100).toFixed(2) 
            : 0;
    }

    /**
     * Retorna objeto JSON para serialização
     */
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            highScore: this.highScore,
            totalScore: this.totalScore,
            gamesPlayed: this.gamesPlayed,
            gamesWon: this.gamesWon,
            achievements: this.achievements,
            settings: this.settings,
            statistics: this.statistics,
            createdAt: this.createdAt,
            lastLoginAt: this.lastLoginAt
        };
    }

    /**
     * Cria um User a partir de dados JSON
     */
    static fromJSON(json) {
        return new User(json);
    }
}
