import { useState } from 'react';

const PLATOS_INICIALES = 30;

export default function usePlatosDisponibles() {
  const [platos, setPlatos] = useState(PLATOS_INICIALES);

  const descontarPlato = () => {
    if (platos > 0) setPlatos(platos - 1);
  };

  const resetearPlatos = () => setPlatos(PLATOS_INICIALES);

  return { platos, descontarPlato, resetearPlatos };
}
