import { useState } from 'react';
import { ImageSourcePropType } from 'react-native';

/*


const imgRecuperarContrasena = require('../../assets/logo.png'); 
const imgActualizarInfo = require('../../assets/logo.png');
const imgCambiarFoto = require('../../assets/logo.png');
const imgCambiarContrasena = require('../../assets/logo.png');
const imgRegistrarAsistencia = require('../../assets/logo.png');
const imgConsultarAsistencia = require('../../assets/logo.png');
const imgDescargarReporteAsistencia = require('../../assets/logo.png');
const imgVisualizarMenus = require('../../assets/logo.png');
const imgFiltrarMenus = require('../../assets/logo.png');
const imgDescargarReporteMenu = require('../../assets/logo.png');
const imgVisualizarEventos = require('../../assets/logo.png');
const imgFiltrarEventos = require('../../assets/logo.png');
const imgDescargarReporteEvento = require('../../assets/logo.png');
const imgConsultarStockAlimentos = require('../../assets/logo.png');
const imgDescargarReporteAlimentos = require('../../assets/logo.png');
const imgConsultarStockUtensilios = require('../../assets/logo.png');
const imgDescargarReporteUtensilios = require('../../assets/logo.png');

*/
const imgRecuperarContrasena = require('../../assets/ayuda/recup2.png'); 
const imgActualizarInfo = require('../../assets/ayuda/datosP.png');
const imgCambiarFoto = require('../../assets/ayuda/imagenP.png');
const imgCambiarContrasena = require('../../assets/ayuda/cambiarC.png');
const imgRegistrarAsistencia = require('../../assets/ayuda/registrarAsistencia.png');
const imgConsultarAsistencia = require('../../assets/ayuda/consultarAsistencia.png');
const imgDescargarReporteAsistencia = require('../../assets/ayuda/reporteAsistencia.png');
const imgVisualizarMenus = require('../../assets/ayuda/consultarMenu.png');
const imgFiltrarMenus = require('../../assets/ayuda/fitroFecha.png');
const imgDescargarReporteMenu = require('../../assets/ayuda/reporteMenu.png');
const imgVisualizarEventos = require('../../assets/ayuda/consultarEvento.png');
const imgFiltrarEventos = require('../../assets/ayuda/filtrofechae.png'); 
const imgDescargarReporteEvento = require('../../assets/ayuda/reporteEvento.png');
const imgConsultarStockAlimentos = require('../../assets/ayuda/stockA.png');
const imgDescargarReporteAlimentos = require('../../assets/ayuda/reporteStockA.png');
const imgConsultarStockUtensilios = require('../../assets/ayuda/stockU.png');
const imgDescargarReporteUtensilios = require('../../assets/ayuda/reporteStockU.png');

export interface FAQItem {
  pregunta: string;
  respuesta: string;
  imagenUri?: ImageSourcePropType; 
}

export interface SoporteModulo {
  id: string;
  titulo: string;
  icono: string; 
  faqs: FAQItem[];
}

