import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { jwtDecode } = require('jwt-decode');

export default function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const [loading, setLoading] = useState(true);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const userData = jwtDecode(token);
        dispatch({ type: 'USER_SUCCESS', payload: userData });
        dispatch({ type: 'UPDATE_PROFILE', payload: userData });
      } else {
        dispatch({ type: 'USER_SUCCESS', payload: null });
      }
    } catch (err) {
      await AsyncStorage.removeItem('token');
      dispatch({ type: 'USER_SUCCESS', payload: null });
      console.error('Token inválido o expirado', err);
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            dispatch({ type: 'USER_SUCCESS', payload: null });
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    checkToken();
  }, []);

  return { user, loading, cerrarSesion };
}
