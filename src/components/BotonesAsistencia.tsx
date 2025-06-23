import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onConfirmar: () => void;
  onCancelar: () => void;
  disabled?: boolean;
}

export default function BotonesAsistencia({ onConfirmar, onCancelar, disabled }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onConfirmar}
        disabled={disabled}
      >
        <Ionicons name="checkmark-circle-outline" size={22} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.text}>Confirmar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancelar}>
        <Ionicons name="close-circle-outline" size={22} color="#0066CC" style={{ marginRight: 6 }} />
        <Text style={[styles.text, { color: '#0066CC' }]}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buttonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  cancel: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0066CC',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
