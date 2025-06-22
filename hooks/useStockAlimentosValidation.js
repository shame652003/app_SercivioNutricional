// hooks/useStockAlimentos.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useStockAlimentosValidation() {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);
  const [alimentosFiltrados, setAlimentosFiltrados] = useState([]);

  // Función para buscar alimentos desde la API
const buscarAlimentos = async (texto) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token no encontrado');

    const formData = new FormData();
    formData.append('mostrarAlimentos', 'true'); // pasar como string
    formData.append('alimento', texto);

    const response = await fetch('http://192.168.1.108/Servicio-Nutricional-Uptaeb/bin/controlador/api/stockAlimentosApi.php', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los alimentos');
    }

    const data = await response.json();

    setAlimentosFiltrados(data);

  } catch (error) {
    console.error('Error en búsqueda de alimentos:', error.message);
    Alert.alert('Error', error.message);
  }
};
  // Buscar automáticamente cuando cambia el texto
  useEffect(() => {
    if (searchText.trim() !== '') {
      buscarAlimentos(searchText);
    } else {
      setAlimentosFiltrados([]); // Limpiar si no hay texto
    }
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
