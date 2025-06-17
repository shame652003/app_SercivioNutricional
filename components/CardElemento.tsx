import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';

interface CardElementoProps {
  nombre: string;
  marca?: string;
  stock: number;
  imagenUri: ImageSourcePropType;
  onPress?: () => void;
  style?: object;
  tituloCantidad?: string;
}

export default function CardElemento({ nombre, marca, stock, tituloCantidad, imagenUri, onPress, style }: CardElementoProps) {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.7}>
      <Image source={imagenUri} style={styles.imagen} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.nombre} numberOfLines={1} ellipsizeMode="tail">
              {nombre}
            </Text>
            {marca ? <Text style={styles.marca} numberOfLines={1} ellipsizeMode="tail">{marca}</Text> : null}
          </View>
          <View style={styles.stockCircle}>
            <Text style={styles.stockValue}>{stock}</Text>
            <Text style={styles.stockLabel}>{tituloCantidad}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
  imagen: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoContainer: {
    width: '100%',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#444',
  },
  marca: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  stockCircle: {
    backgroundColor: '#0066CC',
    borderColor: '#01154d',
    borderRadius: 32,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    paddingVertical: 2,
  },
  stockValue: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 20,
  },
  stockLabel: {
    color: 'white',
    fontSize: 11,
    marginTop: 1,
  },
});
