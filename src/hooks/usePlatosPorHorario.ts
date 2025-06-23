import { useState } from 'react';

type HorarioComida = 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena';

const PLATOS_POR_HORARIO: Record<HorarioComida, number> = {
  'Desayuno': 50,
  'Almuerzo': 100,
  'Merienda': 40,
  'Cena': 80
};

export default function usePlatosPorHorario() {
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<HorarioComida>('Desayuno');
  const [platosDisponibles, setPlatosDisponibles] = useState<Record<HorarioComida, number>>(PLATOS_POR_HORARIO);

  const cambiarHorario = (nuevoHorario: HorarioComida) => {
    setHorarioSeleccionado(nuevoHorario);
  };

  const descontarPlato = () => {
    if (platosDisponibles[horarioSeleccionado] > 0) {
      setPlatosDisponibles(prev => ({
        ...prev,
        [horarioSeleccionado]: prev[horarioSeleccionado] - 1
      }));
    }
  };

  const resetearPlatos = () => {
    setPlatosDisponibles(PLATOS_POR_HORARIO);
  };

  return {
    horarioSeleccionado,
    platosDisponibles: platosDisponibles[horarioSeleccionado],
    cambiarHorario,
    descontarPlato,
    resetearPlatos
  };
}
