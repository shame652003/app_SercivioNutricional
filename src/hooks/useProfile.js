import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../context/actions/profileActions';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

const BACKEND_URL = `${API_URL}bin/controlador/api/perfilApi.php`;

export default function useProfile() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const profileImage = profile.img ? `${API_URL}${profile.img}` : null;

  const handleUpdateProfile = (field, value) => {
    dispatch(updateProfile({ [field]: value }));
  };

  const formatearTextoPerfil = (nombre, apellido, correo) => {
  const formatear = (texto) =>
    texto.trim().charAt(0).toUpperCase() + texto.trim().slice(1).toLowerCase();

  const formatearCorreo = (email) =>
    email.trim().charAt(0).toUpperCase() + email.trim().slice(1).toLowerCase();

  return {
    nombre: formatear(nombre),
    apellido: formatear(apellido),
    correo: formatearCorreo(correo),
  };
};

  const validarCorreo = async (correo) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');
  
      console.log('Validando correo:', correo);
      console.log('Token:', token);
  
      const correoFormateado = correo.trim().toLowerCase();

      const encryptedPayload = encryptData({
        validarCorreo: true,
        correo: correoFormateado
     });

      const formData = new URLSearchParams();
      formData.append('datos', encryptedPayload);
  
      const response = await axios.post(BACKEND_URL, formData.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = response.data;
      console.log('Respuesta del backend:', data);

      if(data.resultado === 'error' && data.mensaje === 'Token no válido o expirado') {
        console.error('Token no válido o expirado. Eliminando token y redirigiendo a login.');
        await AsyncStorage.removeItem('token');     
      }

      if (data.resultado === 'ok') {
        console.log('Correo disponible');
        return true;
      } else if (data.resultado === 'error correo') {
        console.log('Correo en uso');
        return false;
      } else {
        console.error('Respuesta inesperada del backend:', data);
        return false;
      }
  
    } catch (error) {
      console.error('Error completo al validar correo:', error);
      console.error('Mensaje del error:', error.message);
      return false;
    }
  };
  
  const editarPerfil = async (nombre, apellido, correo) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');
  
      const correoFormateado = correo.trim().toLowerCase();
      const mismoCorreo = profile.correo === correoFormateado;

      if (!nombre.trim() || !apellido.trim()) {
        showMessage({
          message: 'Campos incompletos',
          description: 'Nombre y apellido son obligatorios.',
          type: 'danger',
        });
        return false;
      }
      if (!mismoCorreo) {
        const correoDisponible = await validarCorreo(correo);
        if (!correoDisponible) {
          showMessage({
            message: 'Error',
            description: 'El correo electrónico ya está en uso o no es válido.',
            type: 'danger',
          });
          return false;
        }
      }

      const datosFormateados = formatearTextoPerfil(nombre, apellido, correo);
  
      const encryptedPayload = encryptData(datosFormateados);
  
      const formData = new URLSearchParams();
      formData.append('datos', encryptedPayload);
  
      const response = await axios.post(BACKEND_URL, formData.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const data = response.data;
      
      console.log('Respuesta al editar perfil:', data);
  
      if (data.resultado === 'success') {
        dispatch(updateProfile({ nombre, apellido, correo }));
        showMessage({
          message: 'Perfil actualizado',
          description: data.mensaje,
          type: 'success',
        });
        return true;
      } else {
        throw new Error(data.mensaje || 'Error al actualizar perfil');
      }
    } catch (error) {
      showMessage({
        message: 'Error',
        description: error.message,
        type: 'danger',
      });
      return false;
    }
  };
  
  const subirImagenPerfil = async (uri) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const formData = new FormData();
      formData.append('accion', 'imagenPerfil');
      formData.append('imagen', {
        uri,
        name: 'perfil.png',
        type: 'image/png',
      });

      const response = await axios.post(BACKEND_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;

      if (data.resultado === 'success') {
        dispatch(updateProfile({ img: data.img }));
        showMessage({
          message: 'Imagen actualizada',
          type: 'success',
        });
        return true;
      } else {
        throw new Error(data.mensaje || 'Error al subir imagen');
      }
    } catch (error) {
      showMessage({
        message: 'Error',
        description: error.message,
        type: 'danger',
      });
      return false;
    }
  };

  const eliminarImagenPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const encryptedPayload = encryptData({ borrar: true });
  
      const formData = new URLSearchParams();
      formData.append('datos', encryptedPayload);

      const response = await axios.post(BACKEND_URL, formData.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const data = response.data;

      if (response.data.resultado === 'error' && response.data.mensaje === 'Token no válido o expirado') {
         Alert.alert('Error', 'Sesion expirada. Por favor, inicia sesión nuevamente.');
         await AsyncStorage.removeItem('token');
         dispatch({ type: 'USER_SUCCESS', payload: null }); 
         return;
      }
      console.log('Respuesta al eliminar imagen:', data);

      if (data.resultado === 'success') {
        console.log('Actualizando estado de imagen en Redux:', data.img);
        dispatch(updateProfile({ img: data.img }));
        
        showMessage({
          message: 'Imagen eliminada',
          description: data.mensaje || 'Se ha restablecido la imagen de perfil',
          type: 'success',
        });
        return true;
      } else {
        throw new Error(data.mensaje || 'Error al eliminar imagen');
      }
  
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
  
      showMessage({
        message: 'Error',
        description: error.message,
        type: 'danger',
      });
      return false;
    }
  };

  return {
    profile,
    profileImage,
    handleUpdateProfile,
    editarPerfil,
    subirImagenPerfil,
    eliminarImagenPerfil
  };
}
