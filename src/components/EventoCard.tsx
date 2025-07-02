import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {FontAwesome5 } from '@expo/vector-icons';
import { Evento } from '../hooks/useEvento';

interface Props {
  evento: Evento;
  onPress: () => void;
}

function formatDate(fecha: string) {
  const [year, month, day] = fecha.split('T')[0].split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayStr = date.getDate().toString().padStart(2, '0');
  const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
  const yearStr = date.getFullYear();
  return `${dayStr}/${monthStr}/${yearStr}`;
}

export default function EventoCard({ evento, onPress }: Props) {
  return (
    <Pressable style={styles.eventoCard} onPress={onPress}>
      <View style={styles.eventoRow}>
        <FontAwesome5 name="landmark"	 size={18} color="#0066CC" />
        <Text style={styles.eventoLabel}> Nombre del Evento:</Text>
        <Text style={styles.eventoValue}> {evento.nomEvent}</Text>
      </View>


      <View style={styles.eventoRow}>
        <FontAwesome5 name="calendar-alt" size={18} color="#0066CC" />
        <Text style={styles.eventoLabel}> Fecha:</Text>
        <Text style={styles.eventoValue}> {formatDate(evento.feMenu)}</Text>
      </View>

      <View style={styles.eventoRow}>
        <FontAwesome5 name="clock" size={18} color="#0066CC" />
        <Text style={styles.eventoLabel}> Horario:</Text>
        <Text style={styles.eventoValue}> {evento.horarioComida}</Text>
      </View>

      <View style={styles.eventoRow}>
        <FontAwesome5 name="utensils" size={18} color="#0066CC" />
        <Text style={styles.eventoLabel}> Plato:</Text>
        <Text style={styles.eventoValue}> {evento.cantPlatos}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eventoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 20,
    marginBottom: 13,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  eventoTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0066CC',
    textAlign: 'center',
    marginBottom: 12,
  },
  eventoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0066CC',
    marginLeft: 6,
  },
  eventoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    marginLeft: 4,
  },
  eventoHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
