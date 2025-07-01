import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Estudiante } from '../hooks/useCedulaInput';

interface Props {
  estudiante: Estudiante;
}

export default function EstudianteInfo({ estudiante }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name="person-circle-outline" size={28} color="#0066CC" style={{ marginRight: 8 }} />
        <Text style={styles.text}>{estudiante.nombre} {estudiante.apellido}</Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="school-outline" size={24} color="#3399FF" style={{ marginRight: 8 }} />
        <Text style={styles.text}>{estudiante.carrera}</Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="school-outline" size={24} color="#3399FF" style={{ marginRight: 8 }} />
        <Text style={styles.text}>{estudiante.seccion}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#3399FF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
