import { useValidarEmail } from './useValidacion';
import { showMessage } from 'react-native-flash-message';
import useProfile from './useProfile';

export default function useRecuperarContrasenaValidation() {
  const [email, setEmail, errorEmail, setErrorEmail, validarEmail, resetEmail] = useValidarEmail();
  const { profile } = useProfile();

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

  const recuperarPassword = () => {
    const error = validarEmailDirecto(email);
    setErrorEmail(error);

    if (!error) {
      if (email === profile.email) {
        showMessage({
          message: 'Correo Electrónico Enviado!',
          description: 'Revise su correo electrónico para recuperar la contraseña.',
          type: 'success',
        });
        setEmail('');
        resetEmail();
      } else {
        showMessage({
          message: 'Error de Correo!',
          description: 'El correo ingresado no está registrado.',
          type: 'danger',
        });
      }
    } else {
      showMessage({
        message: 'Error de Correo!',
        description: 'Ingrese un correo electrónico válido.',
        type: 'danger',
      });
    }
  };

  return {
    email,
    errorEmail,
    handleEmailChange,
    recuperarPassword,
  };
}
