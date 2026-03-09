import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/LoginScreen';
import GameScreen from './screens/GameScreen';
import { AuthService } from './services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Valida o token com o servidor
        const isValid = await AuthService.validateToken(token);
        if (isValid) {
          const user = await AsyncStorage.getItem('userData');
          setUserData(user ? JSON.parse(user) : null);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const result = await AuthService.login(username, password);
      if (result.success) {
        await AsyncStorage.setItem('authToken', result.token);
        await AsyncStorage.setItem('userData', JSON.stringify(result.user));
        setUserData(result.user);
        setIsLoggedIn(true);
      }
      return result;
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro ao conectar com servidor' };
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserData(null);
  };

  if (isLoading) {
    return null; // Ou um splash screen
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {isLoggedIn ? (
        <GameScreen userData={userData} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </SafeAreaProvider>
  );
}
