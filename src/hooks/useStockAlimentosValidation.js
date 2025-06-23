import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';

const BACKEND_URL = `${API_URL}bin/controlador/api/stockAlimentosApi.php`;

export default function useStockAlimentosValidation() {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);
  const [alimentosFiltrados, setAlimentosFiltrados] = useState([]);
  const [busquedaExitosa, setBusquedaExitosa] = useState(false);
  const [loading, setLoading] = useState(false); // <-- Nuevo estado loading

  const timeoutRef = useRef(null);

  const buscarAlimentos = async (texto) => {
    try {
      setLoading(true);  // Empieza la carga
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const payloadObjeto = {
        mostrarAlimentos: 'true',
        alimento: texto,
      };

      const encryptedPayload = encryptData(payloadObjeto);

      const formBody = new URLSearchParams();
      formBody.append('payload', encryptedPayload);

      const response = await axios.post(BACKEND_URL, formBody.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const alimentosConImagen = data.map((alimento) => ({
          ...alimento,
          imagenUri: { uri: API_URL + alimento.imgAlimento },
        }));
        setAlimentosFiltrados(alimentosConImagen);
      } else {
        setAlimentosFiltrados([]);
      }

      setBusquedaExitosa(true);
    } catch (error) {
      setBusquedaExitosa(false);
      const mensaje =
        error.response?.data?.message || error.message || 'Error desconocido';
      console.error('Error en búsqueda de alimentos:', mensaje);
      Alert.alert('Error', mensaje);
    } finally {
      setLoading(false); // Termina la carga, pase lo que pase
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchText.trim() !== '') {
      timeoutRef.current = setTimeout(() => {
        buscarAlimentos(searchText);
      }, 700);
    } else {
      setAlimentosFiltrados([]);
      setBusquedaExitosa(false);
      setLoading(false);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [searchText]);

  const seleccionarAlimento = (item) => {
    setAlimentoSeleccionado(item);
    setModalVisible(true);
  };

  const cerrarModal = () => setModalVisible(false);

  return {
    searchText,
    setSearchText,
    modalVisible,
    alimentoSeleccionado,
    alimentosFiltrados,
    busquedaExitosa,
    loading,           // <-- Exportamos loading
    seleccionarAlimento,
    cerrarModal,
  };
}
