import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Input from '../components/Input';
import Card from '../components/Card';
import Botton from '../components/Botton';
import useCambiarClave from '../hooks/useCambiarClave'; 


export default function CambiarClaveScreen({ navigation, route }) {
  const datos = route.params?.datos || null;
  const {
  contrasenia,
  setContrasenia,
  contrasenia2,
  setContrasenia2,
  ErrorContrasenia,
  ErrorContrasenia2,
  handleCambiarClave,
  loading,
  resetError,
} = useCambiarClave(navigation, datos);


  return (
    <View style={styles.container}>
      <Card>
        <View>
          <View style={styles.img}>
            <Image source={require('../../assets/logo.png')} style={styles.icon} />
          </View>

          <Text style={styles.welcomeText}>Cambiar Contraseña</Text>
        </View>

        <Text style={styles.subtitle}>Servicio Nutricional</Text>

        <Input
  label="Nueva Contraseña"
  icon="lock"
  isPassword={true}
  placeholder="Ingresar Nueva Contraseña"
  value={contrasenia}
  onChangeText={(text) => {
    setContrasenia(text);
  }}
  error={ErrorContrasenia}
  iconError={ErrorContrasenia ? 'warning' : null}
/>

<Input
  label="Confirmar Contraseña"
  icon="lock"
  isPassword={true}
  placeholder="Repetir Contraseña"
  value={contrasenia2}
  onChangeText={(text) => {
    setContrasenia2(text);
  }}
  error={ErrorContrasenia2}
  iconError={ErrorContrasenia2 ? 'warning' : null}
/>


        {loading ? (
          <ActivityIndicator size="large" color="#0066CC" />
        ) : (
          <Botton title="Cambiar Contraseña" onPress={handleCambiarClave} />
        )}

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.forgotPasswordText}>Volver al login</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1ECF4',
    paddingTop: '43%',
  },
  icon: {
    width: 100,
    height: 70,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  img: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066CC',
    alignItems: 'center',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#808080',
    marginBottom: 20,
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
