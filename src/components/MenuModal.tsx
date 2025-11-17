import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
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

// Paleta de colores unificada
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

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={50} color={COLORS.WHITE} />
            </View>
            <Text style={styles.modalTitle}>Detalles del Menú</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={28} color={COLORS.WHITE} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
          >

            <View style={styles.infoCard}>
                
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="file-document-outline" size={20} color={COLORS.BLUE} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Menú</Text>
                  <Text style={styles.infoText}>{menuSeleccionado.descripcion}</Text>
                </View>
              </View>
            </View>

            {Object.keys(alimentosPorTipo).length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="food-fork-drink" size={24} color={COLORS.BLUE} />
                  <Text style={styles.sectionMainTitle}>Ingredientes del Menú</Text>
                </View>
                {Object.entries(alimentosPorTipo).map(([tipo, alimentos]) => (
                  <View key={tipo} style={styles.section}>
                    <Text style={styles.sectionTitle}>{tipo}</Text>
                    <View>
                      {alimentos.map((alimento) => (
                        <AlimentoItem
                          key={alimento.idAlimento}
                          alimento={alimento}
                          isLast={
                            alimento.idAlimento ===
                            alimentos[alimentos.length - 1].idAlimento
                          }
                        />
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
            {children}
          </ScrollView>

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
    marginTop: 10,
  },
  iconContainer: {
    backgroundColor: COLORS.BLUE_LIGHT,
    borderRadius: 30,
    padding: 10,
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
  infoCard: {
    backgroundColor: '#abd9f71f',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoTextContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.BLUE,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.BLACK,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.GRAY_DEFAULT,
    marginVertical: 10,
  },
  sectionContainer: {
    backgroundColor: '#abd9f71f',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.BLUE_LIGHT,
    paddingBottom: 5,
  },
  sectionMainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BLUE,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLUE,
    marginBottom: 10,
    marginTop: 10,
    paddingBottom: 5,
  },
  section: {
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