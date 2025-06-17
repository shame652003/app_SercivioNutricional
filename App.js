import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { Provider } from "react-redux"
import store from "./context/store"
import Navigate from './navigate/Navigate';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage, { showMessage } from 'react-native-flash-message';
export default function App() {
 
  return (
    <SafeAreaProvider>
       <FlashMessage position="center" />  
      <Provider store={store}>
        <Navigate/>
        </Provider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonColor:{
    backgroundColor: 'red',
  }
});