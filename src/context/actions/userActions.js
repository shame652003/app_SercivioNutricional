
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../../security/crypto/encryptor';
import { API_URL } from '@env';

const { jwtDecode } = require('jwt-decode');
const BACKEND_URL = `${API_URL}bin/controlador/api/loginApi.php`;
console.log('BACKEND_URL:', BACKEND_URL);

export const loginUser = (cedula, clave, navigation, showMessage) => async (dispatch) => {
  dispatch({ type: 'USER_LOADING' });

  try {
    const encryptedPayload = encryptData({ cedula, clave });
    console.log('Encrypted payload:', encryptedPayload);
    const formBody = new URLSearchParams();
    formBody.append('payload', encryptedPayload);

    const { data } = await axios.post(BACKEND_URL, formBody.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    console.log('Respuesta del Login:', data);

    if (data.resultado === 'success') {
      await AsyncStorage.setItem('token', data.token);
      const userData = jwtDecode(data.token);
      dispatch({ type: 'USER_SUCCESS', payload: userData });
      dispatch({ type: 'UPDATE_PROFILE', payload: userData });
      showMessage({ message: 'Login Exitoso', description: 'Bienvenido!', type: 'success' });
    } else {
      dispatch({ type: 'USER_ERROR', payload: data.mensaje || 'Credenciales incorrectas.' });
      showMessage({ message: 'Error de Usuario o Contraseña', description: data.mensaje || 'Credenciales incorrectas.', type: 'danger', duration: 2500 });
    }
  } catch (error) {
    dispatch({ type: 'USER_ERROR', payload: 'Error de conexión' });
    console.error(error);
    showMessage({ message: 'Error de Conexión', description: 'No se pudo conectar al servidor. Intente más tarde.', type: 'danger' });
  }
};
