import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView, TouchableOpacity } from 'react-native';
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
    const [visibleEvents, setVisibleEvents] = useState([]);
    const [page, setPage] = useState(0);
    const eventsPerPage = 5;

    const {
        searchText,
        setSearchText,
        modalVisible,
        eventoSeleccionadoInfo,
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
        fetchEvento,
        hasMoreEvents,
    } = useEventoValidation(navigation);

    useEffect(() => {
        setPage(0);
        setVisibleEvents([]);
        if (eventoFiltrados.length > 0) {
            setVisibleEvents(eventoFiltrados.slice(0, eventsPerPage));
        }
    }, [eventoFiltrados]);

    const cargarMasEventos = () => {
        const nextPage = page + 1;
        const newEvents = eventoFiltrados.slice(nextPage * eventsPerPage, (nextPage + 1) * eventsPerPage);
        setVisibleEvents([...visibleEvents, ...newEvents]);
        setPage(nextPage);
    };

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

                <ScrollView>
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
                            {visibleEvents.map((evento, index) => (
                                <EventoCard
                                    key={`${evento.idEvento.toString()}-${index}`}
                                    evento={evento}
                                    onPress={() => seleccionarEvento(evento)}
                                />
                            ))}

                            {visibleEvents.length < eventoFiltrados.length && (
                                <TouchableOpacity
                                    onPress={cargarMasEventos}
                                    style={styles.loadMoreButton}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.loadMoreText}>Cargar más eventos</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </ScrollView>
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