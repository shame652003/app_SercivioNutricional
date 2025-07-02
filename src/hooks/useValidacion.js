import { useState } from "react";

const useValidacionCampo = (validarFn, valorInicial = "") => {
  const [valor, setValor] = useState(valorInicial);
  const [error, setError] = useState(null);

  const validar = () => {
    const errorValidacion = validarFn(valor);
    setError(errorValidacion);
  };

  const resetError = () => setError(null);

  return [valor, setValor, error, setError, validar, resetError];
};

const validarNoVacio = (valor) =>
  !valor || valor.trim() === "" ? "El campo no puede estar vacío!" : null;

const validarEmail = (email) => {
  if (!email || email.trim() === "") return "El correo electrónico no puede estar vacío!";
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return !regex.test(email) ? "El formato del correo electrónico es incorrecto!" : null;
};

const validarUsuario = (usuario) => {
  if (!usuario || usuario.trim() === "") return "El usuario no puede estar vacío!";
  return !/^\d{7,8}$/.test(usuario) ? "El usuario debe tener entre 7 y 8 dígitos!" : null;
};

const validarContrasena = (contrasena) => {
  if (!contrasena || contrasena.trim() === "") return "La contraseña no puede estar vacía!";
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\*\-_\.\;\,\(\)\"@#\$=])[A-Za-z\d\*\-_\.\;\,\(\)\"@#\$=]{8,12}$/;
  return !regex.test(contrasena)
    ? "La contraseña debe tener 8-12 caracteres, incluir mayúscula, número y carácter especial!"
    : null;
};

const validarNombreApellido = (valor) => {
  if (!valor || valor.trim() === "") return "El campo no puede estar vacío!";
  if (valor.length < 2) return "Debe tener al menos 2 caracteres!";
  if (!/^[A-Za-z]+$/.test(valor)) return "Solo se permiten letras, sin espacios!";
  return null;
};

export const useValidarNombreApellido = () => useValidacionCampo(validarNombreApellido);

export const useValidarEmail = () => useValidacionCampo(validarEmail);

export const useValidarUsuario = () => useValidacionCampo(validarUsuario);

export const useValidarContrasena = () => useValidacionCampo(validarContrasena);

export const useValidarLasContrasenas = () => {
  const [contrasena1, setContrasena1] = useState('');
  const [contrasena2, setContrasena2] = useState('');
  const [errorContrasena1, setErrorContrasena1] = useState(null);
  const [errorContrasena2, setErrorContrasena2] = useState(null);

  // Validar solo la contraseña 1 (nuevo valor)
  const validarContrasena1 = (valor) => {
    if (!valor.trim()) {
      return "La nueva contraseña no puede estar vacía!";
    }
    if (valor.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres!";
    }
    if (!/[A-Z]/.test(valor) || !/\d/.test(valor) || !/[!@#$%^&*(),.?":{}|<>]/.test(valor)) {
      return "Debe incluir mayúscula, número y carácter especial!";
    }
    return null;
  };

  // Validar la confirmación de contraseña (que coincida con contrasena1)
  const validarContrasena2 = (valor2, valor1) => {
    if (!valor2.trim()) {
      return "La confirmación no puede estar vacía!";
    }
    if (valor2 !== valor1) {
      return "Las contraseñas no coinciden!";
    }
    return null;
  };

  // Esta función valida todo (antes de enviar)
  const validar = () => {
    let valido = true;
    const error1 = validarContrasena1(contrasena1);
    const error2 = validarContrasena2(contrasena2, contrasena1);

    setErrorContrasena1(error1);
    setErrorContrasena2(error2);

    if (error1 || error2) valido = false;

    return valido;
  };

  const resetError = () => {
    setErrorContrasena1(null);
    setErrorContrasena2(null);
  };

  // Para validación en tiempo real: actualizo error al cambiar texto
  const onChangeContrasena1 = (valor) => {
    setContrasena1(valor);
    setErrorContrasena1(validarContrasena1(valor));

    // También valido confirmación porque puede que ya haya texto ahí
    if (contrasena2) {
      setErrorContrasena2(validarContrasena2(contrasena2, valor));
    }
  };

  const onChangeContrasena2 = (valor) => {
    setContrasena2(valor);
    setErrorContrasena2(validarContrasena2(valor, contrasena1));
  };

  return [
    contrasena1,
    onChangeContrasena1,
    contrasena2,
    onChangeContrasena2,
    errorContrasena1,
    errorContrasena2,
    validar,
    resetError,
  ];
};
