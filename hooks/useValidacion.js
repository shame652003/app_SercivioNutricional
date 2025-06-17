import { useState } from "react";

// Hook genérico para validar cualquier campo
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

// Validaciones específicas

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

// Nueva validación para nombre y apellido (solo letras, sin espacios, mínimo 2 caracteres)
const validarNombreApellido = (valor) => {
  if (!valor || valor.trim() === "") return "El campo no puede estar vacío!";
  if (valor.length < 2) return "Debe tener al menos 2 caracteres!";
  if (!/^[A-Za-z]+$/.test(valor)) return "Solo se permiten letras, sin espacios!";
  return null;
};

// Hooks usando el hook genérico

export const useValidarNombreApellido = () => useValidacionCampo(validarNombreApellido);

export const useValidarEmail = () => useValidacionCampo(validarEmail);

export const useValidarUsuario = () => useValidacionCampo(validarUsuario);

export const useValidarContrasena = () => useValidacionCampo(validarContrasena);

// Validación especial para dos contraseñas

export const useValidarLasContrasenas = () => {
  const [contrasena1, setContrasena1] = useState('');
  const [contrasena2, setContrasena2] = useState('');
  const [error, setError] = useState(null);

  const validar = () => {
    if (!contrasena1.trim()) {
      setError("La primera contraseña no puede estar vacía!");
      return;
    }

    if (!contrasena2.trim()) {
      setError("La segunda contraseña no puede estar vacía!");
      return;
    }

    if (contrasena1.length < 8) {
      setError("Las contraseñas deben tener al menos 8 caracteres!");
      return;
    }

    const tieneMayuscula = /[A-Z]/.test(contrasena1);
    const tieneNumero = /\d/.test(contrasena1);
    const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(contrasena1);

    if (!tieneMayuscula || !tieneNumero || !tieneCaracterEspecial) {
      setError("La contraseña debe contener al menos una letra mayúscula, un número y un carácter especial!");
      return;
    }

    if (contrasena1 !== contrasena2) {
      setError("Las contraseñas no coinciden!");
      return;
    }

    setError(null);
  };

  const resetErrorContrasenias = () => setError(null);

  return [contrasena1, setContrasena1, contrasena2, setContrasena2, error, validar, resetErrorContrasenias];
};
