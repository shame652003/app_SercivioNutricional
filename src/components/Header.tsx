import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, ImageBackground, View, Easing } from 'react-native';
import { useSelector } from 'react-redux'; 

interface Info {
  Titulo?: string;
  showSubtitle?: boolean;
}

function Header(props: Info) {
  const user = useSelector((state: any) => state.user.user);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.50, // Zoom más perceptible
          duration: 15000,
          easing: Easing.inOut(Easing.ease), // Hace la animación más natural
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
      {props.showSubtitle !== false && user && (
       <Text style={styleHeader.subtitle}>{user.nombre} {user.apellido}</Text>
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
