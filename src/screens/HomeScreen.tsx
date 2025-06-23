import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import CardHome from '../components/CardHome';
import GraficoCircular from '../components/GraficoCircular';

export default function HomeScreen({ navigation }) {
  return (
    <Container>
       <StatusBar backgroundColor="#0033aa" barStyle="light-content"/>  
      <NavHead navigation={navigation} />
      <ContentContainer>
        <Header Titulo="Bienvenido al Servicio Nutricional" />
        <View style={[styles.row, styles.cardTop]}>
          <CardHome title="Registrar Asistencias" icon="graduation-cap" cantidad="9250"  onPress={() => navigation.navigate('Asistencias')} />
          <CardHome title="Consultar Asistencias" icon2="account-check" cantidad="2000" onPress={() => navigation.navigate('ConsultarAsistencias')}/>
        </View>
        <View style={styles.row}>
          <CardHome title="Menús" icon2="food-variant" cantidad="50" onPress={() => navigation.navigate('Menus')}/>
          <CardHome title="Eventos" icon="calendar" cantidad="34" onPress={() => navigation.navigate('Eventos')}/>
        </View>
        <View style={styles.row}>
          <CardHome title="Stock de Alimentos" icon2="food-apple" cantidad="267" onPress={() => navigation.navigate('StockAlimentos')}/>
          <CardHome title="Stock de Utensilios" icon="cutlery" cantidad="78" onPress={() => navigation.navigate('StockUtensilios')}/>
        </View>
        <GraficoCircular></GraficoCircular>
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
});
