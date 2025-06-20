import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onScan: (cedula: string) => void;
}

// Simulación: en una app real usarías expo-barcode-scanner o similar
export default function QRScanner({ onScan }: Props) {
  const handleFakeScan = () => {
    // Simula un escaneo exitoso
    onScan('12345678');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleFakeScan}>
      <Ionicons name="qr-code-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
      <Text style={styles.text}>Escanear QR</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
