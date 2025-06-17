import { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { showMessage } from 'react-native-flash-message';
import useProfile from './useProfile';
import { useValidarNombreApellido, useValidarEmail } from './useValidacion';

export default function usePerfilValidation(profile) {
  const { handleUpdateProfile } = useProfile();

  // Usa los hooks de validación personalizados para nombre y apellido
  const [nombre, setNombre, errorNombre, , validarNombre] = useValidarNombreApellido();
  const [apellido, setApellido, errorApellido, , validarApellido] = useValidarNombreApellido();
  const [email, setEmail, errorEmail, , validarEmail] = useValidarEmail();

  // Inicializa los campos con el perfil actual
  const inicializarCampos = () => {
    setNombre(profile?.name || '');
    setApellido(profile?.lastName || '');
    setEmail(profile?.email || '');
  };

  // Cuando cambia el perfil, inicializa los campos
  useEffect(() => {
    inicializarCampos();
  }, [profile]);

  // Validar en tiempo real cada vez que cambia el valor
  useEffect(() => {
    validarNombre();
  }, [nombre]);

  useEffect(() => {
    validarApellido();
  }, [apellido]);

  useEffect(() => {
    validarEmail();
  }, [email]);

  // Validación completa para el formulario
  const validarFormulario = () => {
    validarNombre();
    validarApellido();
    validarEmail();

    return (
      nombre.trim() !== '' &&
      apellido.trim() !== '' &&
      email.trim() !== '' &&
      !errorNombre &&
      !errorApellido &&
      !errorEmail
    );
  };

  // Maneja cambio de imagen con ImagePicker y actualización de perfil
  const handleImageChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleUpdateProfile('profileImage', result.assets[0].uri);
      showMessage({
        message: 'Imagen actualizada!',
        type: 'success',
      });
    }
  };

  // Maneja el envío/modificación del perfil
  const handleCambioPerfil = () => {
    if (validarFormulario()) {
      handleUpdateProfile('name', nombre);
      handleUpdateProfile('lastName', apellido);
      handleUpdateProfile('email', email);

      showMessage({
        message: 'Modificado Exitosamente!',
        description: 'Datos Modificados del Perfil',
        type: 'success',
      });
    } else {
      showMessage({
        message: 'Error de Datos!',
        description: 'Ingrese los datos correctamente.',
        type: 'danger',
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
