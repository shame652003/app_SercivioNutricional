// AlimentoItem.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { API_URL} from '@env';

type Alimento = {
  idAlimento: number;
  imgAlimento?: string;
  nombre: string;
  marca: string;
  cantidad: string;
};

interface Props {
  alimento: Alimento;
}

const COLORS = {
  BLUE: '#0066CC',
  GRAY_DEFAULT: '#ccc',
  WHITE: '#fff',
  BLACK: '#000',
};

export default function AlimentoItem({ alimento }: Props) {
  
  return (
    <View style={styles.alimentoItem}>
      <Image 
        source={{ uri: API_URL + alimento.imgAlimento}} 
        style={styles.imagen} 
        resizeMode="contain"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.nombre} numberOfLines={2}>
          {alimento.nombre}
        </Text>
        <Text style={styles.marca} numberOfLines={1}>
          {alimento.marca}
        </Text>
        <Text style={styles.cantidad}>{alimento.cantidad}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alimentoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.GRAY_DEFAULT,
    backgroundColor: COLORS.WHITE,
  },
  imagen: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: COLORS.GRAY_DEFAULT,
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.BLUE,
  },
  marca: {
    fontSize: 14,
    color: COLORS.BLACK,
    opacity: 0.7,
  },
  cantidad: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.BLUE,
    marginTop: 2,
  },
});