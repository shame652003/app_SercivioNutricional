import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';
import * as Print from 'expo-print';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { useDispatch } from 'react-redux';

const BACKEND_URL = `${API_URL}bin/controlador/api/consultarMenuApi.php`;

export type Menu = {
  idMenu: number;
  feMenu: string;
  horarioComida: string;
  cantPlatos: number;
  descripcion: string;
};

export type Alimento = {
  idAlimento: number;
  tipo?: string; 
  imgAlimento?: string;
  nombre: string;
  marca: string;
  cantidad: string;
};

export default function useMenusValidation( navigation) {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [menuSeleccionadoInfo, setMenuSeleccionadoInfo] = useState<Menu | null>(null);
  const [alimentosDelMenu, setAlimentosDelMenu] = useState<Alimento[]>([]);

  const [menusFiltradosOriginal, setMenusFiltradosOriginal] = useState<Menu[]>([]); 
  const [menusFiltrados, setMenusFiltrados] = useState<Menu[]>([]); 

  const [loadingMenus, setLoadingMenus] = useState(false);
  const [loadingAlimentos, setLoadingAlimentos] = useState(false);

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState<Date | undefined>(undefined);
  const [fechaFinFiltro, setFechaFinFiltro] = useState<Date | undefined>(undefined);
  const dispatch = useDispatch();

  const quitarDuplicados = (menus: Menu[]) => {
    const ids = new Set<number>();
    return menus.filter(menu => {
      if (ids.has(menu.idMenu)) return false;
      ids.add(menu.idMenu);
      return true;
    });
  };

  const fetchMenus = async (
    search: string,
    fechaInicioStr: string = '',
    fechaFinStr: string = ''
  ) => {
    try {
      setLoadingMenus(true);

      let fechaInicio = '';
      let fechaFin = '';
      let horarioComida = null;

      const trimmedSearch = search.trim();

      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedSearch)) {
        fechaInicio = trimmedSearch;
        fechaFin = trimmedSearch;
      } else if (trimmedSearch.length > 0) {
        horarioComida = trimmedSearch;
      }

      if (fechaInicioStr && fechaFinStr) {
        fechaInicio = fechaInicioStr;
        fechaFin = fechaFinStr;
        horarioComida = null;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const payload = {
        accion: 'buscarMenu',
        fechaInicio,
        fechaFin,
        ...(horarioComida ? { horarioComida } : {}),
      };

      const encryptedPayload = encryptData(payload);

      const formBody = new URLSearchParams();
      formBody.append('datos', encryptedPayload);

      const response = await axios.post(
        BACKEND_URL,
        formBody.toString(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.resultado === 'error' && response.data.mensaje === 'Token no válido o expirado') {
         Alert.alert('Error', 'Sesion expirada. Por favor, inicia sesión nuevamente.');
         await AsyncStorage.removeItem('token');
         dispatch({ type: 'USER_SUCCESS', payload: null }); 
         return;
      }
      if (response.data.resultado === 'success') {
        const menusSinDuplicados = quitarDuplicados(response.data.menus || []);
        setMenusFiltradosOriginal(menusSinDuplicados);
        setMenusFiltrados(menusSinDuplicados);
      } else {
        setMenusFiltradosOriginal([]);
        setMenusFiltrados([]);
        Alert.alert('Error', response.data.mensaje || 'Error al obtener menús');
      }
    } catch (error) {
      setMenusFiltradosOriginal([]);
      setMenusFiltrados([]);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoadingMenus(false);
    }
  };

  useEffect(() => {
    fetchMenus('');
  }, []);

  useEffect(() => {
    if (showDateFilter) return;

    const texto = searchText.trim().toLowerCase();

    if (texto === '') {
      setMenusFiltrados(menusFiltradosOriginal);
    } else {
      const filtrados = menusFiltradosOriginal.filter(
        (menu) =>
          menu.horarioComida.toLowerCase().includes(texto) ||
          menu.descripcion.toLowerCase().includes(texto) ||
          menu.feMenu.includes(texto)
      );
      setMenusFiltrados(filtrados);
    }
  }, [searchText, menusFiltradosOriginal, showDateFilter]);

  useEffect(() => {
    if (
      showDateFilter &&
      fechaInicioFiltro instanceof Date &&
      fechaFinFiltro instanceof Date
    ) {
      if (fechaFinFiltro < fechaInicioFiltro) {
        Alert.alert('Error', 'La fecha fin debe ser mayor o igual a la fecha inicio');
        return;
      }
      const fechaInicioStr = fechaInicioFiltro.toISOString().slice(0, 10);
      const fechaFinStr = fechaFinFiltro.toISOString().slice(0, 10);
      fetchMenus('', fechaInicioStr, fechaFinStr);
    }
  }, [fechaInicioFiltro, fechaFinFiltro, showDateFilter]);

  const ocultarFiltro = () => {
    setShowDateFilter(false);
    setFechaInicioFiltro(undefined);
    setFechaFinFiltro(undefined);
    fetchMenus(searchText);
  };

  const seleccionarMenu = async (menu: Menu) => {
    try {
      setLoadingAlimentos(true);
      setMenuSeleccionadoInfo(menu);

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const payload = {
        mostrarMenu: true,
        idMenu: menu.idMenu,
      };

      const encryptedPayload = encryptData(payload);
      const formBody = new URLSearchParams();
      formBody.append('infoMenuModal', encryptedPayload);

      const response = await axios.post(
        BACKEND_URL,
        formBody.toString(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setAlimentosDelMenu(response.data);
        setModalVisible(true);
      } else {
        Alert.alert('Error', 'No se pudo obtener el detalle del menú');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor para obtener detalles');
    } finally {
      setLoadingAlimentos(false);
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setMenuSeleccionadoInfo(null);
    setAlimentosDelMenu([]);
  };

  const alimentosPorTipo = useMemo(() => {
    if (!alimentosDelMenu || alimentosDelMenu.length === 0) return {};

    return alimentosDelMenu.reduce<Record<string, Alimento[]>>((acc, alimento) => {
      const tipo = alimento.tipo || 'Sin Tipo';
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(alimento);
      return acc;
    }, {});
  }, [alimentosDelMenu]);

  const generarPdfPlano = async (
    menu: Menu,
    onSuccess: () => void,
    onError: (msg: string) => void
  ) => {
    try {
       const logoAsset = Asset.fromModule(require('../../assets/logo.png'));
      await logoAsset.downloadAsync();
      const base64Logo = await FileSystem.readAsStringAsync(logoAsset.localUri, {
        encoding: 'base64',
      });

      const logoAssetU = Asset.fromModule(require('../../assets/uptaeb.png'));
      await logoAssetU.downloadAsync();
      const base64LogoU = await FileSystem.readAsStringAsync(logoAssetU.localUri, {
        encoding: 'base64',
      });

let contenidoHTML = `
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
        color: #000;
        background-color: #fff;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        border-radius: 8px;
        text-align: center;
        color: #000;
      }

      header img {
        height: 100px;
        width: auto;
        margin-bottom: 10px;
      }

      .title-container {
        flex-grow: 1;
        font-weight: bold;
        font-size: 22px;
        line-height: 1.1;
        margin: 0 10px;
        color: #000;
      }

      .subtitle, .location {
        font-weight: 600;
        font-size: 14px;
        margin-top: 4px;
        color: #000;
      }

      h1, h2 {
        color: #0066CC;
        text-align: center;
      }

      h2 {
        border-bottom: 2px solid #0066CC;
        padding-bottom: 4px;
        margin-top: 25px;
        margin-bottom: 10px;
        font-size: 18px;
      }

      p {
        font-size: 14px;
        margin: 6px 0;
      }

      p strong {
        color: black;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
        font-size: 14px;
      }

      th, td {
        border: 1px solid #3399FF;
        padding: 8px 6px;
        text-align: center;
        font-size: 14px;
      }

      th {
        background-color: #0066CC;
        color: #fff;
        font-weight: bold;
      }

      tr:nth-child(even) {
        background: #f6faff;
      }
    </style>
  </head>
  <body>
    <header>
      <img src="data:image/png;base64,${base64Logo}" alt="Logo" />
      <div class="title-container">
        Servicio Nutricional<br/>
        <span class="subtitle">Universidad Politécnica Territorial Andrés Eloy Blanco (UPTAEB)</span><br/>
        <span class="location">Barquisimeto - Estado - Lara</span>
      </div>
      <img src="data:image/png;base64,${base64LogoU}" alt="Logo" />
    </header>

    <h1>Reporte de Menú</h1>
    <p><strong>Descripción:</strong> ${menu.descripcion}</p>
    <p><strong>Fecha:</strong> ${menu.feMenu}</p>
    <p><strong>Horario:</strong> ${menu.horarioComida}</p>
    <p><strong>Cantidad de platos:</strong> ${menu.cantPlatos}</p>
`;



    for (const tipo in alimentosPorTipo) {
      const grupo = alimentosPorTipo[tipo];
      contenidoHTML += `
        <h2>${tipo}</h2>
        <table>
          <tr>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Cantidad</th>
          </tr>
      `;
      grupo.forEach((ali) => {
        contenidoHTML += `
          <tr>
            <td>${ali.nombre}</td>
            <td>${ali.marca}</td>
            <td>${ali.cantidad}</td>
          </tr>
        `;
      });
      contenidoHTML += `</table>`;
    }

    contenidoHTML += `</body></html>`;

    await Print.printAsync({
        html: contenidoHTML,
      });

      onSuccess();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      onError('No se pudo generar el PDF.');
    }
  };

  return {
    searchText,
    setSearchText,
    modalVisible,
    menuSeleccionadoInfo,
    alimentosDelMenu,
    alimentosPorTipo,
    menusFiltrados,
    seleccionarMenu,
    cerrarModal,
    loadingMenus,
    loadingAlimentos,
    showDateFilter,
    setShowDateFilter,
    fechaInicioFiltro,
    setFechaInicioFiltro,
    fechaFinFiltro,
    setFechaFinFiltro,
    ocultarFiltro,
    generarPdfPlano,
  };
}