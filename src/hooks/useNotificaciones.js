import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@env'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 
import { 
 setUnreadCount, 
 incrementUnreadCount,
 decrementUnreadCount 
} from '../context/actions/notificationAction'; 
import { useSocket } from '../context/SocketContext'; 

const NOTIFICACIONES_ENDPOINT = `${API_URL}bin/controlador/api/notificacionesApi.php`;

export default function useNotificaciones() {
 const [notificaciones, setNotificaciones] = useState([]);
 const [loading, setLoading] = useState(true);
 const dispatch = useDispatch(); 
 const { socket } = useSocket(); 

 const handleSessionExpired = async () => {
  Alert.alert('Error', 'Sesión expirada. Por favor, inicia sesión nuevamente.');
  await AsyncStorage.removeItem('token');
  console.warn("Sesión expirada, la aplicación debe redirigir al login.");
 };

 const fetchNotificaciones = useCallback(async () => {
  setLoading(true);
  try {
   const token = await AsyncStorage.getItem('token');
   if (!token) {
    handleSessionExpired();
    return;
   }

   const response = await axios.post(NOTIFICACIONES_ENDPOINT, { 
    action: 'obtener' 
   }, {
    headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json', 
    },
   });

   if (response.data && response.data.success) {
    const data = response.data.data || [];
    setNotificaciones(data);
    
    const unreadCount = data.filter(n => n.leida === 0 || n.leida === '0').length; 
    dispatch(setUnreadCount(unreadCount));

   } else if (response.data?.message?.includes('Sesión inválida')) { // CORRECCIÓN
    handleSessionExpired();
   } else {
    Alert.alert('Error', response.data?.message ? response.data.message : 'Error al cargar las notificaciones o respuesta inesperada.');
   }

  } catch (error) {
   console.error('Error al obtener notificaciones:', error);
   Alert.alert('Error', 'No se pudo conectar con el servidor para obtener notificaciones.');
  } finally {
   setLoading(false);
  }
 }, [dispatch]);

 const wasUnread = useCallback((idNotificacion) => {
  const noti = notificaciones.find(n => n.idNotificaciones === idNotificacion);
  return noti && (noti.leida === 0 || noti.leida === '0');
 }, [notificaciones]);
 
 const handleSocketUpdate = useCallback((data) => {
  const { idNotificacion, action, notificacionData } = data;

  if (action === 'nueva') {
   setNotificaciones(prev => [notificacionData, ...prev]);
  } else if (action === 'marcarLeida' && idNotificacion) {
   setNotificaciones(prev => prev.map(n => 
    n.idNotificaciones === idNotificacion ? { ...n, leida: 1 } : n
   ));
  } else if (action === 'eliminar' && idNotificacion) {
   setNotificaciones(prev => prev.filter(n => n.idNotificaciones !== idNotificacion));
  } else if (action === 'marcarTodas') {
   setNotificaciones(prev => prev.map(n => ({ ...n, leida: 1 })));
  }

 }, [setNotificaciones]); 

 useEffect(() => {
  fetchNotificaciones();
  if (socket) {

   socket.on('nueva_notificacion_push', (data) => {
    console.log("PUSH Socket: Nueva Notificación recibida para actualizar lista.");
    handleSocketUpdate({ action: 'nueva', notificacionData: data });
   });
   

   socket.on('notificacion_actualizada_push', handleSocketUpdate); 
  }

  return () => {
   if (socket) {
    socket.off('nueva_notificacion_push');
    socket.off('notificacion_actualizada_push');
   }
  };
 }, [fetchNotificaciones, socket, handleSocketUpdate]);


 const manipularNotificacion = useCallback(async (action, idNotificacion = null) => {
  let shouldDecrement = false;
  if (action === 'marcarLeida' || action === 'eliminar') {
   shouldDecrement = wasUnread(idNotificacion); 
  }

  try {
   const token = await AsyncStorage.getItem('token');
   if (!token) {
    handleSessionExpired();
    return false;
   }

   let payload = { action };
   if (idNotificacion) {
    payload.idNotificacion = idNotificacion;
   }

   const response = await axios.post(NOTIFICACIONES_ENDPOINT, payload, {
    headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json',
    },
    withCredentials: true
   });

   if (response.data && response.data.success) {
    
    if (action === 'marcarTodas') {
     dispatch(setUnreadCount(0)); 
     setNotificaciones(prev => prev.map(n => ({ ...n, leida: 1 })));

    } else if (action === 'marcarLeida') {
     setNotificaciones(prev => prev.map(n => 
      n.idNotificaciones === idNotificacion ? { ...n, leida: 1 } : n
     ));
     if (shouldDecrement) {
       dispatch(decrementUnreadCount());
     }

    } else if (action === 'eliminar') {
     setNotificaciones(prev => prev.filter(n => n.idNotificaciones !== idNotificacion));
     if (shouldDecrement) {
       dispatch(decrementUnreadCount());
     }
    }
    
    
    return true;
   } else if (response.data?.message?.includes('Sesión inválida')) {
    handleSessionExpired();
   } else {
    Alert.alert('Error', response.data?.message ? response.data.message : 'Error al procesar la acción o respuesta inesperada.');
   }

   return false;

  } catch (error) {
   console.error(`Error en acción ${action}:`, error);
   Alert.alert('Error de Conexión', 'No se pudo comunicar con el servidor.');
   return false;
  }
 }, [dispatch, wasUnread, setNotificaciones]);


 const marcarComoLeida = (id) => manipularNotificacion('marcarLeida', id);
 const marcarTodasLeidas = () => manipularNotificacion('marcarTodas');
 const eliminarNotificacion = (id) => manipularNotificacion('eliminar', id); 
 

 const agregarNotificacion = (nuevaNotificacion) => {
  setNotificaciones(prev => [nuevaNotificacion, ...prev]);
  
  if (nuevaNotificacion.leida !== 1 && nuevaNotificacion.leida !== '1') {
   dispatch(incrementUnreadCount()); 
  }
 };


 return { 
  notificaciones, 
  loading, 
  fetchNotificaciones,
  marcarComoLeida,
  marcarTodasLeidas,
  eliminarNotificacion,
  agregarNotificacion
 };
}