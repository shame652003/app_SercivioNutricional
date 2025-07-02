import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData } from '../security/crypto/encryptor';
import axios from 'axios';
import * as Print from 'expo-print';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const BACKEND_URL = `${API_URL}bin/controlador/api/consultarEventoApi.php`;
console.log(BACKEND_URL);

export type Evento = {
  idEvento: number;
  nomEvent: string;
  descripEvent: string;
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

export default function useEventoValidation() {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [eventoSeleccionadoInfo, setEventoSeleccionadoInfo] = useState<Evento | null>(null);
  const [alimentosDelEvento, setAlimentosDelEvento] = useState<Alimento[]>([]);

  const [eventoFiltradosOriginal, setEventoFiltradosOriginal] = useState<Evento[]>([]); 
  const [eventoFiltrados, setEventoFiltrados] = useState<Evento[]>([]); 

  const [loadingEvento, setLoadingEvento] = useState(false);
  const [loadingAlimentos, setLoadingAlimentos] = useState(false);

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState<Date | undefined>(undefined);
  const [fechaFinFiltro, setFechaFinFiltro] = useState<Date | undefined>(undefined);

  const quitarDuplicados = (evento: Evento[]) => {
    const ids = new Set<number>();
    return evento.filter(evento => {
      if (ids.has(evento.idEvento)) return false;
      ids.add(evento.idEvento);
      return true;
    });
  };

  const fetchEvento = async (
    search: string,
    fechaInicioStr: string = '',
    fechaFinStr: string = ''
  ) => {
    try {
      setLoadingEvento(true);

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
        accion: 'buscarEvento',
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

      if (response.data.resultado === 'success') {
        const eventoSinDuplicados = quitarDuplicados(response.data.eventos || []);
        setEventoFiltradosOriginal(eventoSinDuplicados);
        setEventoFiltrados(eventoSinDuplicados);
      } else {
        setEventoFiltradosOriginal([]);
        setEventoFiltrados([]);
        Alert.alert('Error', response.data.mensaje || 'Error al obtener eventos');
      }
    } catch (error) {
      setEventoFiltradosOriginal([]);
      setEventoFiltrados([]);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoadingEvento(false);
    }
  };

  useEffect(() => {
    fetchEvento('');
  }, []);

  useEffect(() => {
    if (showDateFilter) return;

    const texto = searchText.trim().toLowerCase();

    if (texto === '') {
      setEventoFiltrados(eventoFiltradosOriginal);
    } else {
      const filtrados = eventoFiltradosOriginal.filter(
        (evento) =>
          evento.horarioComida.toLowerCase().includes(texto) ||
          evento.descripEvent.toLowerCase().includes(texto) ||
          evento.feMenu.includes(texto)
      );
      setEventoFiltrados(filtrados);
    }
  }, [searchText, eventoFiltradosOriginal, showDateFilter]);

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
      fetchEvento('', fechaInicioStr, fechaFinStr);
    }
  }, [fechaInicioFiltro, fechaFinFiltro, showDateFilter]);

  const ocultarFiltro = () => {
    setShowDateFilter(false);
    setFechaInicioFiltro(undefined);
    setFechaFinFiltro(undefined);
    fetchEvento(searchText);
  };

 const seleccionarEvento = async (evento: Evento) => {
  try {
    setLoadingAlimentos(true);

    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token no encontrado');

    const payload = {
      mostrarEvento: true,
      idEvento: evento.idEvento,
    };

    const encryptedPayload = encryptData(payload);

    const formBody = new URLSearchParams();
    formBody.append('infoEventoModal', encryptedPayload);

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

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      setAlimentosDelEvento(response.data);

      const primerObjeto = response.data[0];
      const eventoConDescripcion: Evento = {
        idEvento: primerObjeto.idEvento,
        nomEvent: primerObjeto.nomEvent,
        descripEvent: primerObjeto.descripEvent,
        feMenu: primerObjeto.feMenu,
        horarioComida: primerObjeto.horarioComida,
        cantPlatos: primerObjeto.cantPlatos,
        descripcion: primerObjeto.descripcion || '',
      };

      setEventoSeleccionadoInfo(eventoConDescripcion);
      setModalVisible(true);
    } else {
      Alert.alert('Error', 'No se pudo obtener el detalle del evento');
    }
  } catch (error) {
    Alert.alert('Error', 'No se pudo conectar con el servidor para obtener detalles');
  } finally {
    setLoadingAlimentos(false);
  }
};


  const cerrarModal = () => {
    setModalVisible(false);
    setEventoSeleccionadoInfo(null);
    setAlimentosDelEvento([]);
  };

  const alimentosPorTipo = useMemo(() => {
    if (!alimentosDelEvento || alimentosDelEvento.length === 0) return {};

    return alimentosDelEvento.reduce<Record<string, Alimento[]>>((acc, alimento) => {
      const tipo = alimento.tipo || 'Sin Tipo';
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(alimento);
      return acc;
    }, {});
  }, [alimentosDelEvento]);




  const generarPdfPlano = async (
    evento: Evento,
    onSuccess: () => void,
    onError: (msg: string) => void
  ) => {
    try {
      const logoAsset = Asset.fromModule(require('../../assets/logo.png'));
      await logoAsset.downloadAsync();
      const base64Logo = await FileSystem.readAsStringAsync(logoAsset.localUri || '', {
        encoding: FileSystem.EncodingType.Base64,
      });

  let contenidoHTML = `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #000;
          background-color: #fff;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        header img {
          height: 80px;
          width: auto;
        }
        .title-container {
          flex-grow: 1;
          text-align: center;
          font-weight: bold;
          font-size: 22px;
          line-height: 1.1;
          margin: 0 10px;
        }
        .subtitle, .location {
          font-weight: 600;
          font-size: 12px;
          margin-top: 4px;
          color: #000;
        }
        .info {
          margin-bottom: 10px;
          font-size: 14px;
        }
        .info strong {
          color: #000;
        }
        h1, h2 {
          color: #000;
        }
        h2 {
          border-bottom: 2px solid #000;
          padding-bottom: 4px;
          margin-top: 25px;
          margin-bottom: 10px;
          font-size: 18px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          font-size: 13px;
        }
         td {
          border: 1px solid #bbb;
          padding: 6px 8px;
          text-align: left;
          vertical-align: middle;
          max-width: 150px;
          word-wrap: break-word;
          color: #000;
        }
        th {
          background-color: #003366; 
          color: #fff;            
          font-weight: bold;        
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
        <img src="data:image/png;base64,${base64Logo}" alt="Logo" />
      </header>

      <h1>Reporte de Evento</h1>
      <p><strong>Nombre del Evento:</strong> ${evento.nomEvent}</p>
      <p><strong>Descripción del Evento:</strong> ${evento.descripEvent}</p>
      <p><strong>Fecha del Evento:</strong> ${evento.feMenu}</p>
      <p><strong>Horario:</strong> ${evento.horarioComida}</p>
      <p><strong>Cantidad de platos:</strong> ${evento.cantPlatos}</p>
      <p><strong>Descripción:</strong> ${evento.descripcion}</p>
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
    eventoSeleccionadoInfo,
    alimentosDelEvento,
    alimentosPorTipo,
    eventoFiltrados,
    seleccionarEvento,
    cerrarModal,
    loadingEvento,
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