// hooks/useStockAlimentos.js
import { useState } from 'react';

export default function useStockAlimentosValidation() {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);

  const alimentos = [
    { id: '1', nombre: 'Manzana', marca: 'Frutas del Valle', stock: 42, reservado: 20, imagenUri: require('../assets/manzana.jpeg') },
    { id: '2', nombre: 'Banana', marca: 'Tropical Fruits', stock: 30, reservado: 10, imagenUri: require('../assets/cambur.jpg') },
    { id: '3', nombre: 'Fresa', marca: '', stock: 25, reservado: 50, imagenUri: require('../assets/fresa.jpg') },
    { id: '4', nombre: 'Mango', marca: 'Campo Verde', stock: 18, imagenUri: require('../assets/mango.jpg') },
    { id: '5', nombre: 'Naranja', marca: 'Bodega Real', stock: 50, reservado: 50, imagenUri: require('../assets/naranja.jpg') },
  ];

  const alimentosFiltrados = alimentos.filter(a =>
    a.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const seleccionarAlimento = (item) => {
    setAlimentoSeleccionado(item);
    setModalVisible(true);
  };

  const cerrarModal = () => setModalVisible(false);

  return {
    searchText,
    setSearchText,
    modalVisible,
    alimentoSeleccionado,
    alimentosFiltrados,
    seleccionarAlimento,
    cerrarModal,
  };
}
