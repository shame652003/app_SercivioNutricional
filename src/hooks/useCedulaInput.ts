import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';

const BACKEND_URL = `${API_URL}bin/controlador/api/asistenciaApi.php`;

export interface Estudiante {
  cedula: string;
  nombre: string;
  apellido: string;
  carrera: string;
  seccion: string;
}

export default function useCedulaInput() {
  const [cedula, setCedula] = useState('');
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const buscarEstudiante = async (cedulaABuscar: string) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const datos = {
        verEstudiantes: 'true',
        id: cedulaABuscar,
      };

      const encryptedData = encryptData(datos);
      const formBody = new URLSearchParams();
      formBody.append('datos', encryptedData);

      const response = await axios.post(BACKEND_URL, formBody.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = response.data;
    
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setEstudiante(null);
        showMessage({
          message: 'No encontrado',
          description: 'Estudiante no registrado.',
          type: 'danger',
        });
        return;
      }

      try {
        
      } catch (error) {
        
      }


      const studentData = Array.isArray(data) ? data[0] : data;
      
      const estudianteMapeado = {
        cedula: studentData.cedEstudiante,
        nombre: studentData.nombre,
        apellido: studentData.apellido,
        carrera: studentData.carrera,
        seccion: studentData.seccion
      };
      

    

      if (estudianteMapeado.cedula) {
        setLoading(true);
        setEstudiante(estudianteMapeado);
      } else {
        setEstudiante(null);
         showMessage({
                message: 'Error de Datos!',
                description: 'Formato de datos inválido del servidor',
                type: 'danger',
              });
      }
    } catch (error: any) {
      showMessage({
        message: 'Error',
        description: error.message || 'Ocurrió un error al buscar el estudiante',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCedulaChange = (text: string) => {
    setCedula(text);
    
    // Cancelar la búsqueda anterior si existe
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Si la cédula tiene 7 o más caracteres, programar la búsqueda con un retraso
    if (text.length >= 7) {
      searchTimeoutRef.current = setTimeout(() => {
        setLoading(true);
        buscarEstudiante(text);
      }, 2000); // 2 segundos de retraso
    }
  };

  const setByQR = (qrCedula: string) => {
    // Cancelar cualquier búsqueda pendiente al escanear QR
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setCedula(qrCedula);
    // Búsqueda inmediata para QR
    buscarEstudiante(qrCedula);
    setLoading(true);
  };

  const clear = () => {
    setCedula('');
    setEstudiante(null);
  };

  return { cedula, estudiante, handleCedulaChange, clear, setByQR, loading };
}
