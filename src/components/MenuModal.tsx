import React from 'react';
import {Modal,View,Text,ScrollView,StyleSheet,Pressable,} from 'react-native';
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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          {generarPdf && (
            <Pressable onPress={handleGenerarPdf} style={styles.btnPdf}>
              <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
              <Text style={styles.txtPdf}>PDF</Text>
            </Pressable>
          )}

          <View style={styles.scrollWrapper}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitulo}>
                Descripción del Menú: {menuSeleccionado.descripcion}
              </Text>

              {Object.entries(alimentosPorTipo).map(([tipo, alimentos]) => (
                <View key={tipo} style={styles.tipoGroup}>
                  <Text style={styles.tipoTitle}>{tipo}</Text>
                  <View style={styles.alimentoGrid}>
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
          </View>

          <Pressable onPress={onClose} style={styles.btnCerrar}>
            <Text style={styles.txtCerrar}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    maxHeight: '80%',
    padding: 20,
    paddingTop: 20,
    flexDirection: 'column',
    flex: 0,
  },
  btnPdf: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  txtPdf: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  scrollWrapper: {
    flexGrow: 1,
    maxHeight: '80%',
    marginBottom: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066CC',
    textAlign: 'center',
    marginBottom: 10,
  },
  tipoGroup: {
    marginBottom: 20,
  },
  tipoTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#0066CC',
    marginBottom: 8,
  },
  alimentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  btnCerrar: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  txtCerrar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
