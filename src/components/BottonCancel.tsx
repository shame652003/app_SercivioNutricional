
  import React from "react";
  import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
  
  interface Info {
    title: string;
    onPress?: () => void;
  }
  
  function BottonCancel(props: Info) {
    return (
      <View style={styleBotton.container}>
        <TouchableOpacity style={styleBotton.btnSecondary} onPress={props.onPress}>
          <Text style={styleBotton.textBotton}>{props.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  export default BottonCancel;
  
  const styleBotton = StyleSheet.create({
    container: {
      width: "100%", // Asegura que el contenedor ocupe el 100% del ancho
      alignItems: "center", // Centra el botón en el contenedor
    },
    btnSecondary: {
        backgroundColor: '#F44336',
        borderColor: '#8d0101',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 15,
        flex: 1,
        marginHorizontal: 5,
        height: 50,
        width: '100%',
      },
      
    textBotton:{
        fontSize:16,
        color:'#fff',
        fontWeight:'bold'
    }
  });