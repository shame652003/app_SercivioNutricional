import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface Menu {
  idMenu: number | string;
  feMenu: string;
  horarioComida: string;
  cantPlatos: number;
  descripcion: string;
}

interface Props {
  menu: Menu;
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



export default function MenuCard({ menu, onPress }: Props) {
  return (
    <Pressable style={styles.menuCard} onPress={onPress}>
      <View style={styles.menuHeaderAlternative}>
        <Text style={styles.menuTitulo}>Menú</Text>
      </View>

      <View style={styles.menuRow}>
        <MaterialCommunityIcons name="calendar-month" size={18} color="#0066CC" />
        <Text style={styles.menuLabel}> Fecha:</Text>
        <Text style={styles.menuValue}> {formatDate(menu.feMenu)}</Text>

      </View>

      <View style={styles.menuRow}>
        <MaterialCommunityIcons name="clock-outline" size={18} color="#0066CC" />
        <Text style={styles.menuLabel}> Horario:</Text>
        <Text style={styles.menuValue}> {menu.horarioComida}</Text>
      </View>

      <View style={styles.menuRow}>
        <FontAwesome5 name="utensils" size={18} color="#0066CC" />
        <Text style={styles.menuLabel}> Platos:</Text>
        <Text style={styles.menuValue}> {menu.cantPlatos}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
    menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 20,
    marginBottom: 13, // <-- agrega espacio entre cards
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  menuTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0066CC',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0066CC',
    marginLeft: 6,
  },
  menuValue: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    marginLeft: 4,
  },
  menuHeaderAlternative: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 15,
},

});
