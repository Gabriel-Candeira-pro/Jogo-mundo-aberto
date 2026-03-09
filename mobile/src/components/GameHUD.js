import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GameHUD({ username, playerCount, onLogout }) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.username}>👤 {username}</Text>
        <Text style={styles.playerCount}>
          🌐 {playerCount} jogador{playerCount !== 1 ? 'es' : ''} online
        </Text>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#6c63ff',
  },
  info: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  playerCount: {
    color: '#aaa',
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
