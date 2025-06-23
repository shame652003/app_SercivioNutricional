import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChange: (text: string) => void;
  onScanQR?: () => void;
  editable?: boolean;
}

export default function CedulaInput({ value, onChange, onScanQR, editable = true }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="card-outline" size={24} color="#0066CC" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Cédula del estudiante"
          keyboardType="numeric"
          value={value}
          onChangeText={onChange}
          editable={editable}
          placeholderTextColor="#999"
        />
      </View>
      {onScanQR && (
        <TouchableOpacity onPress={onScanQR} style={styles.qrButton}>
          <Ionicons name="qr-code-outline" size={24} color="#0066CC" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3399FF',
    padding: 8,
    marginVertical: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  qrButton: {
    marginLeft: 8,
    padding: 4,
  },
});
