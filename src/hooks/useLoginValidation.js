import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { loginUser } from '../context/actions/userActions';
import { showMessage } from 'react-native-flash-message';

export default function useLogin(navigation) {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.user);

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
    setErrorUsuario(validarUsuarioConValor(text));
  };

  const handleContraseniaChange = (text) => {
    setContrasenia(text);
    setErrorContrasenia(validarContraseniaConValor(text));
  };

  const handleLogin = () => {
    const errorUsuario = validarUsuarioConValor(usuario);
    const errorContrasenia = validarContraseniaConValor(contrasenia);

    setErrorUsuario(errorUsuario);
    setErrorContrasenia(errorContrasenia);

    if (errorUsuario || errorContrasenia) {
      showMessage({
        message: 'Error de Datos!',
        description: 'Ingrese los datos correctamente!',
        type: 'danger',
      });
      return;
    }

    dispatch(loginUser(usuario, contrasenia, navigation, showMessage));
  };

  return {
    usuario,
    contrasenia,
    ErrorUsuario,
    ErrorContrasenia,
    loading,
    handleUsuarioChange,
    handleContraseniaChange,
    handleLogin,
  };
}
