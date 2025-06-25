import { StatusBar } from 'react-native';
import { StyleSheet, View, Text } from 'react-native';
import { Provider } from "react-redux"
import store from './src/context/store'
import Navigate from './src/navigate/Navigate';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage, { showMessage } from 'react-native-flash-message';
export default function App() {
 
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#0033aa" barStyle="light-content" />
      <FlashMessage position="center" />
      <Provider store={store}>
        <Navigate/>
        </Provider>
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