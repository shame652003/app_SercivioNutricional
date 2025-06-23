import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { exportAsistenciasToPdf } from './useExportPdf';
import { useAsistenciasData } from '../hooks/useAsistenciasData';

const accent = '#0066CC';
const accentLight = '#3399FF';
const accentDark = '#003366';

const AsistenciasDataTable = () => {
  const {
    search,
    setSearch,
    page,
    pageCount,
    paginatedData,
    filteredData,
    handleChangePage,
  } = useAsistenciasData();

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, { flex: 1.1 }]}>Cédula</Text>
      <Text style={[styles.headerCell, { flex: 2 }]}>Nombre y Apellido</Text>
      <Text style={[styles.headerCell, { flex: 2 }]}>Carrera</Text>
      <Text style={[styles.headerCell, { flex: 1.3 }]}>Horario de Comida</Text>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.dataRow,
        { backgroundColor: index % 2 === 0 ? '#fff' : '#f6faff' },
      ]}
    >
      <Text style={[styles.cell, { flex: 1.1 }]}>{item.cedula}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.nombre}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.carrera}</Text>
      <Text style={[styles.cell, { flex: 1.3 }]}>{item.horario}</Text>
    </View>
  );

  // Exportar PDF con validación
  const handleExportPdf = async () => {
    try {
      if (!filteredData || filteredData.length === 0) {
        Alert.alert('Sin datos', 'No hay datos para exportar.');
        return;
      }
      await exportAsistenciasToPdf(filteredData);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo exportar el PDF.');
    }
  };

  return (
    <View style={styles.cardWrap}>
      <View style={styles.headerRowWrap}>
        <Text style={styles.title}>Listado de Asistencias</Text>
        <TouchableOpacity style={styles.pdfBtn} onPress={handleExportPdf} accessibilityLabel="Exportar a PDF">
          <MaterialIcons name="picture-as-pdf" size={26} color={accent} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={22} color={accentLight} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Buscar por cédula, nombre o carrera"
          placeholderTextColor={accentLight}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <View style={styles.tableWrap}>
        {renderHeader()}
        <FlatList
          data={paginatedData}
          renderItem={renderItem}
          keyExtractor={(_, idx) => idx.toString()}
          scrollEnabled={false}
          style={{ minHeight: 220 }}
        />
      </View>
      <View style={styles.paginationWrap}>
        <TouchableOpacity
          style={[styles.pageBtn, page === 0 && styles.pageBtnDisabled]}
          onPress={() => handleChangePage(false)}
          disabled={page === 0}
        >
          <MaterialIcons name="chevron-left" size={24} color={page === 0 ? accentLight : accent} />
        </TouchableOpacity>
        <Text style={styles.pageText}>{`Página ${page + 1} de ${pageCount}`}</Text>
        <TouchableOpacity
          style={[styles.pageBtn, page === pageCount - 1 && styles.pageBtnDisabled]}
          onPress={() => handleChangePage(true)}
          disabled={page === pageCount - 1}
        >
          <MaterialIcons name="chevron-right" size={24} color={page === pageCount - 1 ? accentLight : accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrap: {
    borderRadius: 18,
   
  },
  headerRowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pdfBtn: {
    backgroundColor: '#f6faff',
    borderRadius: 8,
    padding: 7,
    borderWidth: 1,
    borderColor: accentLight,
    marginLeft: 8,
    shadowColor: accentDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: accent,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6faff',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: accentLight,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: accentDark,
    backgroundColor: 'transparent',
  },
  tableWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: accentLight,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: accent,
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: accentDark,
    shadowOpacity: 0.05,
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  cell: {
    fontSize: 15,
    color: accentDark,
    textAlign: 'center',
  },
  paginationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  pageBtn: {
    backgroundColor: '#f6faff',
    borderRadius: 8,
    padding: 6,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: accentLight,
  },
  pageBtnDisabled: {
    opacity: 0.5,
  },
  pageText: {
    fontSize: 15,
    color: accent,
    marginHorizontal: 10,
  },
});

export default AsistenciasDataTable;
