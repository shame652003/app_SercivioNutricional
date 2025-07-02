import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

const BACKEND_URL = `${API_URL}bin/controlador/api/asistenciaApi.php`;

type HorarioComida = 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena';

export default function usePlatosPorHorario() {
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<HorarioComida>('Desayuno');
  const [platosDisponibles, setPlatosDisponibles] = useState<Record<HorarioComida, number>>({
    'Desayuno': 0,
    'Almuerzo': 0,
    'Merienda': 0,
    'Cena': 0
  });
  const [idMenu, setIdMenu] = useState<number | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  // Función para obtener el ID del menú
  const obtenerIdMenu = useCallback(async (horario: HorarioComida): Promise<number | null> => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showMessage({
          message: 'Error',
          description: 'No se encontró el token de autenticación',
          type: 'danger',
        });
        return null;
      }

      const datos = {
        vermenu: 'true',
        horario: horario
      };

      const encryptedData = encryptData(datos);
      const formBody = new URLSearchParams();
      formBody.append('datos', encryptedData);

      const response = await axios.post(BACKEND_URL, formBody.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;
      
      if (Array.isArray(data) && data.length > 0 && data[0].idMenu) {
        const menuId = Number(data[0].idMenu);
        return menuId;
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener el ID del menú:', error);
      return null;
    }
  }, []);

  // Función para obtener los platos disponibles del servidor
  const obtenerPlatosDisponibles = useCallback(async (horario: HorarioComida) => {
    try {
      setCargando(true);
      
      // Primero obtenemos el ID del menú
      const menuId = await obtenerIdMenu(horario);
      if (menuId) {
        setIdMenu(menuId);
      }
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showMessage({
          message: 'Error',
          description: 'No se encontró el token de autenticación',
          type: 'danger',
        });
        return 0;
      }

      const datos = {
        verPlatosDisponibles: 'true',
        horarioComida: horario
      };

      const encryptedData = encryptData(datos);
      const formBody = new URLSearchParams();
      formBody.append('datos', encryptedData);

      const response = await axios.post(BACKEND_URL, formBody.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;
      
      let cantidadPlatos = 0; // Valor por defecto
      
      // Verificar si la respuesta es un array
      if (Array.isArray(data)) {
        if (data.length > 0) {
          // Si hay elementos en el array, buscar platosDisponibles
          if (data[0].platosDisponibles !== undefined) {
            cantidadPlatos = Number(data[0].platosDisponibles);
          }
          
          // Si hay un mensaje de error, mostrarlo
          if (data[0].error) {
            showMessage({
              message: 'Error',
              description: data[0].error,
              type: 'danger',
            });
          }
        } else {
          // Array vacío - no hay menú disponible
          showMessage({
            message: 'Menú No Disponible', 
            description: 'El Horario que fue Seleccionado No se Encuentra Disponible, Verifique si Hay un Menú Planificado para Hoy',
            type: 'danger',
          });
        }
      } else if (typeof data === 'object' && data !== null) {
        // Si la respuesta es un objeto, verificar si hay un mensaje de error
        if (data.error || data.message) {
          showMessage({
            message: 'Error',
            description: data.error || data.message,
            type: 'danger',
          });
        } else if (data.platosDisponibles !== undefined) {
          cantidadPlatos = Number(data.platosDisponibles);
        }
      } else {
        console.error('Formato de respuesta no reconocido:', data);
        throw new Error('Formato de respuesta no reconocido');
      }
      
      // Actualizar el estado con la cantidad de platos
      setPlatosDisponibles(prev => ({
        ...prev,
        [horario]: cantidadPlatos
      }));
      
      return cantidadPlatos;
      
      return data.cantPlatos;
    } catch (error: any) {
      console.error('Error al obtener platos disponibles:', error);
      const mensajeError = error.message || 'Error al obtener platos disponibles';
      showMessage({
        message: 'Error',
        description: mensajeError,
        type: 'danger',
      });
    } finally {
      setCargando(false);
    }
  }, []);

  // Cargar platos disponibles cuando cambia el horario seleccionado
  useEffect(() => {
    obtenerPlatosDisponibles(horarioSeleccionado).catch(console.error);
  }, [horarioSeleccionado, obtenerPlatosDisponibles]);

  // Función para actualizar los platos disponibles
  const actualizarPlatosDisponibles = useCallback(async () => {
    try {
      return await obtenerPlatosDisponibles(horarioSeleccionado);
    } catch (error) {
      console.error('Error al actualizar platos:', error);
      throw error;
    }
  }, [horarioSeleccionado, obtenerPlatosDisponibles]);

  // Verificar si hay platos disponibles
  const hayPlatosDisponibles = useCallback(() => {
    return platosDisponibles[horarioSeleccionado] > 0;
  }, [platosDisponibles, horarioSeleccionado]);

  // Cambiar el horario y cargar los platos disponibles
  const cambiarHorario = useCallback(async (nuevoHorario: HorarioComida) => {
    setHorarioSeleccionado(nuevoHorario);
    await obtenerPlatosDisponibles(nuevoHorario);
  }, [obtenerPlatosDisponibles]);

  const descontarPlato = () => {
    if (platosDisponibles[horarioSeleccionado] > 0) {
      setPlatosDisponibles(prev => ({
        ...prev,
        [horarioSeleccionado]: prev[horarioSeleccionado] - 1
      }));
    }
  };

  const resetearPlatos = () => {
  };

  return {
    horarioSeleccionado,
    platosDisponibles: platosDisponibles[horarioSeleccionado],
    idMenu, // Exponer el ID del menú
    cargando,
    cambiarHorario,
    actualizarPlatosDisponibles,
    hayPlatosDisponibles,
    obtenerPlatosDisponibles: () => obtenerPlatosDisponibles(horarioSeleccionado)
  };
}
