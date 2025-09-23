// En el archivo StockUtensiliosScreen.js

import React from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import Card from '../components/Card';
import Buscador from '../components/Buscador';
import CardElemento from '../components/CardElementoUtensilio';
import ModalDetalle from '../components/ModalDetalleUtensilios';
import LoadingModal from '../components/LoadingModal';
import { MaterialIcons } from '@expo/vector-icons';
import useStockUtensiliosValidation from '../hooks/useStockUtensiliosValidation';

const marginHorizontal = 16;
const cardsPerRow = 2;
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - marginHorizontal * (cardsPerRow + 1)) / cardsPerRow;

export default function StockUtensiliosScreen({ navigation }) {
  const {
    searchText,
    setSearchText,
    modalVisible,
    utensilioSeleccionado,
    utensiliosFiltrados,
    busquedaExitosa,
    loading,
    loadingPdf,
    hasMore, // Se añade la nueva propiedad
    seleccionarUtensilio,
    cerrarModal,
    generarPdf,
    cargarMasUtensilios, // Se añade el nuevo método
  } = useStockUtensiliosValidation(navigation);

  return (
    <Container>
      <NavHead navigation={navigation} />
      <ContentContainer>
        <LoadingModal visible={loadingPdf} message="Generando PDF, por favor espere..." />
        <LoadingModal visible={loading && searchText.trim() !== ''} message="Buscando utensilios..." />

        <Header Titulo="Stock de Utensilios" showSubtitle={false} />
        <Card>
          <View style={styles.searchRow}>
            <View style={{ flex: 1 }}>
              <Buscador
                label="Buscar utensilio"
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Ingrese nombre del utensilio..."
              />
            </View>
            <TouchableOpacity onPress={generarPdf} style={styles.pdfButton}>
              <MaterialIcons name="picture-as-pdf" size={28} color="#0033aa" />
            </TouchableOpacity>
          </View>
        </Card>

        {utensiliosFiltrados.length > 0 ? (
          <>
            <View style={styles.gridContainer}>
              {utensiliosFiltrados.map((item) => (
                <CardElemento
                  key={item.idUtensilio}
                  nombre={item.nombre}
                  material={item.material !== 'No Definido' ? item.material : undefined}
                  stock={item.stock}
                  tituloCantidad="Stock"
                  imagenUri={item.imagenUri}
                  onPress={() => seleccionarUtensilio(item)}
                  style={[
                    styles.card,
                    { width: cardWidth, marginHorizontal: marginHorizontal / 2 },
                  ]}
                />
              ))}
            </View>
            {hasMore && (
              <TouchableOpacity onPress={cargarMasUtensilios} style={styles.loadMoreButton}>
                <Text style={styles.loadMoreText}>Cargar más utensilios</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          !loading && <Text style={styles.noResultsText}>No se encontraron utensilios</Text>
        )}
      </ContentContainer>
      <BottomNavBar navigation={navigation} />
      <ModalDetalle visible={modalVisible} onClose={cerrarModal} detalle={utensilioSeleccionado} />
    </Container>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  card: {
    marginBottom: marginHorizontal,
  },
  noResultsText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pdfButton: {
    marginLeft: 12,
    borderRadius: 8,
    padding: 7,
    borderColor:'#3399FF',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#0033aa',
    fontWeight: '600',
    textAlign: 'center',
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