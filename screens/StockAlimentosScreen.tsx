import React from 'react';
import { Dimensions, StyleSheet, Text, StatusBar, View } from 'react-native';
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
// Ajustamos ancho para respetar márgenes a ambos lados del card
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

  return (
    <Container>
      <StatusBar backgroundColor="#0033aa" barStyle="light-content" />
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
            <View style={styles.gridContainer}>
              {alimentosFiltrados.map((item) => (
                <CardElemento
                  key={item.idAlimento}
                  nombre={item.nombre}
                  marca={item.marca}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // centra los cards horizontalmente
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 8
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
