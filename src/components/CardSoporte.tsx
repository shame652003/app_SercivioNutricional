import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface CardSoporteProps {
  titulo: string;
  icono: string;
  onPress: () => void;
}

export default function CardSoporte({ titulo, icono, onPress }: CardSoporteProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icono} size={40} color="#007bff" />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      <Icon name="chevron-forward-outline" size={24} color="#aaa" style={styles.arrow} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 15,
    backgroundColor: '#e6f2ff', 
    padding: 8,
    borderRadius: 8,
  },
  titulo: {
    flex: 1, 
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  arrow: {
    marginLeft: 10,
  }
});