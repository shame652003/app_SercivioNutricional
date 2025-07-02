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

  const validarContrasena1 = (val1, val2) => {
    if (!val1.trim()) {
      setErrorContrasena1("La nueva contraseña no puede estar vacía!");
      return false;
    }
    if (val1.length < 8) {
      setErrorContrasena1("La contraseña debe tener al menos 8 caracteres!");
      return false;
    }
    if (!/[A-Z]/.test(val1) || !/\d/.test(val1) || !/[!@#$%^&*(),.?":{}|<>]/.test(val1)) {
      setErrorContrasena1("Debe incluir mayúscula, número y carácter especial!");
      return false;
    }
    setErrorContrasena1(null);

    if (val2 && val1 !== val2) {
      setErrorContrasena2("Las contraseñas no coinciden!");
      return false;
    } else {
      setErrorContrasena2(null);
    }
    return true;
  };

  const validarContrasena2 = (val1, val2) => {
    if (!val2.trim()) {
      setErrorContrasena2("La confirmación no puede estar vacía!");
      return false;
    }
    if (val1 !== val2) {
      setErrorContrasena2("Las contraseñas no coinciden!");
      return false;
    }
    setErrorContrasena2(null);
    return true;
  };

  const resetErrorContrasena1 = () => setErrorContrasena1(null);
  const resetErrorContrasena2 = () => setErrorContrasena2(null);

  return [
    contrasena1,
    setContrasena1,
    errorContrasena1,
    resetErrorContrasena1,
    contrasena2,
    setContrasena2,
    errorContrasena2,
    resetErrorContrasena2,
    validarContrasena1,
    validarContrasena2,
  ];
};

