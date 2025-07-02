import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import CardHome from '../components/CardHome';
import GraficoCircular from '../components/GraficoCircular';
import useHome from '../hooks/useHome';

export default function HomeScreen({ navigation }) {
  const { data, graficoDataA, graficoDataM, loading, tienePermiso } = useHome();

  if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingTitle}>Cargando datos...</Text>
      <Text style={styles.loadingSubtitle}>Por favor espera un momento</Text>
      <ActivityIndicator size="large" color="#0066CC" style={styles.spinner} />
    </View>
  );
}

  return (
    <Container>
      <NavHead navigation={navigation} />
   <ContentContainer>
  <Header Titulo="Bienvenido al Servicio Nutricional" />

  <View style={styles.cardsContainer}>
  {tienePermiso(8, 'registrar') && (
    <CardHome
      style={styles.cardItem}
      title="Registrar Asistencias"
      icon="graduation-cap"
      cantidad={data?.asistencias_hoy ?? '0'}
      onPress={() => navigation.navigate('Asistencias')}
    />
  )}
  {tienePermiso(8, 'consultar') && (
    <CardHome
      style={styles.cardItem}
      title="Consultar Asistencias"
      icon2="account-check"
      cantidad={data?.asistencias_hoy ?? '0'}
      onPress={() => navigation.navigate('ConsultarAsistencias')}
    />
  )}
  {tienePermiso(9, 'consultar') && (
    <CardHome
      style={styles.cardItem}
      title="Menús"
      icon2="food-variant"
      cantidad={data?.menus_activos ?? '0'}
      onPress={() => navigation.navigate('Menus')}
    />
  )}
  {tienePermiso(10, 'consultar') && (
    <CardHome
      style={styles.cardItem}
      title="Eventos"
      icon="calendar"
      cantidad={data?.eventos_activos ?? '0'}
      onPress={() => navigation.navigate('Eventos')}
    />
  )}
  {tienePermiso(13, 'consultar') && (
    <CardHome
      style={styles.cardItem}
      title="Alimentos"
      icon2="food-apple"
      cantidad={data?.alimentos_disponibles ?? '0'}
      onPress={() => navigation.navigate('StockAlimentos')}
    />
  )}
  {tienePermiso(16, 'consultar') && (
    <CardHome
      style={styles.cardItem}
      title="Utensilios"
      icon="cutlery"
      cantidad={data?.utensilios_disponibles ?? '0'}
      onPress={() => navigation.navigate('StockUtensilios')}
    />
  )}
</View>


  <GraficoCircular data={graficoDataA} title='Alimentos Disponibles' />
  <GraficoCircular data={graficoDataM} title='Horarios con más Menús' />
</ContentContainer>

      <BottomNavBar navigation={navigation} />
    </Container>
  );

}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    margin: 10,
  },
  cardTop: {
    marginTop: -65,
  },
  loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5F9FF',
  padding: 20,
},
loadingTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#0066CC',
  marginBottom: 10,
},
loadingSubtitle: {
  fontSize: 16,
  color: '#333',
  marginBottom: 20,
},
spinner: {
  marginTop: 10,
},
cardsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start', 
  marginHorizontal: 10,
  marginTop: -60,
},
cardItem: {
  width: '48%',   
  marginBottom: 15, 
  marginRight: '2%',
},

});
