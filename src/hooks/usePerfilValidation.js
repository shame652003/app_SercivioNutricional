import { useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import useProfile from "./useProfile";
import { useValidarNombreApellido, useValidarEmail } from "./useValidacion";

export default function usePerfilValidation(profile) {

  const [nombre, setNombre, errorNombre, , validarNombre] =
    useValidarNombreApellido();
  const [apellido, setApellido, errorApellido, , validarApellido] =
    useValidarNombreApellido();
  const [email, setEmail, errorEmail, , validarEmail] = useValidarEmail();

  // Inicializa los campos con los datos del perfil
  const inicializarCampos = () => {
    setNombre(profile?.nombre || "");
    setApellido(profile?.apellido || "");
    setEmail(profile?.correo || "");
  };

  useEffect(() => {
    inicializarCampos();
  }, [profile]);

  useEffect(() => {
    validarNombre();
  }, [nombre]);

  useEffect(() => {
    validarApellido();
  }, [apellido]);

  useEffect(() => {
    validarEmail();
  }, [email]);

  const validarFormulario = () => {
    validarNombre();
    validarApellido();
    validarEmail();

    return (
      nombre.trim() !== "" &&
      apellido.trim() !== "" &&
      email.trim() !== "" &&
      !errorNombre &&
      !errorApellido &&
      !errorEmail
    );
  };

  const handleImageChange = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        subirImagenPerfil(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al abrir galería:', error);
      showMessage({
        message: 'Error',
        description: 'No se pudo abrir la galería',
        type: 'danger',
      });
    }
  };

  const { editarPerfil, subirImagenPerfil } = useProfile();

  const handleCambioPerfil = () => {
    if (validarFormulario()) {
      editarPerfil(nombre, apellido, email);
    } else {
      showMessage({
        message: "Error de Datos!",
        description: "Ingrese los datos correctamente.",
        type: "danger",
      });
    }
  };

  return {
    nombre,
    setNombre,
    errorNombre,
    apellido,
    setApellido,
    errorApellido,
    email,
    setEmail,
    errorEmail,
    inicializarCampos,
    handleImageChange,
    handleCambioPerfil,
  };
}