export const DATOS_SOPORTE: SoporteModulo[] = [
  {
    id: 'usuario',
    titulo: 'Usuario (Acceso y Perfil)',
    icono: 'account',
    faqs: [
      {
        pregunta: '¿Cómo puedo recuperar mi contraseña?',
        respuesta: 'En la pantalla de Inicio de Sesión, haga clic en "¿Olvidó su contraseña?". Ingrese su correo electrónico registrado y se le enviará un código de restablecimiento a su bandeja de entrada.',
        imagenUri: imgRecuperarContrasena,
      },
      {
        pregunta: '¿Cómo actualizo mi información personal (nombre, apellido, correo)?',
        respuesta: 'Vaya a la sección "Perfil". Haga clic en los campos de nombre, apellido o correo para editarlos y luego presione el botón "Modificar" para guardar los cambios.',
        imagenUri: imgActualizarInfo,
      },
      {
        pregunta: '¿Cuál es el procedimiento para cambiar mi foto de perfil?',
        respuesta: 'Dentro de la sección "Perfil", haga clic en el botón "Agregar imagen"  y seleccione la nueva imagen que desea utilizar.',
        imagenUri: imgCambiarFoto,
      },
      {
        pregunta: '¿Cómo realizo el cambio de mi contraseña actual?',
        respuesta: 'Acceda a la sección "Perfil" y haga clic en el botón "Cambiar Contraseña". Ingrese su contraseña actual, luego la nueva contraseña y confírmela. Finalmente, haga clic en "Modificar".',
        imagenUri: imgCambiarContrasena,
      },
    ],
  },
  {
    id: 'asistencia',
    titulo: 'Registro y Consulta de Asistencias',
    icono: 'account-check',
    faqs: [
      {
        pregunta: '¿Cómo se registra una Asistencia al servicio nutricional?',
        respuesta: 'En la sección "Registrar Asistencias", primero seleccione el horario de comida (desayuno, almuerzo, merienda, cena). Luego, escanee el código QR del carnet del estudiante o ingrese su número de cédula. Si los datos del estudiante son correctos, haga clic en el botón "Confirmar" asistencia.',
        imagenUri: imgRegistrarAsistencia,
      },
      {
        pregunta: '¿Cómo consulto el registro de Asistencias?',
        respuesta: 'En la sección "Consultar Asistencias" se mostrarán automáticamente los registros del día. Puede usar el buscador para filtrar por número de cédula, nombre o carrera del estudiante.',
        imagenUri: imgConsultarAsistencia,
      },
      {
        pregunta: '¿Cómo puedo descargar el reporte de asistencia?',
        respuesta: 'Dentro de la sección "Consultar Asistencias", haga clic en el botón "PDF". Se descargará automáticamente el reporte con todas las asistencias registradas para ese día.',
        imagenUri: imgDescargarReporteAsistencia,
      },
    ],
  },
  {
    id: 'menu',
    titulo: 'Gestión de Menús',
    icono: 'food-variant',
    faqs: [
      {
        pregunta: '¿Cómo visualizo y busco los menús registrados?',
        respuesta: 'En la sección "Menús" verá los registros, que se cargan en bloques. Use el botón "Cargar más menús" para ver más, o utilice el buscador por fechas u horario de comida para filtrar.',
        imagenUri: imgVisualizarMenus,
      },
      {
        pregunta: '¿Cómo aplico filtros de fecha para buscar menús?',
        respuesta: 'En la sección "Menús", haga clic en "Mostrar Filtros de Fecha". Ingrese el rango de fechas deseado en los campos "Desde" y "Hasta". Recuerde que la fecha inicial ("Desde") no puede ser posterior a la fecha final ("Hasta").',
        imagenUri: imgFiltrarMenus,
      },
      {
        pregunta: '¿Cuál es el proceso para descargar el reporte de un Menú específico?',
        respuesta: 'Seleccione un menú de la lista en la sección "Menús" para ver sus detalles. En la parte inferior derecha de la descripción detallada, haga clic en el botón "PDF" para descargar automáticamente el menú con toda su información.',
        imagenUri: imgDescargarReporteMenu,
      },
    ],
  },
  {
    id: 'eventos',
    titulo: 'Gestión de Eventos',
    icono: 'calendar',
    faqs: [
      {
        pregunta: '¿Cómo visualizo y busco los eventos registrados?',
        respuesta: 'En la sección "Eventos" se muestran los eventos con menús asociados en bloques. Use el botón "Cargar más eventos" para ver más, o utilice el buscador para filtrar por fechas u horario de comida.',
        imagenUri: imgVisualizarEventos,
      },
      {
        pregunta: '¿Cómo aplico filtros de fecha para buscar eventos?',
        respuesta: 'En la sección "Eventos", haga clic en "Mostrar Filtros de Fecha". Ingrese el rango de fechas deseado en los campos "Desde" y "Hasta". Recuerde que la fecha inicial ("Desde") no puede ser posterior a la fecha final ("Hasta").',
        imagenUri: imgFiltrarEventos,
      },
      {
        pregunta: '¿Cómo puedo descargar el reporte de un Evento específico?',
        respuesta: 'Seleccione un evento de la lista en la sección "Eventos" para ver sus detalles. En la parte inferior derecha de la descripción detallada, haga clic en el botón "PDF" para descargar automáticamente el evento con toda su información.',
        imagenUri: imgDescargarReporteEvento,
      },
    ],
  },
  {
    id: 'alimentos',
    titulo: 'Inventario de Alimentos (Stock)',
    icono: 'food-apple',
    faqs: [
      {
        pregunta: '¿Cómo consulto el stock y la información de los alimentos?',
        respuesta: 'En la sección "Stock de Alimentos" se muestran los ítems. Puede usar el botón "Cargar más alimentos" para ver la lista completa. También puede usar el buscador o hacer clic en un alimento específico para ver su stock disponible e información reservada.',
        imagenUri: imgConsultarStockAlimentos,
      },
      {
        pregunta: '¿Cómo obtengo el reporte completo del stock de alimentos?',
        respuesta: 'En la sección "Stock de Alimentos", haga clic en el botón "PDF". Se descargará automáticamente un archivo con el inventario completo de todos los alimentos disponibles.',
        imagenUri: imgDescargarReporteAlimentos,
      },
    ],
  },
  {
    id: 'utensilios',
    titulo: 'Inventario de Utensilios (Stock)',
    icono: 'silverware',
    faqs: [
      {
        pregunta: '¿Cómo consulto el stock y la información de los utensilios?',
        respuesta: 'En la sección "Stock de Utensilios" se muestran los ítems. Puede usar el botón "Cargar más utensilios" para ver la lista completa. También puede usar el buscador o hacer clic en un utensilio específico para ver su información.',
        imagenUri: imgConsultarStockUtensilios,
      },
      {
        pregunta: '¿Cómo obtengo el reporte completo del stock de utensilios?',
        respuesta: 'En la sección "Stock de Utensilios", haga clic en el botón "PDF". Se descargará automáticamente un archivo con el inventario completo de todos los utensilios disponibles.',
        imagenUri: imgDescargarReporteUtensilios,
      },
    ],
  },
];


export const useAyuda = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [faqActual, setFaqActual] = useState<FAQItem[]>([]);
  const [tituloActual, setTituloActual] = useState('');
  const [iconoActual, setIconoActual] = useState('');

  const handleCardPress = (modulo: SoporteModulo) => {
    setFaqActual(modulo.faqs);
    setTituloActual(modulo.titulo);
    setIconoActual(modulo.icono);
    setModalVisible(true);
  };

  const onCloseModal = () => {
    setModalVisible(false);
  };

  return {
    // Datos y funciones de presentación
    DATOS_SOPORTE,
    handleCardPress,
    
    // Estados del Modal
    modalVisible,
    onCloseModal,
    faqActual,
    tituloActual,
    iconoActual,
  };
};

export default useAyuda;