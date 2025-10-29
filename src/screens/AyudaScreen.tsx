import React from 'react';
import {StyleSheet, ScrollView, View, Text } from 'react-native'; // Importamos Text
import useAyuda, { DATOS_SOPORTE } from '../hooks/useAyuda'; 
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import CardSoporte from '../components/CardSoporte';
import ModalFAQ from '../components/ModalFAQ'; 


export default function PantallaSoporte({ navigation }) {
  const {
    handleCardPress,
    modalVisible,
    onCloseModal,
    faqActual,
    tituloActual,
    iconoActual,
  } = useAyuda();

  return (
    <Container>
      <NavHead navigation={navigation} />
      
      <ContentContainer>
        <Header Titulo="Centro de Ayuda" showSubtitle={false} />
    
        <View style={styles.cardsContainer} >
        <ScrollView contentContainerStyle={styles.cardList}>
        
          <View style={styles.cardInfo}>
            <Text style={styles.cardInfoTitle}>
               Bienvenido al Centro de Ayuda
            </Text>
            <Text style={styles.cardInfoDescription}>
              Selecciona una de las categorías a continuación para encontrar respuestas a las preguntas más frecuentes sobre el uso de la aplicación.
            </Text>
          </View>
          
          {DATOS_SOPORTE.map((modulo) => (
            <CardSoporte
              key={modulo.id}
              titulo={modulo.titulo}
              icono={modulo.icono}
              onPress={() => handleCardPress(modulo)} 
            />
          ))}
        </ScrollView>
        </View>
      </ContentContainer>

      <ModalFAQ
        visible={modalVisible}
        onClose={onCloseModal} 
        tituloModulo={tituloActual}
        faqs={faqActual}
        icono={iconoActual}
      />

      <BottomNavBar navigation={navigation} />
    </Container>
  );
}

const styles = StyleSheet.create({
  cardList: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    paddingBottom: 20, 
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', 
    marginTop: -70,
  },
  

  cardInfo: {
    backgroundColor: '#ffffffff', 
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: '95%', 
  },
  cardInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066CC', 
    marginBottom: 8,
  },
  cardInfoDescription: {
    fontSize: 16,
    color: '#000000ff',
    lineHeight: 20,
  },
});