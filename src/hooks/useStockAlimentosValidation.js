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

export default function useStockAlimentosValidation(navigation) {
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

      if(data.resultado === 'error' && data.mensaje =='Token no válido o expirado') {
        Alert.alert('Error', 'Token no válido o expirado. Por favor, inicia sesión nuevamente.');
        await AsyncStorage.removeItem('token');
        navigation.navigate('LoginScreen');
        return;
      }

      

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

    const fechaExportacion = new Date().toLocaleString('es-VE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
const logoAsset = Asset.fromModule(require('../../assets/logo.png'));
await logoAsset.downloadAsync();
const base64Logo = await FileSystem.readAsStringAsync(logoAsset.localUri, {
  encoding: FileSystem.EncodingType.Base64,
});

const logoAssetU = Asset.fromModule(require('../../assets/uptaeb.png'));
await logoAssetU.downloadAsync();
const base64LogoU = await FileSystem.readAsStringAsync(logoAssetU.localUri, {
  encoding: FileSystem.EncodingType.Base64,
});



    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <style>
        @page {
          margin: 40px 30px 60px 30px;
          @bottom-center {
            content: "Página " counter(page) " / Servicio Nutricional";
            font-size: 12px;
            color: #666;
          }
        }

        body {
          font-family: 'Helvetica', Arial, sans-serif;
          margin: 0;
          padding: 0 24px;
          color: #333;
          line-height: 1.4;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #0066CC;
          padding-bottom: 15px;
          margin-bottom: 30px;
        }

        .header img {
          max-height: 70px;
          width: auto;
        }

        .header .title-container {
          flex: 1;
          text-align: center;
          color: #0066CC;
          font-weight: bold;
          letter-spacing: 1.2px;
        }

        .header .title-container h1 {
          margin: 0;
          font-size: 24px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .header .title-container p {
          margin: 4px 0 0 0;
          font-weight: 600;
          font-size: 14px;
          color: #222;
        }

        .report-title {
          text-align: center;
          font-size: 20px;
          color: #0066CC;
          font-weight: bold;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .report-summary {
          text-align: center;
          font-size: 13px;
          color: #444;
          margin-bottom: 25px;
          font-weight: 500;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        th, td {
          border: 1px solid #3399FF;
          padding: 8px 6px;
          text-align: center;
          font-size: 14px;
        }

        th {
          background-color: #0066CC;
          color: white;
        }

        tbody tr:nth-child(even) {
          background-color: #f6faff;
        }

        tfoot td {
          font-weight: bold;
          text-align: right;
          padding-right: 10px;
          background-color: #dceeff;
        }

        tfoot td.total {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="data:image/png;base64,${base64Logo}" alt="Logo" />
        <div class="title-container">
          <h1>Servicio Nutricional</h1>
          <p>Universidad Politécnica Territorial Andrés Eloy Blanco (UPTAEB)</p>
          <p>Barquisimeto - Estado Lara</p>
        </div>
        <img src="data:image/png;base64,${base64LogoU}" alt="Logo" />
      </div>

      <div class="report-title">Stock de Alimentos</div>
      <div class="report-summary">
        Fecha y hora de exportación: ${fechaExportacion} | Cantidad de registros: ${alimentos.length}
      </div>

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
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4">Total general</td>
            <td class="total">${totalStock}</td>
          </tr>
        </tfoot>
      </table>
    </body>
    </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
      setLoadingPdf(false);
      return;
    }

    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Exportar Inventario a PDF' });
    setLoadingPdf(false);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    Alert.alert('Error', 'No se pudo generar el PDF');
    setLoadingPdf(false);
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
