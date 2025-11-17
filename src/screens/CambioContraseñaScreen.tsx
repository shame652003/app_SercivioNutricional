import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
    errorContrasenia1,
    errorContrasenia2,
    handleContraseniaChange,
    handleContrasenia1Change,
    handleContrasenia2Change,
    handleCambioContrasenia,
    handleCancelar,
  } = useCambioContraseniaValidation(navigation);

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
          isPassword={true}
          placeholder="Ingresar la Contraseña"
          value={contrasenia}
          onChangeText={handleContraseniaChange}
          error={ErrorContrasenia}
          iconError={ErrorContrasenia ? 'warning' : null}
        />
        <Input
          label="Nueva Contraseña"
          icon="lock"
          isPassword={true}
          placeholder="Ingresar Nueva Contraseña"
          value={contrasenia1}
          onChangeText={handleContrasenia1Change}
          error={errorContrasenia1}
          iconError={errorContrasenia1 ? 'warning' : null}
        />
        <Input
          label="Confirmar Contraseña"
          icon="lock"
          isPassword={true}
          placeholder="Repetir Nueva Contraseña"
          value={contrasenia2}
          onChangeText={handleContrasenia2Change}
          error={errorContrasenia2}
          iconError={errorContrasenia2 ? 'warning' : null}
        />

        <View style={styles.rowButtons}>  
        <View style={styles.buttonWrapper}>
          <BottonCancel title="Cancelar" onPress={handleCancelar} />
        </View>
        <View style={styles.buttonWrapper}>
          <Botton title="Modificar" onPress={handleCambioContrasenia} />
        </View>
      </View>


          <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('Perfil')}>
            <Text style={styles.forgotPasswordText}>Modificar Datos del Perfil</Text>
          </TouchableOpacity>
        </Card>
      </ContentContainer>
      <BottomNavBar navigation={navigation} />
    </Container>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#0066CC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  rowButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 10, 
  marginTop: 20,
  },
  buttonWrapper: {
  flex: 1,
  marginHorizontal: 5,
  },


});
