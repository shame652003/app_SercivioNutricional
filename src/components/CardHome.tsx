import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';  
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Info {
  title: string;
  cantidad?: string;
  icon?: string;
  icon2?: string;
  onPress?: () => void;
  style?: object; 
}
export default function CardHome(props: Info) {
  return (
    <TouchableOpacity 
      style={[styles.card, props.style]} // <-- agregar aquí props.style para combinar estilos
      onPress={props.onPress} 
      activeOpacity={0.7}
    >
      {props.icon && <FontAwesome name={props.icon} size={70} color="#0066CC" />}
      {props.icon2 && <MaterialCommunityIcons name={props.icon2} size={70} color="#0066CC" />}
      <Text style={styles.cardTitle}>{props.title}</Text>
      <Text style={styles.cardValue}>{props.cantidad}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: '#00000054',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    color: "#0066CC",
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  cardValue: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#bbb",
    textAlign: 'center'
  },
});
