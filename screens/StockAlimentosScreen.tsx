import React from 'react';
import { FlatList, Dimensions, StyleSheet, Text } from 'react-native';
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
    seleccionarAlimento,
    cerrarModal,
  } = useStockAlimentosValidation();

  const renderItem = ({ item }) => (
    <CardElemento
      nombre={item.nombre}
      marca={item.marca}
      stock={item.stock}
      tituloCantidad="Stock"
      imagenUri={item.imagenUri}
      onPress={() => seleccionarAlimento(item)}
      style={{
        width: cardWidth,
        marginLeft: marginHorizontal,
        marginBottom: marginHorizontal,
      }}
    />
  );

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
          alimentosFiltrados.length > 0 ? (
            <FlatList
              data={alimentosFiltrados}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              numColumns={cardsPerRow}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20, paddingTop: 12 }}
            />
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
  noResultsText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});
