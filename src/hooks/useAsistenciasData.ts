import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';

const BACKEND_URL = `${API_URL}bin/controlador/api/consultarAsistenciaApi.php`;

export type Asistencia = {
  cedula: string;
  nombre: string;
  carrera: string;
  horario: string;
  fecha?: string;
};

type UseAsistenciasDataReturn = {
  asistencias: Asistencia[];
  loading: boolean;
  error: string | null;
  fetchAsistencias: () => Promise<void>;
  search: string;
  setSearch: (search: string) => void;
  page: number;
  pageCount: number;
  paginatedData: Asistencia[];
  filteredData: Asistencia[];
  handleChangePage: (next: boolean) => void;
  isEmpty: boolean;
};

export default function useAsistenciasData(): UseAsistenciasDataReturn {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(10);

  // Pagination
  const pageCount = Math.ceil(asistencias.length / itemsPerPage);
  const paginatedData = asistencias.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  // Search functionality with null checks
  const filteredData = asistencias.filter(item => {
    const searchTerm = search.toLowerCase();
    const safeCedula = String(item?.cedula || '').toLowerCase();
    const safeNombre = String(item?.nombre || '').toLowerCase();
    const safeCarrera = String(item?.carrera || '').toLowerCase();
    
    return safeCedula.includes(searchTerm) ||
           safeNombre.includes(searchTerm) ||
           safeCarrera.includes(searchTerm);
  });

  const fetchAsistencias = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      const datos = {
        mostrar: 'true',
        fecha: 'Seleccionar',
        horarioComida: 'Seleccionar'
      };


      
      const encryptedData = encryptData(datos);
      const formBody = new URLSearchParams();
      formBody.append('datos', encryptedData);

      const response = await axios.post(BACKEND_URL, formBody.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000 // 10 segundos de timeout
      });

    
      const data = response.data;
    

      if (Array.isArray(data)) {
        if (data.length === 0) {
          console.log('No hay asistencias registradas');
          setAsistencias([]);
          return;
        }
        
        // Mapear la respuesta de la API al formato esperado
        const asistenciasMapeadas = data.map((item: any) => ({
          cedula: item.Cedula || '',
          nombre: item.Nombre || `${item.nombre_estudiante || ''} ${item.apellido_estudiante || ''}`.trim(),
          carrera: item.Carrera || item.nombre_carrera || '',
          horario: item.HorarioDeComida || item.nombre_horario || '',
       
        }));
        console.log('Asistencias mapeadas:', asistenciasMapeadas);
        setAsistencias(asistenciasMapeadas);
      } else if (data && data.resultado === 'error') {
        throw new Error(data.mensaje || 'Error al obtener las asistencias');
      } else {
        console.error('Formato de respuesta inesperado:', data);
        setAsistencias([]);
      }
    } catch (error: any) {
      console.error('Error al obtener asistencias:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar las asistencias';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      setAsistencias([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        await fetchAsistencias();
      } catch (error) {
        if (isMounted) {
          console.error('Error in useEffect:', error);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [fetchAsistencias]);

  const handleChangePage = (next: boolean) => {
    setPage(prev => (next ? Math.min(prev + 1, pageCount - 1) : Math.max(prev - 1, 0)));
  };

  // Check if there's no data to display
  const isEmpty = asistencias.length === 0 && !loading && !error;

  return {
    asistencias,
    loading,
    error,
    fetchAsistencias,
    search,
    setSearch,
    page,
    pageCount,
    paginatedData: search ? filteredData.slice(page * itemsPerPage, (page + 1) * itemsPerPage) : paginatedData,
    filteredData,
    handleChangePage,
    isEmpty,
  };
}
