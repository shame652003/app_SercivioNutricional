
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Input from '../components/Input';
import Card from '../components/Card';
import Botton from '../components/Botton';
import useProfile from '../hooks/useProfile';
import useLogin from '../hooks/useLoginValidation';
import FlashMessage from 'react-native-flash-message';

export default function LoginScreen({ navigation }) {
  const { profile } = useProfile();

  const {
    usuario,
    contrasenia,
    ErrorUsuario,
    ErrorContrasenia,
    loading,
    handleUsuarioChange,
    handleContraseniaChange,
    handleLogin,
  } = useLogin(navigation);

  return (
    <View style={styles.container}>
      <Card>
        <View>
          <View style={styles.img}>
            <Image source={require('../../assets/logo.png')} style={styles.icon} />
          </View>

          <Text style={styles.welcomeText}>Bienvenidos</Text>
        </View>

        <Text style={styles.subtitle}>Servicio Nutricional</Text>

        <Input
          label="Usuario"
          icon="user"
          placeholder="Ingresar el Usuario"
          value={usuario}
          onChangeText={handleUsuarioChange}
          error={ErrorUsuario}
          iconError={ErrorUsuario ? 'warning' : null}
        />

        <Input
          label="Contraseña"
          icon="lock"
          isPassword={true}
          placeholder="Ingresar Contraseña"
          value={contrasenia}
          onChangeText={handleContraseniaChange}
          onBlur={() => {
  
          }}
          error={ErrorContrasenia}
          iconError={ErrorContrasenia ? 'warning' : null}
        />

        {loading ? (
        <ActivityIndicator size="large" color="#0066CC" />
      ) : (
        <Botton title="Iniciar Sesión" onPress={handleLogin} />
      )}

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('RecuperarContraseña')}
        >
          <Text style={styles.forgotPasswordText}>¿Has olvidado tu contraseña?</Text>
        </TouchableOpacity>
      </Card>

      <FlashMessage position="top" />
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
