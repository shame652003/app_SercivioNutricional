import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type HorarioComida = 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena';

interface HorarioComidaSelectProps {
  selectedValue: HorarioComida;
  onValueChange: (value: HorarioComida) => void;
}

export default function HorarioComidaSelect({ selectedValue, onValueChange }: HorarioComidaSelectProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => onValueChange(itemValue as HorarioComida)}
          style={styles.picker}
          dropdownIconColor="#0066CC"
        >
          <Picker.Item label="Desayuno" value="Desayuno" />
          <Picker.Item label="Almuerzo" value="Almuerzo" />
          <Picker.Item label="Merienda" value="Merienda" />
          <Picker.Item label="Cena" value="Cena" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#3399FF',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  pickerContainer: {
    width: '100%',
    padding: 0,
    margin: 0,
  },
  picker: {
    color: '#333',
    width: '100%',
    padding: 0,
    margin: 0,
  },
});