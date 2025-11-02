import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    ActivityIndicator, 
    TouchableOpacity,
} from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import useNotificaciones from '../hooks/useNotificaciones'; 
import NotificacionItem from '../components/NotificacionItem'; 
import ContentContainer from '../components/ContentContainer'; 

export default function NotificacionesScreen({ navigation }) {
    const { 
        notificaciones, 
        loading, 
        marcarComoLeida, 
        marcarTodasLeidas, 
        eliminarNotificacion,
        noLeidasCount
    } = useNotificaciones();


    return (
        <Container>
            <NavHead navigation={navigation} />
            <ContentContainer> 
                <View style={styles.topBar}>
                    <Text style={styles.headerTitle}>
                        Notificaciones ({noLeidasCount} no leídas)
                    </Text>
                    
                    <TouchableOpacity 
                        onPress={marcarTodasLeidas} 
                        style={styles.markAllButton}
                        disabled={noLeidasCount === 0}
                    >
                        <Text style={[styles.markAllText, noLeidasCount === 0 && { color: '#ccc' }]}>
                            Marcar todas leídas
                        </Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}> 
                        <ActivityIndicator size="large" color="#0066ff" />
                    </View>
                ) : notificaciones.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No tienes notificaciones aún.</Text>
                    </View>
                ) : (
                    <View style={styles.listWrapper}>
                        {notificaciones.map(item => (
                            <NotificacionItem 
                                key={item.idNotificaciones.toString()} 
                                item={item}
                                marcarComoLeida={marcarComoLeida}
                                eliminarNotificacion={eliminarNotificacion}
                            />
                        ))}
                    </View>
                )}
            </ContentContainer>

            <BottomNavBar navigation={navigation} />
        </Container>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#044aa6',
    },
    markAllButton: {
        padding: 5,
    },
    markAllText: {
        fontSize: 14,
        color: '#0066ff',
    },
    loadingContainer: {
        height: 200, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        minHeight: 200, 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    listWrapper: {
        paddingVertical: 5,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});