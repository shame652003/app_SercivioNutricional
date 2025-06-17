import {NavigationContainer} from '@react-navigation/native';
import React from 'react'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RecuperarContraseñaScreen from '../screens/RecuperarContraseñaScreen';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import CambioContraseñaScreen from '../screens/CambioContraseñaScreen';
import { RootStackParamList } from '../types';
import {Provider as PaperProvider,} from 'react-native-paper';
import StockAlimentosScreen from '../screens/StockAlimentosScreen';

export default function Navigation() {
  return (
    <PaperProvider >
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
    </PaperProvider>
  );
}
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="RecuperarContraseña" component={RecuperarContraseñaScreen}  options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="CambioContraseña" component={CambioContraseñaScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="StockAlimentos" component={StockAlimentosScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

