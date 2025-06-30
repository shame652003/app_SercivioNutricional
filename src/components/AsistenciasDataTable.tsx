import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { exportAsistenciasToPdf } from '../hooks/useExportPdf';
import useAsistenciasData from '../hooks/useAsistenciasData';
import { showMessage } from 'react-native-flash-message';

const accent = '#0066CC';
const accentLight = '#3399FF';
const accentDark = '#003366';
const backgroundCard = '#f8fbff';
const successColor = '#10b981';
const warningColor = '#f59e0b';

const AsistenciasDataTable = () => {
  const {
    search,
    setSearch,
    page,
    pageCount,
    paginatedData,
    filteredData,
    handleChangePage,
    loading,
    isEmpty,
    error
  } = useAsistenciasData();

  // Renderizar cada tarjeta de estudiante
  const renderStudentCard = ({ item, index }) => (
    <View style={styles.studentCard}>
      {/* Header de la tarjeta con ícono de usuario */}
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={24} color="#fff" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.studentName} numberOfLines={2}>
            {item.nombre}
          </Text>
          <View style={styles.cedulaContainer}>
            <MaterialIcons name="badge" size={16} color={accent} />
            <Text style={styles.cedulaText}>{item.cedula}</Text>
          </View>
        </View>
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>#{index + 1 + (page * 10)}</Text>
        </View>
      </View>

      {/* Información principal */}
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="school" size={20} color={accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Carrera</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {item.carrera}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="schedule" size={20} color={successColor} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Horario de Comida</Text>
            <View style={styles.horarioContainer}>
              <Text style={styles.horarioText}>{item.horario}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer con línea decorativa */}
      <View style={styles.cardFooter}>
        <View style={styles.decorativeLine} />
      </View>
    </View>
  );

  // Exportar PDF con validación
  const handleExportPdf = async () => {
    try {
      if (!filteredData || filteredData.length === 0) {
        showMessage({
          message: 'Sin datos',
          description: 'No hay datos para exportar.',
          type: 'danger',
        });
        return;
      }
      await exportAsistenciasToPdf(filteredData);
    } catch (err) {
      showMessage({
        message: 'Error',
        description: err?.message || 'No se pudo exportar el PDF.',
        type: 'danger',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con título y botón de exportar */}
      <View style={styles.headerSection}>
        <View style={styles.titleContainer}>
          
          <Text style={styles.title}>Asistencias Registradas</Text>
        </View>
        <TouchableOpacity 
          style={styles.exportButton} 
          onPress={handleExportPdf} 
          accessibilityLabel="Exportar a PDF"
        >
          <MaterialIcons name="picture-as-pdf" size={24} color="#fff" />
          <Text style={styles.exportButtonText}>PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda mejorada */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={22} color={accentLight} />
          <TextInput
            placeholder="Buscar por cédula, nombre o carrera..."
            placeholderTextColor={accentLight}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="clear" size={20} color={accentLight} />
            </TouchableOpacity>
          )}
        </View>
        {(search ? filteredData : paginatedData)?.length > 0 && (
          <View style={styles.resultsCounter}>
            <Text style={styles.resultsText}>
              {search ? filteredData.length : paginatedData.length} estudiante{(search ? filteredData.length : paginatedData.length) !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Lista de estudiantes */}
      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={accent} />
            <Text style={styles.emptyText}>Cargando asistencias...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="error-outline" size={48} color="#ef4444" />
            <Text style={[styles.emptyText, { color: '#ef4444' }]}>
              {error}
            </Text>
            <TouchableOpacity style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : isEmpty ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="people-outline" size={48} color={accentLight} />
            <Text style={styles.emptyText}>No hay asistencias registradas</Text>
            <Text style={styles.emptySubtext}>
              Los registros aparecerán aquí cuando se agreguen estudiantes
            </Text>
          </View>
        ) : (
          <FlatList
            data={search ? filteredData : paginatedData}
            renderItem={renderStudentCard}
            keyExtractor={(_, idx) => idx.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>

      {/* Paginación mejorada */}
      {!search && !loading && !error && !isEmpty && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.paginationButton, page === 0 && styles.paginationButtonDisabled]}
            onPress={() => handleChangePage(false)}
            disabled={page === 0}
          >
            <MaterialIcons 
              name="chevron-left" 
              size={24} 
              color={page === 0 ? accentLight : '#fff'} 
            />
          </TouchableOpacity>
          
          <View style={styles.pageInfo}>
            <Text style={styles.pageNumber}>{page + 1}</Text>
            <Text style={styles.pageTotal}>de {pageCount}</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.paginationButton, page === pageCount - 1 && styles.paginationButtonDisabled]}
            onPress={() => handleChangePage(true)}
            disabled={page === pageCount - 1}
          >
            <MaterialIcons 
              name="chevron-right" 
              size={24} 
              color={page === pageCount - 1 ? accentLight : '#fff'} 
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  
  },
  
  // Header Section
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: accent,
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: accentDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },

  // Search Section
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    paddingVertical: 12,
    marginLeft: 8,
  },
  resultsCounter: {
    alignItems: 'center',
    marginTop: 8,
  },
  resultsText: {
    fontSize: 14,
    color: accentLight,
    fontWeight: '500',
  },

  // List Container
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },

  // Student Card
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  avatarContainer: {
    backgroundColor: accent,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  cedulaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cedulaText: {
    fontSize: 14,
    color: accent,
    fontWeight: '600',
    marginLeft: 4,
  },
  indexBadge: {
    backgroundColor: backgroundCard,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: accentLight,
  },
  indexText: {
    fontSize: 12,
    color: accent,
    fontWeight: '600',
  },

  // Card Body
  cardBody: {
    
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
    lineHeight: 22,
  },
  horarioContainer: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  horarioText: {
    fontSize: 14,
    color: successColor,
    fontWeight: '600',
  },

  // Card Footer
  cardFooter: {
    padding: 16,
    paddingTop: 0,
  },
  decorativeLine: {
    height: 3,
    backgroundColor: accent,
    borderRadius: 2,
    width: '20%',
  },

  // Empty States
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Pagination
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paginationButton: {
    backgroundColor: accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: '#e2e8f0',
  },
  pageInfo: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  pageNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: accent,
  },
  pageTotal: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
});

export default AsistenciasDataTable;