import { useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.1.108/Servicio-Nutricional-Uptaeb/bin/controlador/api/loginApi.php';

export default function useLogin(profile, navigation) {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [ErrorUsuario, setErrorUsuario] = useState(null);
  const [ErrorContrasenia, setErrorContrasenia] = useState(null);

  const validarUsuarioConValor = (valor) => {
    if (!valor || valor.trim() === "") return "El usuario no puede estar vacío!";
    return !/^\d{7,8}$/.test(valor) ? "El usuario debe tener entre 7 y 8 dígitos!" : null;
  };

  const validarContraseniaConValor = (valor) => {
    if (!valor || valor.trim() === "") return "La contraseña no puede estar vacía!";
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\*\-_\.\;\,\(\)\"@#\$=])[A-Za-z\d\*\-_\.\;\,\(\)\"@#\$=]{8,12}$/;
    return !regex.test(valor)
      ? "La contraseña debe tener 8-12 caracteres, incluir mayúscula, número y carácter especial!"
      : null;
  };

  const handleUsuarioChange = (text) => {
    setUsuario(text);
    const error = validarUsuarioConValor(text);
    setErrorUsuario(error);
  };

  const handleContraseniaChange = (text) => {
    setContrasenia(text);
    const error = validarContraseniaConValor(text);
    setErrorContrasenia(error);
  };

  const handleLogin = async () => {
    const errorUsuario = validarUsuarioConValor(usuario);
    const errorContrasenia = validarContraseniaConValor(contrasenia);

    setErrorUsuario(errorUsuario);
    setErrorContrasenia(errorContrasenia);

    if (errorUsuario || errorContrasenia) {
      showMessage({
        message: 'Error de Datos!',
        description: 'Por favor, corrige los errores en el formulario.',
        type: 'danger',
      });
      return;
    }

    try {
      const formBody = new URLSearchParams();
      formBody.append('cedula', usuario);
      formBody.append('clave', contrasenia);

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
         },
        body: formBody.toString(),
     });
      const data = await response.json();

      if ( data.resultado === 'success') {

        await AsyncStorage.setItem('token', data.token);
        console.log(await AsyncStorage.getItem('token'));

        showMessage({
          message: 'Login Exitoso',
          description: 'Bienvenido!',
          type: 'success',
        });
        setUsuario('');
        setContrasenia('');
        setErrorUsuario(null);
        setErrorContrasenia(null);

        navigation.navigate('Home');
      } else {
        showMessage({
          message: 'Error de Usuario o Contraseña',
          description: data.mensaje || 'Credenciales incorrectas.',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Error de Conexión',
        description: 'No se pudo conectar al servidor. Intente más tarde.',
        type: 'danger',
      });
    }
  };

  return {
    usuario,
    contrasenia,
    ErrorUsuario,
    ErrorContrasenia,
    handleUsuarioChange,
    handleContraseniaChange,
    handleLogin,
  };
}
