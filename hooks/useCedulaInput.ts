import { useState } from 'react';

export interface Estudiante {
  cedula: string;
  nombre: string;
  apellido: string;
  carrera: string;
}

// Simulación de base de datos
const ESTUDIANTES: Estudiante[] = [
  { cedula: '12345678', nombre: 'Juan', apellido: 'Pérez', carrera: 'Ingeniería' },
  { cedula: '15691374', nombre: 'Ana', apellido: 'Gómez', carrera: 'Medicina' },
];

export default function useCedulaInput() {
  const [cedula, setCedula] = useState('');
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);

  const handleCedulaChange = (text: string) => {
    setCedula(text);
    const found = ESTUDIANTES.find(e => e.cedula === text);
    setEstudiante(found || null);
  };

  const clear = () => {
    setCedula('');
    setEstudiante(null);
  };

  const setByQR = (qrCedula: string) => {
    setCedula(qrCedula);
    const found = ESTUDIANTES.find(e => e.cedula === qrCedula);
    setEstudiante(found || null);
  };

  return { cedula, estudiante, handleCedulaChange, clear, setByQR };
}
