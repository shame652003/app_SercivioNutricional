import { NavigationContainer } from '@react-navigation/native';
import React from 'react'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import useAuth from '../hooks/useAuth';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import RecuperarContraseñaScreen from '../screens/RecuperarContraseñaScreen';
import CambioContraseñaScreen from '../screens/CambioContraseñaScreen';
import StockAlimentosScreen from '../screens/StockAlimentosScreen';
import StockUtensiliosScreen from '../screens/StockUtensiliosScreen';
import MenusScreen from '../screens/MenusScreen';
import EventosScreen from '../screens/EventosScreen';
import AsistenciasScreen from '../screens/AsistenciasScreen';
import ConsultarAsistenciasScreen from '../screens/ConsultarAsistenciasScreen';
import CodigoRecuperacionScreen from '../screens/CodigoRecuperacionScreen';
import CambiarClaveScreen from '../screens/CambiarClaveScreen';
import AyudaScreen from '../screens/AyudaScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
          {!user ? (
            // Usuario no logueado
            <>
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="RecuperarContraseña" component={RecuperarContraseñaScreen} />
              <Stack.Screen name="CodigoRecuperacion" component={CodigoRecuperacionScreen} />
              <Stack.Screen name="CambiarClave" component={CambiarClaveScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Perfil" component={PerfilScreen} />
              <Stack.Screen name="CambioContraseña" component={CambioContraseñaScreen} />
              <Stack.Screen name="StockAlimentos" component={StockAlimentosScreen} />
              <Stack.Screen name="StockUtensilios" component={StockUtensiliosScreen} />
              <Stack.Screen name="Menus" component={MenusScreen} />
              <Stack.Screen name="Eventos" component={EventosScreen} />
              <Stack.Screen name="Asistencias" component={AsistenciasScreen} />
              <Stack.Screen name="ConsultarAsistencias" component={ConsultarAsistenciasScreen} />
              <Stack.Screen name="Ayuda" component={AyudaScreen} />
              
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
