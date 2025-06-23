import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';

// Definir el tipo para los datos de asistencia
export type Asistencia = {
  cedula: string;
  nombre: string;
  carrera: string;
  horario: string;
};

// Datos de ejemplo
const MOCK_DATA: Asistencia[] = [
  { cedula: 'V12345678', nombre: 'Juan Pérez', carrera: 'Ingeniería Informática', horario: 'Desayuno' },
  { cedula: 'V87654321', nombre: 'María García', carrera: 'Medicina', horario: 'Almuerzo' },
  { cedula: 'V11223344', nombre: 'Carlos López', carrera: 'Derecho', horario: 'Desayuno' },
  { cedula: 'V55667788', nombre: 'Ana Torres', carrera: 'Administración', horario: 'Almuerzo' },
  { cedula: 'V99887766', nombre: 'Luis Fernández', carrera: 'Arquitectura', horario: 'Desayuno' },
  { cedula: 'V44556677', nombre: 'Sofía Martínez', carrera: 'Psicología', horario: 'Desayuno' },
  { cedula: 'V22334455', nombre: 'Pedro Ruiz', carrera: 'Ingeniería Informática', horario: 'Almuerzo' },
  { cedula: 'V66778899', nombre: 'Lucía Herrera', carrera: 'Medicina', horario: 'Desayuno' },
  { cedula: 'V33445566', nombre: 'Miguel Castro', carrera: 'Derecho', horario: 'Desayuno' },
  { cedula: 'V77889900', nombre: 'Valentina Gómez', carrera: 'Administración', horario: 'Almuerzo' },
  { cedula: 'V88990011', nombre: 'Javier Morales', carrera: 'Arquitectura', horario: 'Desayuno' },
  { cedula: 'V99001122', nombre: 'Camila Peña', carrera: 'Psicología', horario: 'Desayuno' },
];

const PAGE_SIZE = 5;

export const useAsistenciasData = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const filteredData = useMemo(() => {
    if (!search.trim()) return MOCK_DATA;
    return MOCK_DATA.filter(
      (item) =>
        item.cedula.toLowerCase().includes(search.toLowerCase()) ||
        item.nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.carrera.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = useMemo(
    () => filteredData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filteredData, page]
  );

  const handleChangePage = useCallback(
    (next: boolean) => {
      setPage((prev) => {
        if (next) {
          return prev < pageCount - 1 ? prev + 1 : prev;
        } else {
          return prev > 0 ? prev - 1 : prev;
        }
      });
    },
    [pageCount]
  );

  // Reset page if search changes
  React.useEffect(() => {
    setPage(0);
  }, [search]);

  return {
    search,
    setSearch,
    page,
    pageCount,
    paginatedData,
    filteredData,
    handleChangePage,
  };
};
