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
  const { profile, profileImage } = useProfile();
  const { eliminarImagenPerfil } = useProfile();
  const {
    nombre, setNombre, errorNombre,
    apellido, setApellido, errorApellido,
    email, setEmail, errorEmail,
    inicializarCampos,
    handleImageChange,
    handleCambioPerfil,
    editarPerfil  
  } = usePerfilValidation(profile);

  // Logs de depuración para monitorear cambios en el perfil
  useEffect(() => {
  }, []);

  useEffect(() => {
  }, [profile]);

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
            <View style={styles.imageWrapper}>
              <TouchableOpacity onPress={handleImageChange}>
                <Image 
                  source={profileImage ? { uri: profileImage } : require('../../assets/user.png')} 
                  style={styles.profileImage}
                />
                <Text style={styles.addImageText}>Agregar Imagen</Text>
              </TouchableOpacity>
              {profileImage && (
                <TouchableOpacity 
                  style={styles.resetImageButton}
                  onPress={() => eliminarImagenPerfil()}
                >
                  <Text style={styles.resetImageText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
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

          <Botton title="Modificar" onPress={handleCambioPerfil} />
          <BottonCancel title="Cancelar" onPress={inicializarCampos} />

          <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('CambioContraseña')}>
            <Text style={styles.forgotPasswordText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
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
  imageWrapper: {
    position: 'relative',
  },
  resetImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: "#0066CC",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resetImageText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
    marginTop: -2,
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPassword: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#0066CC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});
