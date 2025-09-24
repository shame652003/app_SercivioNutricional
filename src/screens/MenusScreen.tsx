// MenusScreen.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import Card from '../components/Card';
import Buscador from '../components/Buscador';
import useMenusValidation from '../hooks/useMenu';
import MenuCard from '../components/MenuCard';
import MenuModal from '../components/MenuModal';
import FiltroFechas from '../components/FiltroFechas';

export default function MenusScreen({ navigation }) {
  const {
    searchText,
    setSearchText,
    modalVisible,
    menuSeleccionadoInfo,
    alimentosDelMenu,
    alimentosPorTipo,
    menusFiltrados,
    seleccionarMenu,
    cerrarModal,
    loadingMenus,
    loadingAlimentos,
    showDateFilter,
    setShowDateFilter,
    fechaInicioFiltro,
    setFechaInicioFiltro,
    fechaFinFiltro,
    setFechaFinFiltro,
    ocultarFiltro,
    generarPdfPlano,
    loadMoreMenus,
    hasMore,
  } = useMenusValidation(navigation);

  return (
    <Container>
      <NavHead navigation={navigation} />
      <ContentContainer>
        <Header Titulo="Consultar Menú" showSubtitle={false} />

        <Card style={styles.card}>
          <Buscador
            label="Buscar por fecha o horario"
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Ej: 2025-06-29 o Almuerzo"
            editable={!showDateFilter}
          />

          <Button
            title={showDateFilter ? 'Ocultar filtro de fecha' : 'Mostrar filtro de fecha'}
            onPress={() => {
              if (showDateFilter) {
                ocultarFiltro();
              } else {
                setShowDateFilter(true);
              }
            }}
          />

          {showDateFilter && (
            <FiltroFechas
              fechaInicio={fechaInicioFiltro}
              fechaFin={fechaFinFiltro}
              setFechaInicio={setFechaInicioFiltro}
              setFechaFin={setFechaFinFiltro}
            />
          )}
        </Card>

        {loadingMenus && menusFiltrados.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#002c5f" />
            <Text style={{ marginTop: 10, color: '#002c5f' }}>Cargando menú...</Text>
          </View>
        ) : menusFiltrados.length === 0 ? (
          <Text style={styles.noResultsText}>No se encontró ningún menú</Text>
        ) : (
          <View style={styles.gridContainer}>
            {menusFiltrados.map((menu, index) => (
              <MenuCard
                key={`${menu.idMenu.toString()}-${index}`}
                menu={menu}
                onPress={() => seleccionarMenu(menu)}
              />
            ))}
            {/* Botón de "Cargar más" */}
           {hasMore && (
    <TouchableOpacity
        onPress={loadMoreMenus}
        style={styles.loadMoreButton}
        activeOpacity={0.8}
        disabled={loadingMenus}
    >
        <Text style={styles.loadMoreText}>
            {loadingMenus ? 'Cargando...' : 'Cargar más menús'}
        </Text>
    </TouchableOpacity>
)}
          </View>
        )}
      </ContentContainer>

      <BottomNavBar navigation={navigation} />

      {menuSeleccionadoInfo && (
        <MenuModal
          visible={modalVisible}
          menuSeleccionado={menuSeleccionadoInfo}
          alimentosPorTipo={alimentosPorTipo}
          onClose={cerrarModal}
          generarPdf={generarPdfPlano}
        >
          {loadingAlimentos && (
            <View style={styles.loadingModal}>
              <ActivityIndicator size="large" color="#002c5f" />
              <Text style={{ marginTop: 10, color: '#002c5f' }}>Cargando detalles...</Text>
            </View>
          )}
        </MenuModal>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  //... (estilos existentes)
  card: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  loadingContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
 loadMoreButton: {
        backgroundColor: '#0055cc',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginHorizontal: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    loadMoreText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 1,
    },
});