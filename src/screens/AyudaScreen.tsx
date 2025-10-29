
import React from 'react';
import {StyleSheet, ScrollView } from 'react-native';
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
        <Header Titulo="Centro de Ayuda y Soporte" showSubtitle={false} />
        
        <ScrollView contentContainerStyle={styles.cardList}>
          {DATOS_SOPORTE.map((modulo) => (
            <CardSoporte
              key={modulo.id}
              titulo={modulo.titulo}
              icono={modulo.icono}
              onPress={() => handleCardPress(modulo)} 
            />
          ))}
        </ScrollView>
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
  },
  litle:{
    color:'#55a4ffc7'
  }
});