import React from 'react';
import { Dimensions, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
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
    loading,        // <-- loading
    seleccionarAlimento,
    cerrarModal,
  } = useStockAlimentosValidation();

  return (
    <Container>
      <NavHead navigation={navigation} />
      <ContentContainer>
        <Header Titulo="Stock de Alimentos" showSubtitle={false} />
        <Card>
          <Buscador
            label="Buscar alimento"
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Ingrese nombre del alimento..."
          />
        </Card>

        {searchText.trim() !== '' ? (
          loading ? (
            <ActivityIndicator size="large" color="#0033aa" style={{ marginTop: 20 }} />
          ) : busquedaExitosa ? (
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
          ) : null
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
});
