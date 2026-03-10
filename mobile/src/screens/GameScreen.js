import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameCanvas from '../components/GameCanvas';
import GameControls from '../components/GameControls';
import GameHUD from '../components/GameHUD';
import { GameService } from '../services/GameService';

export default function GameScreen({ userData, onLogout }) {
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [activePlayers, setActivePlayers] = useState([]);
  const gameServiceRef = useRef(null);

  useEffect(() => {
    initializeGame();
    
    // Atualização periódica dos jogadores online
    const interval = setInterval(updateActivePlayers, 2000);
    
    return () => {
      clearInterval(interval);
      if (gameServiceRef.current) {
        gameServiceRef.current.cleanup();
      }
    };
  }, []);

  const initializeGame = async () => {
    try {
      gameServiceRef.current = new GameService(userData);
      const data = await gameServiceRef.current.initialize();
      setGameData(data);
      setPlayerPosition(data.character.position);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao inicializar jogo:', error);
      Alert.alert('Erro', 'Não foi possível carregar o jogo');
    }
  };

  const updateActivePlayers = async () => {
    if (gameServiceRef.current) {
      const players = await gameServiceRef.current.getActivePlayers();
      setActivePlayers(players || []);
    }
  };

  const handleMove = async (direction) => {
    if (gameServiceRef.current) {
      const newPosition = await gameServiceRef.current.movePlayer(direction);
      if (newPosition) {
        setPlayerPosition(newPosition);
        // Buscar novo mapa/chunk para a posição
        const newMap = await gameServiceRef.current.fetchMapForPosition(newPosition);
        if (newMap) {
          setGameData(prev => ({ ...prev, map: newMap }));
        }
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do jogo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: onLogout, style: 'destructive' },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GameHUD
        username={userData.username}
        playerCount={activePlayers.length}
        onLogout={handleLogout}
      />
      
      <GameCanvas
        gameData={gameData}
        playerPosition={playerPosition}
        activePlayers={activePlayers}
      />
      
      <GameControls onMove={handleMove} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
});
