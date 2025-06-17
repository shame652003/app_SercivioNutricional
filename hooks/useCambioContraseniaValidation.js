import { useValidarContrasena, useValidarLasContrasenas } from './useValidacion';
import useProfile from './useProfile'; // ajusta la ruta si es necesario
import { useState } from 'react';
import { showMessage } from 'react-native-flash-message';

export default function useCambioContraseniaValidation() {
  const { profile, handleUpdateProfile } = useProfile();

  // Validar contraseña actual
  const [
    contrasenia, setContrasenia,
    ErrorContrasenia, , // omitimos setError
    validarContrasenia,
    resetErrorContrasenia
  ] = useValidarContrasena();

  // Validar nuevas contraseñas (doble campo)
  const [
    contrasenia1, setContrasenia1,
    contrasenia2, setContrasenia2,
    ErrorContrasenias,
    validarContrasenias,
    resetErrorContrasenias
  ] = useValidarLasContrasenas();

  const handleContraseniaChange = (text) => {
    setContrasenia(text);
    validarContrasenia();
    if (text && !ErrorContrasenia) resetErrorContrasenia();
  };

  const handleContrasenia1Change = (text) => {
    setContrasenia1(text);
    validarContrasenias();
    if (text && !ErrorContrasenias) resetErrorContrasenias();
  };

  const handleContrasenia2Change = (text) => {
    setContrasenia2(text);
    validarContrasenias();
    if (text && !ErrorContrasenias) resetErrorContrasenias();
  };

  const handleCambioContrasenia = () => {
    validarContrasenia();
    validarContrasenias();

    if (contrasenia && contrasenia1 && contrasenia2 && !ErrorContrasenia && !ErrorContrasenias) {
      if (contrasenia === profile.clave) {
        handleUpdateProfile('clave', contrasenia1);
        setContrasenia('');
        setContrasenia1('');
        setContrasenia2('');
        resetErrorContrasenia();
        resetErrorContrasenias();
        showMessage({
          message: 'Contraseña cambiada exitosamente!',
          description: 'Tu contraseña ha sido actualizada.',
          type: 'success',
        });
      } else {
        showMessage({
          message: 'Error de Contraseña!',
          description: 'La contraseña actual es incorrecta.',
          type: 'danger',
        });
      }
    } else {
      showMessage({
        message: 'Error de Datos!',
        description: 'Por favor ingresa todos los campos correctamente.',
        type: 'danger',
      });
    }
  };

  const handleCancelar = () => {
    setContrasenia('');
    setContrasenia1('');
    setContrasenia2('');
    resetErrorContrasenia();
    resetErrorContrasenias();
  };

  return {
    contrasenia,
    contrasenia1,
    contrasenia2,
    ErrorContrasenia,
    ErrorContrasenias,
    handleContraseniaChange,
    handleContrasenia1Change,
    handleContrasenia2Change,
    handleCambioContrasenia,
    handleCancelar,
  };
}
