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
  const date = new Date(fecha.split('T')[0]);
  const dayStr = date.getDate().toString().padStart(2, '0');
  const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
  const yearStr = date.getFullYear();
  return `${dayStr}/${monthStr}/${yearStr}`;
}

export default function MenuCard({ menu, onPress }: Props) {
  return (
    <Pressable style={styles.menuCard} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.menuTitle}>Menú del Día</Text>
        <Text style={styles.dateText}>{formatDate(menu.feMenu)}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.mainDetailsRow}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#0056b3" />
            <Text style={styles.detailLabel}>Horario</Text>
            <Text style={styles.detailValue}>{menu.horarioComida}</Text>
          </View>
          <View style={styles.detailItem}>
            <FontAwesome5 name="utensils" size={20} color="#0056b3" />
            <Text style={styles.detailLabel}>Platos</Text>
            <Text style={styles.detailValue}>{menu.cantPlatos}</Text>
          </View>
        </View>
        <View style={styles.descriptionRow}>
          <MaterialCommunityIcons name="food-variant" size={20} color="#0056b3" />
          <View style={styles.descriptionTextContainer}>
            <Text style={styles.descriptionLabel}>Descripción</Text>
            <Text style={styles.descriptionValue}>{menu.descripcion || 'Sin descripción'}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1.5,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
    marginBottom: 15,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3399FF',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailsContainer: {
    gap: 12,
  },
  mainDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#abd4fd3a',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0055cc',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#343a40',
    marginTop: 2,
    textAlign: 'center',
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#abd4fd3a',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  descriptionTextContainer: {
    flex: 1,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0055cc',
    textTransform: 'uppercase',
  },
  descriptionValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343a40',
    marginTop: 2,
  },
});