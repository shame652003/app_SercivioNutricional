import React from 'react';
import {  Dimensions, StyleSheet, Text, StatusBar } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import Card from '../components/Card';


export default function StockUtensiliosScreen({ navigation }) {


  return (
    <Container>
        <StatusBar backgroundColor="#0033aa" barStyle="light-content"/> 
      <NavHead navigation={navigation} />
      <ContentContainer>
        <Header Titulo="Stock de Utensilios" showSubtitle={false} />
        <Card>
          <Text style={{ padding: 16, fontSize: 16, color: '#333' }}>
           Lo que vayan a hacer
          </Text>
        </Card>
      </ContentContainer>
      <BottomNavBar navigation={navigation} />
    </Container>
  );
}

const styles = StyleSheet.create({

});
