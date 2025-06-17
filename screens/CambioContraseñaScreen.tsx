import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Card from '../components/Card';
import Botton from '../components/Botton';
import BottonCancel from '../components/BottonCancel';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import FlashMessage from 'react-native-flash-message';

import useCambioContraseniaValidation from '../hooks/useCambioContraseniaValidation';

export default function CambioContraseñaScreen({ navigation }) {
  const {
    contrasenia,
    contrasenia1,
    contrasenia2,
    ErrorContrasenia,
    ErrorContrasenias,
    handleContraseniaChange,
    handleContrasenia1Change,
    handleContrasenia2Change,
    handleCambioContrasenia,
    handleCancelar,
  } = useCambioContraseniaValidation();

  return (
    <Container>
      <FlashMessage position="center" />
      <NavHead navigation={navigation} />
      <ContentContainer>
        <Header Titulo="Modificar Contraseña" />
        <Card>
          <Input
            label="Contraseña Actual"
            icon="lock"
            placeholder="Ingresar la Contraseña"
            value={contrasenia}
            onChangeText={handleContraseniaChange}
            onBlur={handleContraseniaChange} // o una función que valide si quieres
            error={ErrorContrasenia}
            iconError={ErrorContrasenia ? 'warning' : null}
          />
          <Input
            label="Nueva Contraseña"
            icon="lock"
            placeholder="Ingresar Nueva Contraseña"
            value={contrasenia1}
            onChangeText={handleContrasenia1Change}
            onBlur={handleContrasenia1Change}
            error={ErrorContrasenias}
            iconError={ErrorContrasenias ? 'warning' : null}
          />
          <Input
            label="Repetir Contraseña"
            icon="lock"
            placeholder="Repetir Nueva Contraseña"
            value={contrasenia2}
            onChangeText={handleContrasenia2Change}
            onBlur={handleContrasenia2Change}
            error={ErrorContrasenias}
            iconError={ErrorContrasenias ? 'warning' : null}
          />
          <View style={styles.buttonContainer}>
            <Botton title="Modificar" onPress={handleCambioContrasenia} />
            <BottonCancel title="Cancelar" onPress={handleCancelar} />
          </View>
          <Botton title="Modificar Datos del Perfil" onPress={() => navigation.navigate('Perfil')} />
        </Card>
      </ContentContainer>
      <BottomNavBar navigation={navigation} />
    </Container>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    width: '100%',
  },
});
