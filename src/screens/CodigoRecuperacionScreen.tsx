import React from 'react';
import {View,Text,StyleSheet,Image,TouchableOpacity,KeyboardAvoidingView,Platform} from 'react-native';
import {CodeField,Cursor,useBlurOnFulfill,useClearByFocusCell,} from 'react-native-confirmation-code-field';
import FlashMessage from 'react-native-flash-message';
import Card from '../components/Card';
import Botton from '../components/Botton';
import LoadingModal from '../components/LoadingModal';
import useCodigoRecuperacionValidation from '../hooks/useCodigoRecuperacionValidations';

export default function CodigoRecuperacionScreen({ navigation }) {
  const {
    codigo,
    errorCodigo,
    loading,
    handleCodigoChange,
    verificarCodigo,
    reenviarCodigo,
  } = useCodigoRecuperacionValidation(navigation);

  const ref = useBlurOnFulfill({ value: codigo, cellCount:6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: codigo,
    setValue: handleCodigoChange,
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlashMessage position="top" />
      <LoadingModal visible={loading} message="Verificando..." />
      <Card>
        <View style={styles.header}>
          <Image source={require('../../assets/logo.png')} style={styles.icon} />
          <Text style={styles.welcomeText}>Código de Recuperación</Text>
        </View>

        <Text style={styles.subtitle}>
          Revisa tu correo e ingresa el código que te enviamos para continuar con la recuperación de tu contraseña.
        </Text>

        <CodeField
          ref={ref}
          {...props}
          value={codigo}
          onChangeText={handleCodigoChange}
          cellCount={6}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              style={[
                styles.cell,
                isFocused && styles.focusCell,
                errorCodigo && styles.cellError,
              ]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />

        {errorCodigo && <Text style={styles.errorText}>{errorCodigo}</Text>}

        <Botton
          title="Verificar Código"
          onPress={verificarCodigo}
          disabled={loading || codigo.length !== 6}
        />

        <TouchableOpacity style={styles.link} onPress={reenviarCodigo}>
          <Text style={styles.linkText}>¿No recibiste el código? Reenviar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Volver atrás</Text>
        </TouchableOpacity>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1ECF4',
    paddingTop: '43%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 100,
    height: 70,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066CC',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#808080',
    marginBottom: 25,
    textAlign: 'center',
  },
  codeFieldRoot: {
  marginBottom: 10,
  justifyContent: 'space-between',
  paddingHorizontal: 6,
  flexDirection: 'row',
},

cell: {
  width: 35,
  height: 48,
  borderWidth: 2,
  borderColor: '#0066CC',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 1,
  backgroundColor: '#fff',
},

  focusCell: {
    borderColor: '#003366',
  },
  cellText: {
    fontSize: 20,
    color: '#333',
  },
  cellError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: '#0066CC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});
