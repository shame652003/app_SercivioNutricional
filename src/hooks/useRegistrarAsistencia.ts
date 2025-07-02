import { useState } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

const BACKEND_URL = `${API_URL}bin/controlador/api/asistenciaApi.php`;

type RegistrarAsistenciaResult = {
  loading: boolean;
  error: string | null;
  success: boolean;
  registrarAsistencia: (cedula: string, idMenu: number, horario: string) => Promise<boolean>;
};

export default function useRegistrarAsistencia(): RegistrarAsistenciaResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registrarAsistencia = async (cedula: string, idMenu: number, horario: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No se encontró el token de autenticación');

      // 1. Verificar si ya está registrado
      const datosVerificar = {
        verificar: 'true',
        horarioComida: horario,
        id: cedula
      };
      const encryptedVerificar = encryptData(datosVerificar);
      const formBodyVerificar = new URLSearchParams();
      formBodyVerificar.append('datos', encryptedVerificar);

      const responseVerificar = await axios.post(BACKEND_URL, formBodyVerificar.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        }
      });
      const dataVerificar = responseVerificar.data;
      
      
      // Manejar el nuevo formato de respuesta
      if (dataVerificar && dataVerificar.resultado) {
        if (dataVerificar.resultado.toLowerCase().includes('ya ingreso')) {
          showMessage({
            message: 'Atención',
            description: 'El estudiante ya está registrado para este menú.',
            type: 'danger',
          });
          setError('El estudiante ya está registrado para este menú.');
          setLoading(false);
          return false;
        }
      } else {
        
        showMessage({
          message: 'Error',
          description: 'No se pudo verificar el registro.',
          type: 'danger',
        });
        setError('No se pudo verificar el registro.');
        setLoading(false);
        return false;
      }

      // 2. Registrar asistencia
      const datosRegistrar = {
        registrar: 'true',
        id: cedula,
        idmenu: idMenu
      };
      const encryptedRegistrar = encryptData(datosRegistrar);
      const formBodyRegistrar = new URLSearchParams();
      formBodyRegistrar.append('datos', encryptedRegistrar);

      const responseRegistrar = await axios.post(BACKEND_URL, formBodyRegistrar.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        }
      });
      const dataRegistrar = responseRegistrar.data;
      
      // Manejar el nuevo formato de respuesta
      if (dataRegistrar && dataRegistrar.resultado) {
        if (dataRegistrar.resultado.toLowerCase().includes('exitoso')) {
          setSuccess(true);
          showMessage({
            message: 'Éxito',
            description: 'Asistencia registrada correctamente.',
            type: 'success',
          });
          return true;
        } else if (dataRegistrar.resultado.toLowerCase().includes('error')) {
          setError(dataRegistrar.resultado);
          showMessage({
            message: 'Error',
            description: dataRegistrar.resultado,
            type: 'danger',
          });
          return false;
        }
      } else {
        setError('No se pudo registrar la asistencia.');
        showMessage({
          message: 'Error',
          description: 'No se pudo registrar la asistencia.',
          type: 'danger',
        });
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrar asistencia.');
      showMessage({
        message: 'Error',
        description: err.message || 'Error al registrar asistencia.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, registrarAsistencia };
}
