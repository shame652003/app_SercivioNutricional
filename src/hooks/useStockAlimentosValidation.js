import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const BACKEND_URL = `${API_URL}bin/controlador/api/stockAlimentosApi.php`;
const BACKEND_URL_PDF = `${API_URL}bin/controlador/api/pdfStockAlimentoApi.php`;

export default function useStockAlimentosValidation() {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);
  const [alimentosFiltrados, setAlimentosFiltrados] = useState([]);
  const [busquedaExitosa, setBusquedaExitosa] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const [loadingPdf, setLoadingPdf] = useState(false);


  const buscarAlimentos = async (texto) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const encryptedData = encryptData({
        mostrarAlimentos: 'true',
        alimento: texto,
      });

      const formBody = new URLSearchParams();
      formBody.append('datos', encryptedData);

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
        error.response?.data?.mensaje || error.message || 'Error desconocido';
      console.error('Error en búsqueda de alimentos:', mensaje);
      Alert.alert('Error', mensaje);
    } finally {
      setLoading(false);
    }
  };

  const obtenerStockCompleto = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');
      console.log('token pdf:', token)

      const encrypted = encryptData({ mostrarAlimentosTotal: 'true' });
      console.log('dato encriptado pdf', encrypted);
      const formBody = new URLSearchParams();
      formBody.append('consultarStockTotal', encrypted);
      console.log('url de endpoint pdf', BACKEND_URL_PDF);

      const response = await axios.post(BACKEND_URL_PDF, formBody.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log(response.data);

      return response.data;
    } catch (error) {
      console.error('Error al obtener inventario completo:', error);
      Alert.alert('Error', 'No se pudo obtener el inventario completo.');
      return [];
    }
  };

  const generarPdf = async () => {
    try {
        setLoadingPdf(true);

    const alimentos = await obtenerStockCompleto();

    if (!alimentos.length) {
      Alert.alert('Aviso', 'No hay datos para generar el PDF.');
      setLoadingPdf(false);
      return;
    }

      const totalStock = alimentos.reduce(
        (acc, a) => acc + (Number(a.stock) + Number(a.reservado)),
        0
      );

      const logoAsset = Asset.fromModule(require('../../assets/logo.png'));
      await logoAsset.downloadAsync();
      const base64Logo = await FileSystem.readAsStringAsync(logoAsset.localUri || '', {
        encoding: FileSystem.EncodingType.Base64,
      });

    const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        @page {
          margin-top: 40px;
          margin-bottom: 40px;
          margin-left: 24px;
          margin-right: 24px;
        }

        body {
          font-family: Arial, sans-serif;
          padding: 24px;
        }

        .encabezado {
          color: #000;
          text-align: center;
          padding: 10px 20px;
          border-radius: 8px;
        }

        .encabezado img {
          height: 100px;
          margin-bottom: 10px;
        }

        h2 {
          color: #0066CC;
          text-align: center;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }

        th, td {
          border: 1px solid #3399FF;
          padding: 8px 6px;
          text-align: center;
          font-size: 14px;
        }

        th {
          background: #0066CC;
          color: #fff;
        }

        tr:nth-child(even) {
          background: #f6faff;
        }
      </style>
    </head>
    <body>
      <div class="encabezado">
        <h3><strong>Servicio Nutricional</strong></h3>
        <h3>Universidad Politécnica Territorial Andrés Eloy Blanco</h3>
        <h3>Barquisimeto - Edo - Lara</h3>
        <img src="data:image/png;base64,${base64Logo}" alt="Logo" />
      </div>
      <h2>Stock de Alimentos</h2>
      <table>
        <thead>
          <tr>
            <th>Alimento</th>
            <th>Marca</th>
            <th>Stock</th>
            <th>Reservado</th>
            <th>Stock Total</th>
          </tr>
        </thead>
        <tbody>
          ${alimentos.map(a => `
            <tr>
              <td>${a.nombre}</td>
              <td>${a.marca}</td>
              <td>${a.stock}</td>
              <td>${a.reservado}</td>
              <td>${Number(a.stock) + Number(a.reservado)}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="4" style="font-weight:bold; text-align:right;">Total general</td>
            <td style="font-weight:bold; text-align:center;">${totalStock}</td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
`;


      const { uri } = await Print.printToFileAsync({ html });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
        return;
      }
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Exportar Inventario a PDF' });
       setLoadingPdf(false);

    } catch (error) {
      console.error('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
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
    loading,
    loadingPdf,
    seleccionarAlimento,
    cerrarModal,
    generarPdf,
  };
}
