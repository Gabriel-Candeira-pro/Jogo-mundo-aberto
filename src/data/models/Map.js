/**
 * Modelo de Mapa
 * Representa a configuração de um mapa/nível do jogo
 */
export class Map {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.name = data.name || 'Mapa Padrão';
        this.level = data.level || 1;
        this.difficulty = data.difficulty || 'normal';
        this.width = data.width || 800;
        this.height = data.height || 600;
        this.backgroundColor = data.backgroundColor || '#2d2d44';
        this.platforms = data.platforms || this.getDefaultPlatforms();
        this.stars = data.stars || this.getDefaultStars();
        this.enemies = data.enemies || this.getDefaultEnemies();
        this.playerSpawn = data.playerSpawn || { x: 100, y: 450 };
        this.gravity = data.gravity || 300;
        this.timeLimit = data.timeLimit || null; // null = sem limite
        this.maxScore = data.maxScore || 0;
        this.completed = data.completed || false;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.customSettings = data.customSettings || {};

        // Campos específicos para jogo top-down (multiplayer)
        this.gameType = data.gameType || 'platformer'; // 'platformer' ou 'topdown'
        this.buildings = data.buildings || [];
        this.roads = data.roads || [];
        this.obstacles = data.obstacles || [];
        this.water = data.water || [];
        this.npcs = data.npcs || [];
        this.collectibles = data.collectibles || [];
        this.terrain = data.terrain || null;
        this.skyColor = data.skyColor || this.backgroundColor;
        this.completions = data.completions || 0;
        this.bestTime = data.bestTime || 0;
        this.updatedAt = data.updatedAt || this.createdAt;
    }

    /**
     * Gera um ID único para o mapa
     */
    generateId() {
        return 'map_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Plataformas padrão
     */
    getDefaultPlatforms() {
        return [
            { x: 400, y: 568, scaleX: 2, scaleY: 1, type: 'ground' },
            { x: 600, y: 400, scaleX: 1, scaleY: 1, type: 'floating' },
            { x: 50, y: 250, scaleX: 1, scaleY: 1, type: 'floating' },
            { x: 750, y: 220, scaleX: 1, scaleY: 1, type: 'floating' }
        ];
    }

    /**
     * Estrelas padrão
     */
    getDefaultStars() {
        return {
            count: 12,
            startX: 12,
            startY: 0,
            stepX: 70,
            bounceY: { min: 0.4, max: 0.8 },
            velocity: { minX: -200, maxX: 200, y: 20 },
            points: 10
        };
    }

    /**
     * Inimigos padrão
     */
    getDefaultEnemies() {
        return [
            { x: 700, y: 300, velocityX: -100, velocityY: 0, type: 'basic' },
            { x: 100, y: 200, velocityX: 100, velocityY: 0, type: 'basic' }
        ];
    }

    /**
     * Adiciona uma plataforma
     */
    addPlatform(platform) {
        this.platforms.push(platform);
    }

    /**
     * Remove uma plataforma
     */
    removePlatform(index) {
        if (index >= 0 && index < this.platforms.length) {
            this.platforms.splice(index, 1);
        }
    }

    /**
     * Adiciona um inimigo
     */
    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    /**
     * Remove um inimigo
     */
    removeEnemy(index) {
        if (index >= 0 && index < this.enemies.length) {
            this.enemies.splice(index, 1);
        }
    }

    /**
     * Atualiza configuração de estrelas
     */
    updateStars(starConfig) {
        this.stars = { ...this.stars, ...starConfig };
    }

    /**
     * Define o ponto de spawn do jogador
     */
    setPlayerSpawn(x, y) {
        this.playerSpawn = { x, y };
    }

    /**
     * Marca o mapa como completo
     */
    complete(score) {
        this.completed = true;
        if (score > this.maxScore) {
            this.maxScore = score;
        }
    }

    /**
     * Reseta o progresso do mapa
     */
    reset() {
        this.completed = false;
        this.maxScore = 0;
    }

    /**
     * Aumenta a dificuldade do mapa
     */
    increaseDifficulty() {
        this.level++;
        this.gravity += 50;
        
        // Adiciona mais inimigos conforme aumenta o nível
        if (this.level % 2 === 0) {
            const newEnemy = {
                x: Math.random() * this.width,
                y: Math.random() * this.height / 2,
                velocityX: (Math.random() > 0.5 ? 100 : -100) * (1 + this.level * 0.1),
                velocityY: 0,
                type: 'basic'
            };
            this.addEnemy(newEnemy);
        }

        // Atualiza dificuldade textual
        if (this.level < 3) this.difficulty = 'easy';
        else if (this.level < 6) this.difficulty = 'normal';
        else if (this.level < 10) this.difficulty = 'hard';
        else this.difficulty = 'extreme';
    }

    /**
     * Clona o mapa para criar uma variação
     */
    clone(newName) {
        const clonedData = { ...this.toJSON() };
        clonedData.id = null; // Será gerado um novo
        clonedData.name = newName || this.name + ' (Cópia)';
        clonedData.completed = false;
        clonedData.maxScore = 0;
        return new Map(clonedData);
    }

    /**
     * Retorna objeto JSON para serialização
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            level: this.level,
            difficulty: this.difficulty,
            width: this.width,
            height: this.height,
            backgroundColor: this.backgroundColor,
            platforms: this.platforms,
            stars: this.stars,
            enemies: this.enemies,
            playerSpawn: this.playerSpawn,
            gravity: this.gravity,
            timeLimit: this.timeLimit,
            maxScore: this.maxScore,
            completed: this.completed,
            createdAt: this.createdAt,
            customSettings: this.customSettings,
            // Campos top-down
            gameType: this.gameType,
            buildings: this.buildings,
            roads: this.roads,
            obstacles: this.obstacles,
            water: this.water,
            npcs: this.npcs,
            collectibles: this.collectibles,
            terrain: this.terrain,
            skyColor: this.skyColor,
            completions: this.completions,
            bestTime: this.bestTime,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Cria um Map a partir de dados JSON
     */
    static fromJSON(json) {
        return new Map(json);
    }
}
