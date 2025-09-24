// MenuModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { showMessage } from 'react-native-flash-message';

import AlimentoItem from './AlimentoItem';
import { Menu, Alimento } from '../hooks/useMenu';

type Props = {
  visible: boolean;
  menuSeleccionado: Menu | null;
  alimentosPorTipo: Record<string, Alimento[]>;
  onClose: () => void;
  generarPdf?: (
    menu: Menu,
    onSuccess: () => void,
    onError: (msg: string) => void
  ) => void;
  children?: React.ReactNode;
};

// Paleta de colores proporcionada por el usuario
const COLORS = {
  BLUE: '#0066CC',
  BLUE_LIGHT: '#3399FF',
  GRAY_DEFAULT: '#ccc',
  WHITE: '#fff',
  BLACK: '#000',
  BLACK_OVERLAY: 'rgba(0,0,0,0.6)',
  BACKGROUND_LIGHT: '#f0f0f0',
};

export default function MenuModal({
  visible,
  menuSeleccionado,
  alimentosPorTipo,
  onClose,
  generarPdf,
  children,
}: Props) {
  if (!menuSeleccionado) return null;

  const handleGenerarPdf = () => {
    if (!generarPdf) return;

    generarPdf(
      menuSeleccionado,
      () =>
        showMessage({
          message: 'PDF generado con éxito',
          type: 'success',
          icon: 'success',
          position: 'top',
        }),
      (errorMsg) =>
        showMessage({
          message: 'Error al generar PDF',
          description: errorMsg,
          type: 'danger',
          icon: 'danger',
          position: 'top',
        })
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>
              Menú
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={28} color={COLORS.WHITE} />
            </Pressable>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Descripción del menú */}
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.descriptionText}>
                {menuSeleccionado.descripcion}
              </Text>
            </View>

            {/* Alimentos por tipo (lista) */}
            {Object.entries(alimentosPorTipo).map(([tipo, alimentos]) => (
              <View key={tipo} style={styles.typeGroup}>
                <Text style={styles.sectionTitle}>{tipo}</Text>
                <View>
                  {alimentos.map((alimento) => (
                    <AlimentoItem
                      key={alimento.idAlimento}
                      alimento={alimento}
                    />
                  ))}
                </View>
              </View>
            ))}
            {children}
          </ScrollView>

          {/* Footer (con PDF Button) */}
          {generarPdf && (
            <View style={styles.footer}>
              <Pressable
                onPress={handleGenerarPdf}
                style={styles.pdfButton}
              >
                <MaterialIcons name="picture-as-pdf" size={28} color={COLORS.WHITE} />
              </Pressable>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.BLACK_OVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 25,
    width: '90%',
    maxHeight: '85%',
    elevation: 20,
    shadowColor: COLORS.BLUE,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  header: {
    backgroundColor: COLORS.BLUE,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  contentScroll: {
    flexGrow: 1,
    padding: 20,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLUE,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.BLUE_LIGHT,
    paddingBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.BLACK,
    lineHeight: 24,
  },
  typeGroup: {
    marginBottom: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_DEFAULT,
  },
  pdfButton: {
    backgroundColor: COLORS.BLUE_LIGHT,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.BLUE_LIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
});