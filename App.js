// App.js (Modificación)

import { StatusBar } from 'react-native';
import { StyleSheet } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';

import store from './src/context/store';
import SocketGate from './socketGate';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#0033aa" barStyle="light-content" />
      <FlashMessage position="center" />
      <ReduxProvider store={store}>
        <PaperProvider>
          <SocketGate /> 
        </PaperProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}

// ... (Styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonColor: {
    backgroundColor: 'red',
  },
});
