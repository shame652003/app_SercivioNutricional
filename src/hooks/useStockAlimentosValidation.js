import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { useDispatch } from 'react-redux';

const BACKEND_URL = `${API_URL}bin/controlador/api/stockAlimentosApi.php`;
const ITEMS_PER_PAGE = 10;

export default function useStockAlimentosValidation(navigation) {
const [searchText, setSearchText] = useState('');
const [modalVisible, setModalVisible] = useState(false);
const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);
const [alimentosFiltrados, setAlimentosFiltrados] = useState([]);
const [busquedaExitosa, setBusquedaExitosa] = useState(false);
const [loading, setLoading] = useState(false);
const [loadingPdf, setLoadingPdf] = useState(false);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [totalAlimentos, setTotalAlimentos] = useState(0);
const timeoutRef = useRef(null);
  const dispatch = useDispatch();

const buscarAlimentos = async (texto, isInitialSearch = false) => {
try {
if (isInitialSearch) {
setLoading(true);
setPage(1);
setAlimentosFiltrados([]);
}

const token = await AsyncStorage.getItem('token');
if (!token) throw new Error('Token no encontrado');

const encryptedData = encryptData({
alimento: texto,
page: isInitialSearch ? 1 : page,
limit: ITEMS_PER_PAGE,
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

console.log('Respuesta de búsqueda de alimentos:', data);

if (data.resultado === 'error' && data.mensaje === 'Token no válido o expirado') {
Alert.alert('Error', 'Sesion expirada. Por favor, inicia sesión nuevamente.');
await AsyncStorage.removeItem('token');
return;
}

const alimentosConImagen = (Array.isArray(data) ? data : []).map((alimento) => ({
...alimento,
imagenUri: { uri: API_URL + alimento.imgAlimento },
}));

if (isInitialSearch) {
setAlimentosFiltrados(alimentosConImagen);
} else {
setAlimentosFiltrados(prevAlimentos => [...prevAlimentos, ...alimentosConImagen]);
}

setHasMore(alimentosConImagen.length === ITEMS_PER_PAGE);
setBusquedaExitosa(true);
} catch (error) {
setBusquedaExitosa(false);
const mensaje = error.response?.data?.mensaje || error.message || 'Error desconocido';
console.error('Error en búsqueda de alimentos:', mensaje);
Alert.alert('Error', mensaje);
} finally {
setLoading(false);
}
};


const obtenerStockCompleto = async (isInitialLoad = false) => {
try {
if (isInitialLoad) {
setLoading(true);
setPage(1);
setAlimentosFiltrados([]);
}

const token = await AsyncStorage.getItem('token');
if (!token) throw new Error('Token no encontrado');

const encrypted = encryptData({ page: isInitialLoad ? 1 : page, limit: ITEMS_PER_PAGE });
const formBody = new URLSearchParams();
formBody.append('consultarStockTotal', encrypted);

const response = await axios.post(BACKEND_URL, formBody.toString(), {
headers: {
Authorization: `Bearer ${token}`,
'Content-Type': 'application/x-www-form-urlencoded',
},
});
console.log('Respuesta de obtener stock completo:', response.data);

if (response.data.resultado === 'error') {
if (response.data.mensaje === 'Token no válido o expirado') {
Alert.alert('Error', 'Sesion expirada. Por favor, inicia sesión nuevamente.');
await AsyncStorage.removeItem('token');
} else {
Alert.alert('Error', response.data.mensaje);
}
return [];
}

const alimentos = response.data.alimentos || [];
const total = response.data.total || 0;

const alimentosConImagen = alimentos.map((a) => ({
...a,
imagenUri: { uri: API_URL + a.imgAlimento },
}));

if (isInitialLoad) {
setAlimentosFiltrados(alimentosConImagen);
setTotalAlimentos(total);
} else {
setAlimentosFiltrados(prevAlimentos => [...prevAlimentos, ...alimentosConImagen]);
}

setHasMore(alimentosConImagen.length === ITEMS_PER_PAGE);
setBusquedaExitosa(true);
return alimentos;
} catch (error) {
console.error('Error al obtener inventario completo:', error);
Alert.alert('Error', 'No se pudo obtener el inventario completo.');
return [];
} finally {
setLoading(false);
}
};

 
const cargarMasAlimentos = () => {
if (hasMore && !loading) {
setPage(prevPage => prevPage + 1);
}
};


const obtenerTodoElStockParaPdf = async () => {
try {
const token = await AsyncStorage.getItem('token');
if (!token) throw new Error('Token no encontrado');

const encrypted = encryptData({ pdfStockAlimentos: 'true' });
const formBody = new URLSearchParams();
formBody.append('exportarPdf', encrypted);

const response = await axios.post(BACKEND_URL, formBody.toString(), {
headers: {
Authorization: `Bearer ${token}`,
'Content-Type': 'application/x-www-form-urlencoded',
},
});
console.log('Respuesta de obtener todo el stock para PDF:', response.data);

if (response.data.resultado === 'error' && response.data.mensaje === 'Token no válido o expirado') {
 Alert.alert('Error', 'Sesion expirada. Por favor, inicia sesión nuevamente.');
 await AsyncStorage.removeItem('token');
 dispatch({ type: 'USER_SUCCESS', payload: null }); 
 return;
}
return Array.isArray(response.data) ? response.data : [];
} catch (error) {
console.error('Error al obtener todos los alimentos para el PDF:', error);
Alert.alert('Error', 'No se pudo obtener el inventario completo para el PDF.');
return [];
}
};

const generarPdf = async () => {

  try {

    setLoadingPdf(true);



    const alimentosParaPdf = await obtenerTodoElStockParaPdf();



    if (!alimentosParaPdf.length) {

      showMessage({

        message: 'Aviso',

        description: 'No hay datos para generar el PDF.',

        type: 'warning',

      });

      setLoadingPdf(false);

      return;

    }



    const fechaExportacion = new Date().toLocaleString('es-VE', {

      day: '2-digit',

      month: '2-digit',

      year: 'numeric',

      hour: '2-digit',

      minute: '2-digit',

      second: '2-digit',

    });



    const logoAsset1 = Asset.fromModule(require('../../assets/logo.png'));

    const logoAsset2 = Asset.fromModule(require('../../assets/uptaeb.png'));



    await Promise.all([logoAsset1.downloadAsync(), logoAsset2.downloadAsync()]);



    const base64Logo1 = await FileSystem.readAsStringAsync(logoAsset1.localUri, {

      encoding: FileSystem.EncodingType.Base64,

    });



    const base64Logo2 = await FileSystem.readAsStringAsync(logoAsset2.localUri, {

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

          <img src="data:image/png;base64,${base64Logo1}" alt="Logo" />

          <div class="title-container">

            <h1>Servicio Nutricional</h1>

            <p>Universidad Politécnica Territorial Andrés Eloy Blanco (UPTAEB)</p>

            <p>Barquisimeto - Estado Lara</p>

          </div>

          <img src="data:image/png;base64,${base64Logo2}" alt="Logo" />

        </div>



        <div class="report-title">Stock de Alimentos</div>

        <div class="report-summary">

          Fecha y hora de exportación: ${fechaExportacion} | Cantidad de registros: ${alimentosParaPdf.length}

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

            ${alimentosParaPdf.map(a => `

              <tr>

                <td>${a.nombre}</td>

                <td>${a.marca}</td>

                <td>${a.stock}</td>

                <td>${a.reservado}</td>

                <td>${Number(a.stock) + Number(a.reservado)}</td>

              </tr>

            `).join('')}

          </tbody>

        </table>

      </body>

      </html>

    `;

const { uri } = await Print.printToFileAsync({ html });

if (!(await Sharing.isAvailableAsync())) {
 showMessage({
 message: 'Error',
 description: 'La función de compartir no está disponible en este dispositivo.',
 type: 'danger',
 });
        Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
return;
}

await Sharing.shareAsync(uri, {
mimeType: 'application/pdf',
dialogTitle: 'Exportar Inventario a PDF',
});
} catch (error) {
console.error('Error al generar PDF:', error);
 
 showMessage({
 message: 'Error',
 description: 'No se pudo generar el PDF',
 type: 'danger',
 });
        Alert.alert('Error', 'No se pudo generar el PDF');
} finally {
setLoadingPdf(false);
}
};

useEffect(() => {
if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // **MODIFICACIÓN CLAVE 1: Limpiar los espacios de searchText antes de la lógica**
    const trimmedSearchText = searchText.trim();

if (trimmedSearchText !== '') {
timeoutRef.current = setTimeout(() => {
setPage(1);
        // Usar el texto limpio para la búsqueda
buscarAlimentos(trimmedSearchText, true);
}, 700);
} else {
setPage(1);
obtenerStockCompleto(true);
}
return () => clearTimeout(timeoutRef.current);
}, [searchText]);


useEffect(() => {
if (page > 1) {
        // **MODIFICACIÓN CLAVE 2: Limpiar los espacios para la paginación**
        const trimmedSearchText = searchText.trim();

if (trimmedSearchText !== '') {
        // Usar el texto limpio para la paginación de búsqueda
buscarAlimentos(trimmedSearchText);
} else {
obtenerStockCompleto();
}
}
}, [page]);

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
cargarMasAlimentos,
totalAlimentos,
hasMore,
};
}