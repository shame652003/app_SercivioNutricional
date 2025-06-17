import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
import usePerfilValidation from '../hooks/usePerfilValidation';
import useProfile from '../hooks/useProfile';

export default function PerfilScreen({ navigation }) {
  const { profile } = useProfile();
  const {
    nombre, setNombre, errorNombre, validarNombre,
    apellido, setApellido, errorApellido, validarApellido,
    email, setEmail, errorEmail, validarEmail,
    inicializarCampos,
    handleImageChange,
    handleCambioPerfil
  } = usePerfilValidation(profile);

  useEffect(() => {
    inicializarCampos();
  }, [profile]);

  return (
    <Container>
      <NavHead navigation={navigation} />
      <ContentContainer>
        <FlashMessage position="center" />
        <Header Titulo="Perfil del Usuario" />
        <Card>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={handleImageChange}>
              <Image 
                source={profile.profileImage ? { uri: profile.profileImage } : require('../assets/user.png')} 
                style={styles.profileImage}
              />
              <Text style={styles.addImageText}>Agregar Imagen</Text>
            </TouchableOpacity>
          </View>

          <Input 
           label="Nombre" 
           icon="id-card" 
           value={nombre} 
           onChangeText={setNombre} 
           error={errorNombre} 
           iconError={errorNombre ? 'warning' : null} 
          />
          <Input 
           label="Apellido" 
           icon="id-card" 
           value={apellido} 
           onChangeText={setApellido}  
           error={errorApellido} 
           iconError={errorApellido ? 'warning' : null}
          />
          <Input 
           label="Correo Electrónico" 
           icon="envelope"  
           value={email}  
           onChangeText={setEmail} 
           error={errorEmail} 
           placeholder="email@example.com" 
           iconError={errorEmail ? 'warning' : null} 
          />

          <View style={styles.buttonContainer}>
            <Botton title="Modificar" onPress={handleCambioPerfil} />
            <BottonCancel title="Cancelar" onPress={inicializarCampos} />
          </View>

          <Botton title="Cambiar Contraseña" onPress={() => navigation.navigate('CambioContraseña')} />
        </Card>
      </ContentContainer>
      <BottomNavBar navigation={navigation} />
    </Container>
  );
}

const styles = StyleSheet.create({
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#cfe4ff',
    marginBottom: 10,
  },
  addImageText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
    backgroundColor: '#0066CC',
    borderColor: '#01154d',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    width: '100%',
  },
}); 
