import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  platos: number;
}

export default function PlatosDisponibles({ platos }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="restaurant-outline" size={22} color="#0066CC" style={{ marginRight: 6 }} />
      <Text style={styles.text}>Platos disponibles: <Text style={{ fontWeight: 'bold', color: platos > 0 ? '#0066CC' : 'red' }}>{platos}</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3399FF',
    padding: 8,
    marginVertical: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
