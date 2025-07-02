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

export default function AlimentoItem({ alimento }: Props) {
 
  return (
    <View style={styles.alimentoItem}>
      <Image source={{ uri: API_URL + alimento.imgAlimento}} style={styles.imagen} />
      <Text style={styles.nombre} numberOfLines={1}>
        {alimento.nombre}
      </Text>
      <Text style={styles.marca} numberOfLines={1}>
        {alimento.marca}
      </Text>
      <Text style={styles.cantidad}>{alimento.cantidad}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alimentoItem: {
    width: '48%',
    backgroundColor: '#eef4fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  imagen: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
    textAlign: 'center',
  },
  marca: {
    fontSize: 13,
    color: '#555',
  },
  cantidad: {
    fontSize: 13,
    color: '#008000',
    marginTop: 4,
  },
});
