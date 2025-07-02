import React from 'react';
import {View, Text,StyleSheet,ActivityIndicator,Button,} from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import Card from '../components/Card';
import Buscador from '../components/Buscador';
import useEventoValidation from '../hooks/useEvento';

import EventoCard from '../components/EventoCard';
import EventoModal from '../components/EventoModal';
import FiltroFechas from '../components/FiltroFechas';

export default function EventosScreen({ navigation }) {
  const {
    searchText,
    setSearchText,
    modalVisible,
    eventoSeleccionadoInfo,
    alimentosDelEvento,
    alimentosPorTipo,
    eventoFiltrados,
    seleccionarEvento,
    cerrarModal,
    loadingEvento,
    loadingAlimentos,
    showDateFilter,
    setShowDateFilter,
    fechaInicioFiltro,
    setFechaInicioFiltro,
    fechaFinFiltro,
    setFechaFinFiltro,
    ocultarFiltro,
    generarPdfPlano,
  } = useEventoValidation();

  return (
    <Container>
      <NavHead navigation={navigation} />
      <ContentContainer>
        <Header Titulo="Consultar Eventos" showSubtitle={false} />

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

        {loadingEvento ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#002c5f" />
            <Text style={{ marginTop: 10, color: '#002c5f' }}>
              Cargando eventos...
            </Text>
          </View>
        ) : eventoFiltrados.length === 0 ? (
          <Text style={styles.noResultsText}>No se encontraron eventos.</Text>
        ) : (
          <View style={styles.gridContainer}>
            {eventoFiltrados.map((evento, index) => (
              <EventoCard
                key={`${evento.idEvento.toString()}-${index}`}
                evento={evento}
                onPress={() => seleccionarEvento(evento)}
              />
            ))}
          </View>
        )}
      </ContentContainer>

      <BottomNavBar navigation={navigation} />

      {eventoSeleccionadoInfo && (
<EventoModal
  visible={modalVisible}
  eventoSeleccionado={eventoSeleccionadoInfo}
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
</EventoModal>

      )}
    </Container>
  );
}

const styles = StyleSheet.create({
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
});
