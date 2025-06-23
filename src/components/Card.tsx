import {View, StyleSheet} from "react-native"


interface Info{
    children: React.ReactNode;
  };
  
  function Card(props:Info){
      return (
          <View style={stylesCard.cardy}>{props.children}</View>
      )
  
  }
  
  export default Card;
  
  const stylesCard = StyleSheet.create({
      cardy:{
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#00000054',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        marginTop:-65,
        marginHorizontal:20,
  
      }
    });