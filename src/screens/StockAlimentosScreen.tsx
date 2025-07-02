import React from 'react';
import { Dimensions, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
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
const cardWidth = (screenWidth - marginHorizontal * (cardsPerRow + 1)) / cardsPerRow;

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
  } = useStockAlimentosValidation();

return (
    <Container>
      <NavHead navigation={navigation} />
      <ContentContainer>
        
        <LoadingModal visible={loadingPdf} message="Generando PDF, por favor espere..." />
        <LoadingModal visible={loading && searchText.trim() !== ''} message="Buscando alimentos..." />

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

        {searchText.trim() !== '' && !loading && busquedaExitosa ? (
          alimentosFiltrados.length > 0 ? (
            <View style={styles.gridContainer}>
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
          ) : (
            <Text style={styles.noResultsText}>No se encontraron alimentos</Text>
          )
        ) : null}

      </ContentContainer>
      <BottomNavBar navigation={navigation} />
      <ModalDetalle visible={modalVisible} onClose={cerrarModal} detalle={alimentoSeleccionado} />
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

});
