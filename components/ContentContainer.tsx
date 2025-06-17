import {View, StyleSheet, ScrollView} from "react-native"


interface Info{
    children: React.ReactNode;
  };
  
  function ContentContainer(props:Info){
      return (
        <ScrollView contentContainerStyle={stylesContainer.contentContainer}>{props.children}</ScrollView>
      )
  
  }
  
  export default ContentContainer;
  
  const stylesContainer = StyleSheet.create({
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingBottom: 80, 
      },
    });