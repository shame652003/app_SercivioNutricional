import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
//import jwtDecode from 'jwt-decode';
import { API_URL } from '@env';

const { jwtDecode } = require('jwt-decode');



const BACKEND_URL = `${API_URL}bin/controlador/api/loginApi.php`;


export const loginUser = (cedula, clave, navigation, showMessage) => {
  return async (dispatch) => {
    dispatch({ type: 'USER_LOADING' });

    try {
      const formBody = new URLSearchParams();
      formBody.append('cedula', cedula);
      formBody.append('clave', clave);

      const { data } = await axios.post(BACKEND_URL, formBody.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (data.resultado === 'success') {
        const token = data.token;

        await AsyncStorage.setItem('token', token);
        const storedToken = await AsyncStorage.getItem('token');

        const userData = jwtDecode(token);

        dispatch({ type: 'USER_SUCCESS', payload: userData });
        dispatch({ type: 'UPDATE_PROFILE', payload: userData });

        showMessage({
          message: 'Login Exitoso',
          description: 'Bienvenido!',
          type: 'success',
        });

        navigation.navigate('Home');
      } else {
        dispatch({ type: 'USER_ERROR', payload: data.mensaje || 'Credenciales incorrectas.' });

        showMessage({
          message: 'Error de Usuario o Contraseña',
          description: data.mensaje || 'Credenciales incorrectas.',
          type: 'danger',
        });
      }
    } catch (error) {
      dispatch({ type: 'USER_ERROR', payload: 'Error de conexión' });
      console.error('Error real al hacer login:', error?.response || error?.message || error);

      showMessage({
        message: 'Error de Conexión',
        description: 'No se pudo conectar al servidor. Intente más tarde.',
        type: 'danger',
      });
    }
  };
};
