import { Children } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';


interface Info{
    children: React.ReactNode;
  };
  
  function Container(props:Info){
      return (
        <SafeAreaView style={stylesContainer.container} edges={['top']}>
          {props.children}
        </SafeAreaView>
      )
  
  }
  
  export default Container;
  
  const stylesContainer = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#E1ECF4',
      },
    });