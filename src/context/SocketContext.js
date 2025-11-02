import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux'; 
import { 
    incrementUnreadCount,
    decrementUnreadCount,
    setUnreadCount
} from './actions/notificationAction'; 

const SOCKET_URL = 'http://192.168.1.36:3000'; 

const SocketContext = createContext({
    socket: null,
    isConnected: false,
    sendMessage: (event, data) => {},
});

export const useSocket = () => {
    return useContext(SocketContext);
};


export const SocketProvider = ({ children, userCedula }) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const dispatch = useDispatch(); 

    useEffect(() => {
      
        if (!userCedula) {
            console.log('Usuario no logeado. Socket no conectado.');
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            query: { cedula: userCedula } 
        });

        socketRef.current = socket;
        socket.on('connect', () => {
            console.log(`✅ Socket conectado: ${socket.id}`);
            setIsConnected(true);
            socket.emit('register_cedula', userCedula); 
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket desconectado.');
            setIsConnected(false);
        });

        socket.on('nueva_notificacion_push', (data) => {
            console.log('🔔 Notificación nueva recibida por Socket:', data);
            dispatch(incrementUnreadCount()); 
        });

        socket.on('notificacion_actualizada_push', (data) => {
             console.log('🔄 Notificación actualizada por Socket:', data);
             
             if (data.action === 'marcarLeida' || data.action === 'eliminar') {
                 dispatch(decrementUnreadCount());
             } else if (data.action === 'marcarTodas') {
                 dispatch(setUnreadCount(0));
             }
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('nueva_notificacion_push');
            socket.off('notificacion_actualizada_push');
            socket.disconnect(); 
            socketRef.current = null;
        };
    }, [userCedula, dispatch]);

  
useEffect(() => {
    const socket = socketRef.current;
  if (userCedula && socket && isConnected) {
        console.log(`[CLIENTE] 🔄 Registro tardío: Enviando cédula ${userCedula}`);
        socket.emit('register_cedula', userCedula);
    }
}, [userCedula, isConnected]); 


    const value = {
        socket: socketRef.current,
        isConnected,
        sendMessage: (event, data) => {
            if (socketRef.current && socketRef.current.connected) {
                socketRef.current.emit(event, data);
            } else {
                console.warn('Socket no conectado. No se pudo enviar el mensaje.');
            }
        }
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}