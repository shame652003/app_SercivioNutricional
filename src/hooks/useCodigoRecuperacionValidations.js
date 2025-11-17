import { useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { jwtDecode } = require('jwt-decode');


export default function useCodigoRecuperacionValidation(navigation) {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorCodigo, setErrorCodigo] = useState(null);

  const handleCodigoChange = (text) => {
    setCodigo(text);
    setErrorCodigo(null);
  };

  const verificarCodigo = async () => {
    if (codigo.length !== 6) {
      setErrorCodigo('El código debe tener 6 dígitos');
      return;
    }

    setLoading(true);

    try {
      const tokenRC = await AsyncStorage.getItem('tokenRC');
      const datos = jwtDecode(tokenRC);
      console.log('Datos decodificados:', datos);
      if(datos.tipo !== 'recuperacion') {
        showMessage({
            message: 'El token no es válido para recuperación de contraseña.',
            type: 'danger',
            onHide: async () => {
              await AsyncStorage.removeItem('tokenRC');
              navigation.navigate("LoginScreen");
            } });
        return;
      }

      if(datos.exp * 1000 < Date.now()) {
        showMessage({
          message: 'El token ha expirado.',
          type: 'danger',
          onHide: async () => {
            await AsyncStorage.removeItem('tokenRC');
            navigation.navigate("LoginScreen");
          } });
        return;
      }
      if (!datos.codigo) {
        showMessage({
          message: 'El token no contiene un código de verificación.',
          type: 'danger',
          onHide: async () => {
            await AsyncStorage.removeItem('tokenRC');
            navigation.navigate("LoginScreen");
          } });
        return;
      }
      console.log('Código esperado:', datos.codigo);
      if (codigo === String(datos.codigo)) {
            await AsyncStorage.removeItem("tokenRC");
            navigation.navigate('CambiarClave', { datos });

      } else {
        setErrorCodigo('Código incorrecto');
      }
    } catch (error) {
      showMessage({
        message: 'Ocurrió un error al verificar el código.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const reenviarCodigo = () => {
    showMessage({
      message: 'Se ha reenviado el código a tu correo',
      type: 'info',
    });
  };

  return {
    codigo,
    errorCodigo,
    loading,
    handleCodigoChange,
    verificarCodigo,
    reenviarCodigo,
  };
}
