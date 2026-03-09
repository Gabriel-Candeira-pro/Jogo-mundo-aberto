import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GAME_CONFIG } from '../config/config';

export default function GameCanvas({ gameData, playerPosition, activePlayers }) {
  if (!gameData || !gameData.map) {
    return <View style={styles.container} />;
  }

  const tileSize = GAME_CONFIG.TILE_SIZE;
  const canvasWidth = GAME_CONFIG.MAP_WIDTH * tileSize;
  const canvasHeight = GAME_CONFIG.MAP_HEIGHT * tileSize;

  const renderMap = () => {
    const tiles = [];
    const mapTiles = gameData.map.tiles || [];

    for (let y = 0; y < GAME_CONFIG.MAP_HEIGHT; y++) {
      for (let x = 0; x < GAME_CONFIG.MAP_WIDTH; x++) {
        const index = y * GAME_CONFIG.MAP_WIDTH + x;
        const tileType = mapTiles[index] || 0;
        
        const color = tileType === 0 ? '#4ade80' : '#374151';
        
        tiles.push(
          <View
            key={`tile-${x}-${y}`}
            style={{
              position: 'absolute',
              left: x * tileSize,
              top: y * tileSize,
              width: tileSize,
              height: tileSize,
              backgroundColor: color,
            }}
          />
        );
      }
    }
    return tiles;
  };

  const renderPlayers = () => {
    const players = [];

    // Renderizar jogador atual
    players.push(
      <View
        key="player"
        style={{
          position: 'absolute',
          left: playerPosition.x * tileSize,
          top: playerPosition.y * tileSize,
          width: tileSize,
          height: tileSize,
          backgroundColor: '#3b82f6',
        }}
      />
    );

    // Renderizar outros jogadores
    activePlayers.forEach((player, index) => {
      if (player.position) {
        players.push(
          <View
            key={`other-player-${index}`}
            style={{
              position: 'absolute',
              left: player.position.x * tileSize,
              top: player.position.y * tileSize,
              width: tileSize,
              height: tileSize,
              backgroundColor: '#ef4444',
            }}
          />
        );
      }
    });

    return players;
  };

  return (
    <View style={styles.container}>
      <View style={{ width: canvasWidth, height: canvasHeight, position: 'relative' }}>
        {renderMap()}
        {renderPlayers()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
