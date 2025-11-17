import { useValidarEmail } from './useValidacion';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import { useState } from 'react';
import { encryptData } from '../security/crypto/encryptor';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BACKEND_URL = `${API_URL}bin/controlador/api/recuperarContraseñaApi.php`;

export default function useRecuperarContrasenaValidation(navigation) {
  const [email, setEmail, errorEmail, setErrorEmail, validarEmail, resetEmail] = useValidarEmail();
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (text) => {
    setEmail(text);
    const error = validarEmailDirecto(text);
    setErrorEmail(error);
  };

  const validarEmailDirecto = (valor) => {
    if (!valor || valor.trim() === "") return "El correo electrónico no puede estar vacío!";
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return !regex.test(valor) ? "El formato del correo electrónico es incorrecto!" : null;
  };

  const recuperarPassword = async () => {
    const error = validarEmailDirecto(email);
    setErrorEmail(error);

    if (!error) {
      setLoading(true); 

      try {
        const encryptedDatos = encryptData({ enviar: 'true', tipo: 'app', correo: email });
        const formBody = new URLSearchParams();
        formBody.append('datos', encryptedDatos);

        const { data } = await axios.post(BACKEND_URL, formBody.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        console.log('Respuesta de Recuperar Contrasenia:', data);

        if (data.resultado === 'ok') {
           await AsyncStorage.setItem('tokenRC', data.tokenRC);
           navigation.navigate('CodigoRecuperacion');

        } else if (data.resultado === 'error') {
          showMessage({
            message: 'Error al enviar el correo',
            description: data.mensaje || 'Intente nuevamente más tarde.',
            duration: 3000, 
            type: 'danger',
          });
        } else if (data.resultado === 'no existe') {
          showMessage({
            message: 'Error en el Correo Electrónico',
            description: 'Ingrese correctamente el correo electrónico.',
            duration: 3000, 
            type: 'danger',
          });
        }
      } catch (error) {
        console.error('Error al recuperar la contraseña:', error);
        showMessage({
          message: 'Error inesperado',
          description: 'No se pudo enviar el correo. Intente más tarde.',
          duration: 3000, 
          type: 'danger',
        });
      } finally {
        setLoading(false); 
      }

      setEmail('');
      resetEmail();
    } else {
      showMessage({
        message: 'Error de Correo!',
        description: 'Ingrese un correo electrónico válido.',
        duration: 3000, 
        type: 'danger',
      });
    }
  };

  return {
    email,
    errorEmail,
    loading, 
    handleEmailChange,
    recuperarPassword,
  };
}
