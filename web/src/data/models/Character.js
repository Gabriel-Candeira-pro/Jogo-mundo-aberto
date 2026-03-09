/**
 * Modelo de Personagem
 * Representa os dados e atributos de um personagem do jogo
 */
export class Character {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.name = data.name || 'Jogador';
        this.level = data.level || 1;
        this.health = data.health || 100;
        this.maxHealth = data.maxHealth || 100;
        this.speed = data.speed || 160;
        this.jumpPower = data.jumpPower || 330;
        this.color = data.color || 0x00b300;
        this.experience = data.experience || 0;
        this.coins = data.coins || 0;
        this.powerUps = data.powerUps || [];
        this.skin = data.skin || 'default';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.lastPlayedAt = data.lastPlayedAt || new Date().toISOString();
    }

    /**
     * Gera um ID único para o personagem
     */
    generateId() {
        return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Adiciona experiência e faz level up se necessário
     */
    addExperience(amount) {
        this.experience += amount;
        const expNeeded = this.level * 100;
        
        if (this.experience >= expNeeded) {
            this.levelUp();
        }
    }

    /**
     * Aumenta o nível do personagem
     */
    levelUp() {
        this.level++;
        this.experience = 0;
        this.maxHealth += 10;
        this.health = this.maxHealth;
        this.speed += 5;
        this.jumpPower += 10;
    }

    /**
     * Adiciona moedas
     */
    addCoins(amount) {
        this.coins += amount;
    }

    /**
     * Recebe dano
     */
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        return this.health > 0;
    }

    /**
     * Cura o personagem
     */
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    /**
     * Adiciona um power-up
     */
    addPowerUp(powerUp) {
        if (!this.powerUps.includes(powerUp)) {
            this.powerUps.push(powerUp);
        }
    }

    /**
     * Remove um power-up
     */
    removePowerUp(powerUp) {
        this.powerUps = this.powerUps.filter(p => p !== powerUp);
    }

    /**
     * Atualiza o timestamp de última jogada
     */
    updateLastPlayed() {
        this.lastPlayedAt = new Date().toISOString();
    }

    /**
     * Retorna objeto JSON para serialização
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            level: this.level,
            health: this.health,
            maxHealth: this.maxHealth,
            speed: this.speed,
            jumpPower: this.jumpPower,
            color: this.color,
            experience: this.experience,
            coins: this.coins,
            powerUps: this.powerUps,
            skin: this.skin,
            createdAt: this.createdAt,
            lastPlayedAt: this.lastPlayedAt
        };
    }

    /**
     * Cria um Character a partir de dados JSON
     */
    static fromJSON(json) {
        return new Character(json);
    }
}
