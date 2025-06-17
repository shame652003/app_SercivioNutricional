import React from "react";
import { Text,View,StyleSheet, TouchableOpacity } from "react-native";

interface Info{
    title: string,
    onPress ?: () => void;
}

 function Botton(props:Info){
    return(
        <View>
            <TouchableOpacity style={styleBotton.btnPrimary} onPress={props.onPress}>
                 <Text style={styleBotton.textBotton}>{props.title}</Text>
            </TouchableOpacity>
        </View>

    );
}

export default Botton;

const styleBotton = StyleSheet.create({
   
    btnPrimary: {
        backgroundColor: '#0066CC',
        borderColor: '#01154d',
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
  