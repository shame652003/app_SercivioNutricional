import { useState } from 'react';

export default function useAsistencia() {
  const [registrado, setRegistrado] = useState(false);

  const registrar = () => setRegistrado(true);
  const cancelar = () => setRegistrado(false);

  return { registrado, registrar, cancelar };
}
