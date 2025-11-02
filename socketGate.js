import React from 'react';
import { useSelector } from 'react-redux';
import { SocketProvider } from './src/context/SocketContext'; 
import Navigate from './src/navigate/Navigate';

const SocketGate = () => {
  
    const userCedula = useSelector((state) => state.profile?.cedula); 

    console.log("Cédula para Socket:", userCedula); 

    return (
        <SocketProvider userCedula={userCedula}>
            <Navigate />
        </SocketProvider>
    );
};

export default SocketGate;