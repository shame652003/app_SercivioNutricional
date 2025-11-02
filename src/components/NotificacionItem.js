import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

const formatFecha = (fecha) => {
    const date = new Date(fecha.replace(' ', 'T')); 
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function NotificacionItem({ item, marcarComoLeida, eliminarNotificacion }) {
    const isLeida = item.leida === 1 || item.leida === '1';

    const handlePress = () => {
        if (!isLeida) {
            marcarComoLeida(item.idNotificaciones);
        }
    };
    const handleEliminar = () => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que deseas eliminar esta notificación? Se borrará de la lista.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                { 
                    text: "Eliminar", 
                    onPress: () => eliminarNotificacion(item.idNotificaciones),
                    style: "destructive" 
                }
            ],
            { cancelable: true }
        );
    };
    
    const getIcon = () => {
        if (item.tipo.includes('Menu')) {
            return { name: 'cutlery', color: '#073d83ff' };
        }
        if (item.tipo.includes('Evento')) {
             return { name: 'calendar', color: '#2da0fdff' };
        }
        return { name: 'info-circle', color: '#0066ff' };
    };
    
    const icon = getIcon();

    return (
        <TouchableOpacity 
            style={[styles.card, !isLeida && styles.cardUnread]}
            onPress={handlePress}
        >
            <View style={styles.iconContainer}>
                <FontAwesome name={icon.name} size={24} color={icon.color} />
            </View>
            
            <View style={styles.content}>
                <View style={styles.headerContent}>
                    <Text style={styles.title} numberOfLines={1}>{item.titulo}</Text>
                    <Text style={styles.dateText}>{formatFecha(item.fechaNoti)}</Text>
                </View>
                <Text style={styles.message}>
                    {item.mensaje}
                </Text>
            </View>

            <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={handleEliminar}
            >
                <Ionicons name="close" size={24} color="#2c76ffff" />
            </TouchableOpacity>

            {!isLeida && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#7cb4fd6c',
        padding: 15,
        borderRadius: 8,
        marginVertical: 5,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        alignItems: 'flex-start',
    },
    cardUnread: {
        backgroundColor: '#ffffffff',
        borderLeftWidth: 4,
        borderLeftColor: '#0066ff',
    },
    iconContainer: {
        marginRight: 10,
        marginTop: 5,
    },
    content: {
        flex: 1,
        marginRight: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        flexShrink: 1,
        marginRight: 10,
    },
    dateText: {
        fontSize: 13,
        color: '#888',
    },
    message: {
        fontSize: 13,
        color: '#555555ff',
    },
    deleteButton: {
        padding: 5,
        marginTop: 5,
    },
    unreadDot: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
    }
});