import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BACKEND_URL = `${API_URL}bin/controlador/api/stockAlimentosApi.php`;


export default function useStockAlimentosValidation() {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);
  const [alimentosFiltrados, setAlimentosFiltrados] = useState([]);

  const timeoutRef = useRef(null); 

  const buscarAlimentos = async (texto) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token no encontrado');

    const formData = new FormData();
    formData.append('mostrarAlimentos', 'true');
    formData.append('alimento', texto);

    const response = await axios.post( BACKEND_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = response.data;

    const alimentosConImagen = data.map((alimento) => ({
      ...alimento,
      imagenUri: { uri: API_URL + alimento.imgAlimento },
    }));

    setAlimentosFiltrados(alimentosConImagen);
  } catch (error) {
    const mensaje =
      error.response?.data?.message || error.message || 'Error desconocido';
    console.error('Error en búsqueda de alimentos:', mensaje);
    Alert.alert('Error', mensaje);
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
    seleccionarAlimento,
    cerrarModal,
  };
}
