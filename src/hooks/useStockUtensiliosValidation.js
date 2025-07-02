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

const BACKEND_URL = `${API_URL}bin/controlador/api/stockUtensiliosApi.php`;
const BACKEND_URL_PDF = `${API_URL}bin/controlador/api/pdfStockUtensilioApi.php`;

export default function useStockUtensiliosValidation() {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [utensilioSeleccionado, setUtensilioSeleccionado] = useState(null);
  const [utensiliosFiltrados, setUtensiliosFiltrados] = useState([]);
  const [busquedaExitosa, setBusquedaExitosa] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const buscarUtensilios = async (texto) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const encryptedData = encryptData({
        mostrarUtensilios: 'true',
        utensilio: texto,
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
        const utensiliosConImagen = data.map((u) => ({
          ...u,
          imagenUri: { uri: API_URL + u.imgUtensilios },
        }));
        setUtensiliosFiltrados(utensiliosConImagen);
      } else {
        setUtensiliosFiltrados([]);
      }

      setBusquedaExitosa(true);
    } catch (error) {
      setBusquedaExitosa(false);
      const mensaje =
        error.response?.data?.mensaje || error.message || 'Error desconocido';
      console.error('Error en búsqueda de utensilios:', mensaje);
      Alert.alert('Error', mensaje);
    } finally {
      setLoading(false);
    }
  };

  const obtenerStockCompleto = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const encrypted = encryptData({ mostrarUtensiliosTotal: 'true' });
      const formBody = new URLSearchParams();
      formBody.append('consultarStockTotal', encrypted);

      const response = await axios.post(BACKEND_URL_PDF, formBody.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al obtener inventario de utensilios:', error);
      Alert.alert('Error', 'No se pudo obtener el inventario de utensilios.');
      return [];
    }
  };

  const generarPdf = async () => {
    try {
      setLoadingPdf(true);
      const utensilios = await obtenerStockCompleto();

      if (!utensilios.length) {
        Alert.alert('Aviso', 'No hay datos para generar el PDF.');
        setLoadingPdf(false);
        return;
      }

      const totalStock = utensilios.reduce(
        (acc, u) => acc + (Number(u.stock) + Number(u.reservado || 0)),
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
      <h2>Stock de Utensilios</h2>
      <table>
        <thead>
          <tr>
            <th>Utensilio</th>
            <th>Material</th>
            <th>Stock</th>
            <th>Reservado</th>
            <th>Stock Total</th>
          </tr>
        </thead>
        <tbody>
          ${utensilios.map(u => `
            <tr>
              <td>${u.nombre}</td>
              <td>${u.material}</td>
              <td>${u.stock}</td>
              <td>${u.reservado || 0}</td>
              <td>${Number(u.stock) + Number(u.reservado || 0)}</td>
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
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Exportar Inventario a PDF',
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
    } finally {
      setLoadingPdf(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchText.trim() !== '') {
      timeoutRef.current = setTimeout(() => {
        buscarUtensilios(searchText);
      }, 700);
    } else {
      setUtensiliosFiltrados([]);
      setBusquedaExitosa(false);
      setLoading(false);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [searchText]);

  const seleccionarUtensilio = (item) => {
    setUtensilioSeleccionado(item);
    setModalVisible(true);
  };

  const cerrarModal = () => setModalVisible(false);

  return {
    searchText,
    setSearchText,
    modalVisible,
    utensilioSeleccionado,
    utensiliosFiltrados,
    busquedaExitosa,
    loading,
    loadingPdf,
    seleccionarUtensilio,
    cerrarModal,
    generarPdf,
  };
}
