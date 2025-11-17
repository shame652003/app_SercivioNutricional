import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, ImageBackground, View, Easing } from 'react-native';
import { useSelector } from 'react-redux';
import { API_URL } from '@env'; 

interface Info {
  Titulo?: string;
  showSubtitle?: boolean;
  showConsultarAsistencia?: boolean;
  navigation?: any;
}

function Header(props: Info) {
  const profile = useSelector((state: any) => state.profile || {});
  const nombreCompleto = `${profile.nombre || ''} ${profile.apellido || ''}`.trim();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
  }, [profile]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.50, 
          duration: 15000,
          easing: Easing.inOut(Easing.ease), 
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 15000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styleHeader.header}>
      <Animated.View style={{ ...StyleSheet.absoluteFillObject, transform: [{ scale: scaleAnim }] }}>
        <ImageBackground 
          source={require('../../assets/header2.png')} 
          style={styleHeader.image}
          resizeMode="cover"
        />
      </Animated.View>
      
      <Text style={styleHeader.title}>{props.Titulo}</Text>
      {props.showSubtitle !== false && (
        <Text style={styleHeader.subtitle}>{nombreCompleto}</Text>
      )}
      {props.showConsultarAsistencia && (
        <Text 
          onPress={() => props.navigation?.navigate('ConsultarAsistencias')} 
          style={styleHeader.subtitle}>
          Consultar Asistencia</Text>
      )}
    </View>
  );
}

export default Header;

const styleHeader = StyleSheet.create({
  header: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,  
    borderBottomRightRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 25,  
    borderBottomRightRadius: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
