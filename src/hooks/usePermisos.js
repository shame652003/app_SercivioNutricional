import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';
import { useSelector } from 'react-redux'; 

const BACKEND_URL = `${API_URL}/Servicio-Nutricional-Uptaeb/bin/controlador/api/permisoApi.php`;

export default function usePermisos() {
  const [permiso, setPermiso] = useState(null);
  const user = useSelector((state) => state.user.user);


 useEffect(() => {
  const fetchPermisos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const idRol = user.rol;
      console.log('ID Rol:', idRol);
      console.log('Token:', token);
      if (!token || !idRol) throw new Error('Token o rol no encontrado');

      const datos = await encryptData({ mostrarPermisos: true, idRol });
      const formData = new FormData();
      formData.append('datos', datos);

      const response = await axios.post(BACKEND_URL, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.resultado === 'error' && response.data.mensaje === 'Token no válido o expirado') {
         Alert.alert('Error', 'Sesion expirada. Por favor, inicia sesión nuevamente.');
         await AsyncStorage.removeItem('token');
         dispatch({ type: 'USER_SUCCESS', payload: null }); 
         return;
      }
      console.log('Datos de permisos:', response.data);
      setPermiso(response.data);
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      Alert.alert('Error', 'No se pudo cargar la información de permisos.');
    }
  };

  fetchPermisos(); 
}, [user]); 

  return { permiso };
}
