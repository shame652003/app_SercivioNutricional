import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import { useSelector } from 'react-redux';
import { API_URL } from '@env'; 
import useNotificaciones from '../hooks/useNotificaciones';

export default function NavHead({ navigation }) {
    useNotificaciones(); 

    const noLeidasCount = useSelector((state: any) => state.notifications.unreadCount || 0);

    const profile = useSelector((state: any) => state.profile);
    const profileImage = profile.img ? `${API_URL}${profile.img}` : null;

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
                <TouchableOpacity 
                    style={styles.notificationWrapper} 
                    onPress={() => navigation.navigate('Notificaciones')} 
                >
                    <FontAwesome
                        name="bell" 
                        size={22} 
                        color="#0066ff" 
                        style={styles.notificationIcon}
                    />
                    {/* Usa el valor leído de Redux */}
                    {noLeidasCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{noLeidasCount > 99 ? '99+' : noLeidasCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>

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
    notificationWrapper: {
        marginRight: 16, 
    },
    notificationIcon: {},
    badge: {
        position: 'absolute',
        right: -8,
        top: -4,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        zIndex: 10, 
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});
