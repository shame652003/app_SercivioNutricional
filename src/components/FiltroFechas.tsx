import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';

interface Props {
  fechaInicio: Date | undefined;
  fechaFin: Date | undefined;
  setFechaInicio: (date: Date | undefined) => void;
  setFechaFin: (date: Date | undefined) => void;
}

export default function FiltroFechas({
  fechaInicio,
  fechaFin,
  setFechaInicio,
  setFechaFin,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.fechasRow}>
        <View style={styles.fechaBox}>
          <Text style={styles.label}>Desde</Text>
          <DatePickerInput
            locale="es"
            label="Inicio"
            value={fechaInicio}
            onChange={setFechaInicio}
            inputMode="start"
            style={styles.dateInput}
          />
        </View>

        <View style={styles.fechaBox}>
          <Text style={styles.label}>Hasta</Text>
          <DatePickerInput
            locale="es"
            label="Fin"
            value={fechaFin}
            onChange={setFechaFin}
            inputMode="end"
            style={styles.dateInput}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    paddingBottom: 10,
  },
  fechasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  fechaBox: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0066CC',
    marginBottom: 4,
  },
  dateInput: {
    backgroundColor: '#f2f6fb',
    borderRadius: 8,
  },
});
