import { APIService } from './APIService';
import { API_CONFIG } from '../config/config';

export class AuthService {
  static async login(username, password) {
    try {
      const response = await APIService.post(API_CONFIG.ENDPOINTS.LOGIN, {
        username,
        password,
      });
      
      return {
        success: true,
        token: response.token,
        user: response.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login',
      };
    }
  }

  static async register(username, password) {
    try {
      const response = await APIService.post(API_CONFIG.ENDPOINTS.REGISTER, {
        username,
        password,
      });
      
      return {
        success: true,
        token: response.token,
        user: response.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao registrar',
      };
    }
  }

  static async validateToken(token) {
    try {
      await APIService.post(API_CONFIG.ENDPOINTS.VALIDATE_TOKEN, { token });
      return true;
    } catch (error) {
      return false;
    }
  }
}
