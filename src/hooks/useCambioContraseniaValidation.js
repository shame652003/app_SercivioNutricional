import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { encryptData } from '../security/crypto/encryptor';
import { API_URL } from '@env';
import { showMessage } from 'react-native-flash-message';

const BACKEND_URL = `${API_URL}bin/controlador/api/cambiarContrasenaPerfilApi.php`; 
console.log(BACKEND_URL);

export default function useCambioContraseniaValidation() {
  const [contrasenia, setContrasenia] = useState('');
  const [contrasenia1, setContrasenia1] = useState('');
  const [contrasenia2, setContrasenia2] = useState('');
  const [ErrorContrasenia, setErrorContrasenia] = useState('');
  const [errorContrasenia1, setErrorContrasenia1] = useState('');
  const [errorContrasenia2, setErrorContrasenia2] = useState('');

  const validarContrasenia = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\*\-_\.\;\,\(\)\"@#\$=])[A-Za-z\d\*\-_\.\;\,\(\)\"@#\$=]{8,}$/;
    if (!regex.test(value)) {
      setErrorContrasenia('Contraseña actual inválida');
      return false;
    }
    setErrorContrasenia('');
    return true;
  };

  const validarContrasena1 = (value1, value2) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\*\-_\.\;\,\(\)\"@#\$=])[A-Za-z\d\*\-_\.\;\,\(\)\"@#\$=]{8,}$/;
    if (!regex.test(value1)) {
      setErrorContrasenia1('Nueva contraseña inválida');
      return false;
    }
    setErrorContrasenia1('');
    return true;
  };

  const validarContrasena2 = (value1, value2) => {
    if (value1 !== value2) {
      setErrorContrasenia2('Las contraseñas no coinciden');
      return false;
    }
    setErrorContrasenia2('');
    return true;
  };

  const handleContraseniaChange = (value) => {
    setContrasenia(value);
    validarContrasenia(value);
  };

  const handleContrasenia1Change = (value) => {
    setContrasenia1(value);
    validarContrasena1(value, contrasenia2);
  };

  const handleContrasenia2Change = (value) => {
    setContrasenia2(value);
    validarContrasena2(contrasenia1, value);
  };

  const handleCancelar = () => {
    setContrasenia('');
    setContrasenia1('');
    setContrasenia2('');
    setErrorContrasenia('');
    setErrorContrasenia1('');
    setErrorContrasenia2('');
  };

  const handleCambioContrasenia = async () => {
    const valido1 = validarContrasenia(contrasenia);
    const valido2 = validarContrasena1(contrasenia1, contrasenia2);
    const valido3 = validarContrasena2(contrasenia1, contrasenia2);

    if (!valido1 || !valido2 || !valido3) return;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const datos = {
        clave_actual: contrasenia,
        nueva_clave: contrasenia1,
        repetir_clave: contrasenia2,
      };

      const encrypted = encryptData(datos);
      const formBody = new URLSearchParams();
      formBody.append('datos', encrypted);

      const response = await axios.post(BACKEND_URL, formBody.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = response.data;

      if (data.resultado === 'clave Editada correctamente.') {
        showMessage({
          message: 'Contraseña actualizada',
          type: 'success',
        });
        handleCancelar();
      } else {
        showMessage({
          message: 'Error',
          description: data.mensaje || 'No se pudo cambiar la contraseña',
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      Alert.alert('Error', error.message || 'Error al cambiar la contraseña');
    }
  };

  return {
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
  };
}
