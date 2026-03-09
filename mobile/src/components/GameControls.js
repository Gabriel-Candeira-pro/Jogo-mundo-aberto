import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

export default function GameControls({ onMove }) {
  return (
    <View style={styles.container}>
      <View style={styles.controlsLayout}>
        {/* Controle UP */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onMove('up')}
          >
            <Text style={styles.buttonText}>▲</Text>
          </TouchableOpacity>
        </View>

        {/* Controles LEFT e RIGHT */}
        <View style={[styles.row, styles.middleRow]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onMove('left')}
          >
            <Text style={styles.buttonText}>◀</Text>
          </TouchableOpacity>
          
          <View style={styles.spacer} />
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => onMove('right')}
          >
            <Text style={styles.buttonText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Controle DOWN */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onMove('down')}
          >
            <Text style={styles.buttonText}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    zIndex: 100,
  },
  controlsLayout: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  middleRow: {
    marginVertical: 10,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(108, 99, 255, 0.8)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  spacer: {
    width: 60,
  },
});
