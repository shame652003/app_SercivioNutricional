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

      if (codigo === String(datos.codigo)) {
        showMessage({
          message: '¡Código verificado correctamente!',
          type: 'success',
          duration: 2000,
        });

        navigation.navigate('CambiarClave');

       // navigation.navigate('CambiarClave', { tokenRC });

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
    // Aquí podrías llamar a tu API para reenviar el código real
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
