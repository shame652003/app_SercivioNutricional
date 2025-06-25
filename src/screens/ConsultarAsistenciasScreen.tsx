import React from 'react';
import { StyleSheet } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import Card from '../components/Card';
import AsistenciasDataTable from '../components/AsistenciasDataTable';


export default function ConsultarAsistenciasScreen({ navigation }) {


  return (
    <Container>
      <NavHead navigation={navigation} />
      <ContentContainer>
        <Header Titulo="Consultar Asistencias" showSubtitle={false} />
        <Card>
          <AsistenciasDataTable />
          
        </Card>
      </ContentContainer>
      <BottomNavBar navigation={navigation} />
    </Container>
  );
}

const styles = StyleSheet.create({

});
