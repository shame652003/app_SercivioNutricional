import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
      <NavHead navigation={navigation} />
      <ContentContainer>
        <Header Titulo="Bienvenido al Servicio Nutricional" />
        <View style={[styles.row, styles.cardTop]}>
          <CardHome title="Estudiantes" icon="graduation-cap" cantidad="9250"  onPress={() => navigation.navigate('Home')} />
          <CardHome title="Asistencia" icon2="account-check" cantidad="2000" onPress={() => navigation.navigate('Home')}/>
        </View>
        <View style={styles.row}>
          <CardHome title="Menús" icon2="food-variant" cantidad="50" onPress={() => navigation.navigate('Home')}/>
          <CardHome title="Eventos" icon="calendar" cantidad="34" onPress={() => navigation.navigate('Home')}/>
        </View>
        <View style={styles.row}>
          <CardHome title="Stock de Alimentos" icon2="food-apple" cantidad="267" onPress={() => navigation.navigate('StockAlimentos')}/>
          <CardHome title="Stock de Utensilios" icon="cutlery" cantidad="78" onPress={() => navigation.navigate('Home')}/>
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
