import { Children } from "react";
import {View, StyleSheet} from "react-native"


interface Info{
    children: React.ReactNode;
  };
  
  function Container(props:Info){
      return (
        <View style={stylesContainer.container}> {props.children}</View>
      )
  
  }
  
  export default Container;
  
  const stylesContainer = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#E1ECF4',
      },
    });