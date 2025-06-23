import { useValidarUsuario, useValidarContrasena } from './useValidacion';
import { showMessage } from 'react-native-flash-message';

export default function useLogin(profile, navigation) {
  // Ahora extraemos también setError para validar en tiempo real
  const [usuario, setUsuario, ErrorUsuario, setErrorUsuario, validarUsuario, resetUsuario] = useValidarUsuario();
  const [contrasenia, setContrasenia, ErrorContrasenia, setErrorContrasenia, validarContrasenia, resetContrasenia] = useValidarContrasena();

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
    if (error) setErrorUsuario(error);
    else resetUsuario();
  };

  const handleContraseniaChange = (text) => {
    setContrasenia(text);
    const error = validarContraseniaConValor(text);
    if (error) setErrorContrasenia(error);
    else resetContrasenia();
  };

 const handleLogin = () => {
  const errorUsuario = validarUsuarioConValor(usuario);
  const errorContrasenia = validarContraseniaConValor(contrasenia);

  setErrorUsuario(errorUsuario);
  setErrorContrasenia(errorContrasenia);

  if (!errorUsuario && !errorContrasenia) {
    if (usuario === profile.cedula && contrasenia === profile.clave) {
      navigation.navigate('Home');
      setUsuario('');
      setContrasenia('');
      resetContrasenia();
      resetUsuario();
    } else {
      showMessage({
        message: 'Error de Usuario o Contraseña!',
        description: 'Ingrese los Datos Correctamente.',
        type: 'danger',
      });
    }
  } else {
    showMessage({
      message: 'Error de Datos!',
      description: 'Ingrese los Datos Correctamente.',
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
