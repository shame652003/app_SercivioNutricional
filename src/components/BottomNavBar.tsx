import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import useAuth from '../hooks/useAuth';

const BottomNavBar = ({ navigation }) => {
  const { cerrarSesion } = useAuth();
  return (
    <View style={styles.container}>

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Home')}
        >
          <FontAwesome name="home" size={24} color="#0066CC" />
          <Text style={styles.navLabel}>Inicio</Text>
        </TouchableOpacity>
        
         <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Perfil')}
        >
          <FontAwesome name="user" size={24} color="#0066CC" />
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Ayuda')}
        >
          <FontAwesome name="question" size={24} color="#0066CC" />
          <Text style={styles.navLabel}>Ayuda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={cerrarSesion}
        >
          <FontAwesome name="sign-out" size={24} color="#0066CC" />
          <Text style={styles.navLabel}>Cerrar Sesión</Text>
        </TouchableOpacity>

        

       

        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', 
  },
  content: {
    fontSize: 16,
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: { paddingBottom: 10 },
      android: { paddingBottom: 5 },
    }),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066CC',
  },
});

export default BottomNavBar;
