// Configuração de API - conecta ao mesmo backend do projeto web
export const API_CONFIG = {
  // URL base do servidor - ajustar conforme ambiente
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000'  // Desenvolvimento local
    : 'https://seu-dominio.com', // Produção
  
  // Endpoints
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VALIDATE_TOKEN: '/api/auth/validate',
    GET_CHARACTER: '/api/character',
    UPDATE_POSITION: '/api/character/position',
    GET_MAP: '/api/map',
    GET_PLAYERS: '/api/players/active',
  },
  
  // Timeouts
  TIMEOUT: 10000,
};

// Configuração do jogo
export const GAME_CONFIG = {
  TILE_SIZE: 32,
  MAP_WIDTH: 25,
  MAP_HEIGHT: 15,
  
  // Performance mobile
  MAX_FPS: 60,
  PHYSICS_FPS: 60,
  
  // Otimizações mobile
  ENABLE_PIXEL_ART: true,
  ANTIALIAS: false,
  ROUND_PIXELS: true,
};
