import { APIService } from './APIService';
import { API_CONFIG, GAME_CONFIG } from '../config/config';

export class GameService {
  constructor(userData) {
    this.userData = userData;
    this.character = null;
    this.map = null;
  }

  async initialize() {
    try {
      // Carregar dados do personagem
      const characterData = await APIService.get(
        `${API_CONFIG.ENDPOINTS.GET_CHARACTER}/${this.userData.userId}`
      );
      
      // Carregar mapa global
      const mapData = await APIService.get(API_CONFIG.ENDPOINTS.GET_MAP);
      
      this.character = characterData;
      this.map = mapData;
      
      return {
        character: characterData,
        map: mapData,
      };
    } catch (error) {
      console.error('Erro ao inicializar jogo:', error);
      throw error;
    }
  }

  async movePlayer(direction) {
    const currentPos = this.character.position;
    let newX = currentPos.x;
    let newY = currentPos.y;

    switch (direction) {
      case 'up':
        newY -= 1;
        break;
      case 'down':
        newY += 1;
        break;
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
    }

    // Verificar colisão
    if (this.checkCollision(newX, newY)) {
      return null;
    }

    // Atualizar posição no servidor
    try {
      await APIService.put(API_CONFIG.ENDPOINTS.UPDATE_POSITION, {
        userId: this.userData.userId,
        position: { x: newX, y: newY },
      });

      this.character.position = { x: newX, y: newY };
      return { x: newX, y: newY };
    } catch (error) {
      console.error('Erro ao atualizar posição:', error);
      return null;
    }
  }

  checkCollision(x, y) {
    if (!this.map || !this.map.tiles) return true;

    // Verificar limites do mapa
    if (x < 0 || x >= GAME_CONFIG.MAP_WIDTH || 
        y < 0 || y >= GAME_CONFIG.MAP_HEIGHT) {
      return true;
    }

    // Verificar tile de colisão
    const tileIndex = y * GAME_CONFIG.MAP_WIDTH + x;
    const tile = this.map.tiles[tileIndex];
    
    return tile === 1; // 1 = tile com colisão
  }

  async getActivePlayers() {
    try {
      const players = await APIService.get(API_CONFIG.ENDPOINTS.GET_PLAYERS);
      return players.filter(p => p.userId !== this.userData.userId);
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
      return [];
    }
  }

  cleanup() {
    // Limpar recursos se necessário
    this.character = null;
    this.map = null;
  }

    async fetchMapForPosition(position) {
      try {
        // Definir tamanho do chunk (exemplo: 16x16 tiles)
        const CHUNK_WIDTH = 16;
        const CHUNK_HEIGHT = 16;
        // Calcular chunkX e chunkY
        const chunkX = Math.floor(position.x / CHUNK_WIDTH);
        const chunkY = Math.floor(position.y / CHUNK_HEIGHT);
        // Buscar chunk no backend
        const mapData = await APIService.get(`/api/map/chunk?x=${chunkX}&y=${chunkY}`);
        this.map = mapData;
        return mapData;
      } catch (error) {
        console.error('Erro ao buscar mapa para posição:', error);
        return null;
      }
    }
}
