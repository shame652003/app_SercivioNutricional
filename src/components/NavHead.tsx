import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import { useSelector } from 'react-redux'; 

export default function NavHead({ navigation }) {
  const user = useSelector((state: any) => state.user.user);
  const profileImage = user.img ? `http://192.168.1.108/Servicio-Nutricional-Uptaeb/${user.img}` : null;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <View style={styles.leftSection}>
          <Image
            source={require('../../assets/logo.png')} 
            style={styles.icono}
          />
          <Text style={styles.appName}>Servicio Nutricional</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.rightSection}>
        <FontAwesome
          name="bell" 
          size={22} 
          color="#0066ff" 
          style={styles.notificationIcon}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Image
            source={
             profileImage
                ? { uri: profileImage } 
                : require('../../assets/user.png')
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    height: 60,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center', 
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center', 
  },
  appName: {
    fontSize: 18,
    color: '#044aa6',
    fontWeight: 'bold',
    marginLeft: 8, 
  },
  icono: {
    width: 40,
    height: 40,
  },
  notificationIcon: {
    marginRight: 16, 
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});