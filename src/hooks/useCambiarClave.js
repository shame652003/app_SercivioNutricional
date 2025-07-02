import { useState, useEffect } from "react";
import { useValidarLasContrasenas } from "./useValidacion";
import { showMessage } from 'react-native-flash-message';
import { API_URL } from '@env';
import { encryptData } from '../security/crypto/encryptor';
import axios from "axios";

const BACKEND_URL = `${API_URL}bin/controlador/api/cambiarClaveApi.php`;

const useCambiarClave = (navigation, datos) => {
 const [
    contrasenia,
    setContrasenia,
    contrasenia2,
    setContrasenia2,
    errorContrasenia,
    errorContrasenia2,
    validar,
    resetError,
  ] = useValidarLasContrasenas();

const [loading, setLoading] = useState(false);

const handleCambiarClave = async () => {
  if (!validar()) {
    return; 
  }

  setLoading(true);
  try {
    const encryptedContrasenia = encryptData({
      cambiarClave: true,
      codigo: datos.codigo,
      clave: contrasenia,
      clave2: contrasenia2,
      correo: datos.correo,
    });
    const formBody = new URLSearchParams();
    formBody.append("datos", encryptedContrasenia);

    const response = await axios.post(BACKEND_URL, formBody.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.resultado === "error") {
      showMessage({
        message: "Error al cambiar la contraseña",
        description: response.data.mensaje || "Error de Cambio de Contraseña.",
        duration: 3000,
        type: "danger",
      });
    } else if (response.data.resultado === "ok") {
      showMessage({
        message: "Contraseña Cambiada",
        description: "La contraseña se ha cambiado exitosamente.",
        duration: 2000,
        type: "success",
        onHide: async () => {
          setContrasenia("");
          setContrasenia2("");
          resetError();
          navigation.navigate("LoginScreen");
        },
      });
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
