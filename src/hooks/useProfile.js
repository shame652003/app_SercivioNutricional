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


  // 🔍 Validar si un correo ya está en uso
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
  

  // 🔁 Editar perfil (nombre, apellido, correo)
  const editarPerfil = async (nombre, apellido, correo) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');
  
      const correoFormateado = correo.trim().toLowerCase();
      const mismoCorreo = profile.correo === correoFormateado;

  
      // Validar nombre y apellido
      if (!nombre.trim() || !apellido.trim()) {
        showMessage({
          message: 'Campos incompletos',
          description: 'Nombre y apellido son obligatorios.',
          type: 'danger',
        });
        return false;
      }
  
      // Si el correo cambió, validarlo
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
  

  // 🖼️ Subir imagen de perfil
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

  // ❌ Eliminar imagen
  const eliminarImagenPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');
  
      // Preparar payload cifrado con la instrucción para borrar la imagen
      const encryptedPayload = encryptData({ borrar: true });
  
      const formData = new URLSearchParams();
      formData.append('datos', encryptedPayload);
  
      // Enviar solicitud al endpoint
      const response = await axios.post(BACKEND_URL, formData.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const data = response.data;
      console.log('Respuesta al eliminar imagen:', data);
  
      // Evaluar respuesta
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
