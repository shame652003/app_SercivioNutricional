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
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#3399FF',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 44,
    justifyContent: 'center',
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    color: '#333',
    paddingHorizontal: 8,
    minWidth: 120,
  },
});