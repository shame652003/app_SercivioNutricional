import React from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function LoadingModal({ visible, message = "Cargando..." }) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#0033aa" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 250,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: '#0033aa',
    fontWeight: '600',
    textAlign: 'center',
  },
});
