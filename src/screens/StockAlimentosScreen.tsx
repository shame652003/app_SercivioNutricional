import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import Card from '../components/Card';
import Buscador from '../components/Buscador';
import CardElemento from '../components/CardElemento';
import ModalDetalle from '../components/ModalDetalle';
import useStockAlimentosValidation from '../hooks/useStockAlimentosValidation';
import LoadingModal from '../components/LoadingModal';
import { MaterialIcons } from '@expo/vector-icons';

const marginHorizontal = 16;
const cardsPerRow = 2;
const screenWidth = Dimensions.get('window').width;
const cardWidth =
  (screenWidth - marginHorizontal * (cardsPerRow + 1)) / cardsPerRow;

export default function StockAlimentosScreen({ navigation }) {
  const {
    searchText,
    setSearchText,
    modalVisible,
    alimentoSeleccionado,
    alimentosFiltrados,
    busquedaExitosa,
    loading,
    loadingPdf,
    seleccionarAlimento,
    cerrarModal,
    generarPdf,
    cargarMasAlimentos,
    totalAlimentos,
    hasMore
  } = useStockAlimentosValidation(navigation);

  return (
    <Container>
      <NavHead navigation={navigation} />
      <ContentContainer>
        <LoadingModal
          visible={loadingPdf}
          message="Generando PDF, por favor espere..."
        />
        <LoadingModal
          visible={loading && searchText.trim() !== ''}
          message="Buscando alimentos..."
        />

        <Header Titulo="Stock de Alimentos" showSubtitle={false} />
        <Card>
          <View style={styles.searchRow}>
            <View style={{ flex: 1 }}>
              <Buscador
                label="Buscar alimento"
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Ingrese nombre del alimento..."
              />
            </View>
            <TouchableOpacity onPress={generarPdf} style={styles.pdfButton}>
              <MaterialIcons name="picture-as-pdf" size={28} color="#0033aa" />
            </TouchableOpacity>
          </View>
        </Card>

   
        {totalAlimentos > 0 && !searchText && (
          <View style={styles.countCard}>
            <Text style={styles.countText}>
              Total de alimentos en stock:
            </Text>
            <Text style={styles.countNumber}>
              {totalAlimentos}
            </Text>
          </View>
        )}


        {!loading && busquedaExitosa ? (
          alimentosFiltrados.length > 0 ? (
            <ScrollView contentContainerStyle={styles.gridContainer}>
              <View style={styles.row}>
                {alimentosFiltrados.map((item) => (
                  <CardElemento
                    key={item.idAlimento}
                    nombre={item.nombre}
                    marca={item.marca !== 'Sin Marca' ? item.marca : undefined}
                    stock={item.stock}
                    tituloCantidad="Stock"
                    imagenUri={item.imagenUri}
                    onPress={() => seleccionarAlimento(item)}
                    style={[
                      styles.card,
                      { width: cardWidth, marginHorizontal: marginHorizontal / 2 },
                    ]}
                  />
                ))}
              </View>

              {hasMore && (
                <TouchableOpacity
                  onPress={cargarMasAlimentos}
                  style={styles.loadMoreButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.loadMoreText}>Cargar más alimentos</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          ) : (
            <Text style={styles.noResultsText}>No se encontraron alimentos</Text>
          )
        ) : null}
      </ContentContainer>
      <BottomNavBar navigation={navigation} />
      <ModalDetalle
        visible={modalVisible}
        onClose={cerrarModal}
        detalle={alimentoSeleccionado}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    borderColor: '#3399FF',
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
  
  countCard: {
    backgroundColor: '#ffffffff', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#0055cc',
  },
  countText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  countNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196f3',
  },

});