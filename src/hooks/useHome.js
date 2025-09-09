import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';
import usePermisos from './usePermisos';

const BACKEND_URL = `${API_URL}bin/controlador/api/homeApi.php`;

export default function useHome() {
  const [data, setData] = useState(null);
  const [graficoDataA, setGraficoDataA] = useState([]);
  const [graficoDataM, setGraficoDataM] = useState([]);
  const [loading, setLoading] = useState(true);

  const { permiso } = usePermisos();

  const tienePermiso = (modulo, nombrePermiso) => {
    if (!permiso) return false;
    return permiso.some(p =>
      p.idModulo === modulo &&
      p.nombrePermiso === nombrePermiso &&
      p.status === 1
    );
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const datos = await encryptData({ mostrarInfo: true });
        const formData = new FormData();
        formData.append('datos', datos);

        const response = await axios.post(BACKEND_URL, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        setData(response.data[0]);
      } catch (error) {
        console.error('Error al obtener datos del home:', error);
        Alert.alert('Error', 'No se pudo cargar la información.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    const fetchGraficoDataAlimentos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const datos = await encryptData({ graficoAsistencias: true });
        const formData = new FormData();
        formData.append('dataGraficoA', datos);

        const response = await axios.post(BACKEND_URL, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        const colors = ['#0662c5', '#0A3361', '#049ff9', '#201db8', '#266dbe', '#0400ff', '#001a51', '#049ff9', '#a2c8de', '#3665b6'];
        const parsedData = response.data.map((item, index) => ({
          name: item.nombre,
          population: parseInt(item.cantidad),
          color: colors[index % colors.length],
          legendFontColor: '#333',
          legendFontSize: 12,
        }));

        setGraficoDataA(parsedData);

      } catch (error) {
        console.error('Error al obtener datos del gráfico circular Asistencias:', error);
      }
    };

    fetchGraficoDataAlimentos();
  }, []);

  useEffect(() => {
    const fetchGraficoDataMenus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const datos = await encryptData({ graficoMenus: true });
        const formData = new FormData();
        formData.append('dataGraficoM', datos);

        const response = await axios.post(BACKEND_URL, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        const colors = ['#0662c5', '#0A3361', '#049ff9', '#201db8', '#266dbe', '#0400ff', '#001a51', '#049ff9', '#a2c8de', '#3665b6'];
        const parsedData = response.data.map((item, index) => ({
          name: item.nombre,
          population: parseInt(item.cantidad),
          color: colors[index % colors.length],
          legendFontColor: '#333',
          legendFontSize: 12,
        }));

        setGraficoDataM(parsedData);

      } catch (error) {
        console.error('Error al obtener datos del gráfico circular Data Menu:', error);
      }
    };

    fetchGraficoDataMenus();
  }, []);

  return { data, graficoDataA, graficoDataM, loading, tienePermiso };
}
