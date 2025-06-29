import { useState, useEffect } from "react";
import { useValidarLasContrasenas } from "./useValidacion";
import { showMessage } from 'react-native-flash-message';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from "axios";
const { jwtDecode } = require('jwt-decode');

const BACKEND_URL = `${API_URL}bin/controlador/api/cambiarClaveApi.php`;

const useCambiarClave = (navigation) => {
  const [
    contrasenia,
    setContrasenia,
    contrasenia2,
    setContrasenia2,
    error,
    validar,
    resetError,
  ] = useValidarLasContrasenas();

  const [errorContrasenia, setErrorContrasenia] = useState(null);
  const [errorContrasenia2, setErrorContrasenia2] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contrasenia !== "" || contrasenia2 !== "") {
      validarCamposTiempoReal();
    }
  }, [contrasenia, contrasenia2]);

  const validarCamposTiempoReal = () => {
    if (!contrasenia.trim()) {
      setErrorContrasenia("La nueva contraseña no puede estar vacía!");
    } else if (contrasenia.length < 8) {
      setErrorContrasenia("Debe tener al menos 8 caracteres!");
    } else if (
      !/[A-Z]/.test(contrasenia) ||
      !/\d/.test(contrasenia) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(contrasenia)
    ) {
      setErrorContrasenia("Debe incluir una mayúscula, un número y un carácter especial!");
    } else {
      setErrorContrasenia(null);
    }

    if (!contrasenia2.trim()) {
      setErrorContrasenia2("La confirmación no puede estar vacía!");
    } else if (contrasenia !== contrasenia2) {
      setErrorContrasenia2("Las contraseñas no coinciden!");
    } else {
      setErrorContrasenia2(null);
    }
  };

  const handleCambiarClave = async () => {
    validar();
    if (
      !contrasenia.trim() ||
      !contrasenia2.trim() ||
      errorContrasenia ||
      errorContrasenia2
    )
      return;

    setLoading(true);
    try {
        const tokenRC = await AsyncStorage.getItem("tokenRC");
        console.log("Token de recuperación:", tokenRC);
        if (!tokenRC) {   
          throw new Error("No se encontró el token de recuperacion.");
        }
        const datos = jwtDecode(tokenRC);
        console.log("Datos decodificados cambiar clave:", datos);

        const encryptedContrasenia = encryptData({cambiarClave:true, token: tokenRC, codigo:datos.codigo, clave: contrasenia, clave2: contrasenia2});
        console.log("Datos encriptados:", encryptedContrasenia);
        const formBody = new URLSearchParams();
        formBody.append("datos", encryptedContrasenia);
        const response = await axios.post(BACKEND_URL, formBody.toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        if(response.resultado === "error") {
            showMessage({
              message: "Error al cambiar la contraseña",
              description: response.mensaje || "Error de Cambio de Contraseña.",
              duration: 3000,
              type: "danger",
           });

        }
        else if(response.resultado === "ok") {
            showMessage({
              message: "Contraseña Cambiada",
              description: "La contraseña se ha cambiado exitosamente.",
              duration: 2000,
              type: "success",
            });
            setContrasenia("");
            setContrasenia2("");
            resetError();
            await AsyncStorage.removeItem("tokenRC");
            navigation.navigate("LoginScreen");
            
        } else {
            throw new Error("Respuesta inesperada del servidor.");
        }
    } catch (e) {
      console.error("Error al cambiar la contraseña:", e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    contrasenia,
    setContrasenia,
    contrasenia2,
    setContrasenia2,
    ErrorContrasenia: errorContrasenia,
    ErrorContrasenia2: errorContrasenia2,
    handleCambiarClave,
    loading,
    resetError,
  };
};

export default useCambiarClave;
