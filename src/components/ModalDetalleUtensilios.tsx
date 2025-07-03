import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ImageSourcePropType,
} from 'react-native';

interface ModalDetalleUtensilioProps {
  visible: boolean;
  onClose: () => void;
  detalle?: {
    nombre: string;
    material?: string;
    stock: number;
    imagenUri: ImageSourcePropType;
  };
}

export default function ModalDetalleUtensilio({
  visible,
  onClose,
  detalle,
}: ModalDetalleUtensilioProps) {
  if (!detalle) return null;

  const { nombre, material, stock, imagenUri } = detalle;


  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image source={imagenUri} style={styles.image} resizeMode="cover" />

          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.material}>
            {material !== 'No Definido' ? material : ''}
          </Text>

          <View style={styles.datosContainer}>
            <View style={[styles.datoBox, { backgroundColor: '#E6F0FA' }]}>
              <Text style={styles.datoLabel}>Disponible</Text>
              <Text style={styles.datoValor}>{stock}</Text>
            </View>
          </View>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 16,
  },
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 4,
    textAlign: 'center',
  },
  material: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  datosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  datoBox: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  datoLabel: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  datoValor: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0066CC',
  },
  closeButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#0066CC',
    borderRadius: 30,
    shadowColor: '#0066CC',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
