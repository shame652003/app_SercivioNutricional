import React, { useState } from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import Card from '../components/Card';
import CedulaInput from '../components/CedulaInput';
import EstudianteInfo from '../components/EstudianteInfo';
import PlatosDisponibles from '../components/PlatosDisponibles';
import QRScanner from '../components/QRScanner';
import BotonesAsistencia from '../components/BotonesAsistencia';
import useCedulaInput from '../hooks/useCedulaInput';
import usePlatosPorHorario from '../hooks/usePlatosPorHorario';
import useAsistencia from '../hooks/useAsistencia';
import FechaActual from '../components/FechaActual';
import HorarioComidaSelect from '../components/HorarioComidaSelect';
import QRScannerModal from '../components/QRScannerModal';


export default function AsistenciasScreen({ navigation }) {
  // Hooks para pruebas (todo estático)
  const { cedula, estudiante, handleCedulaChange, clear, setByQR } = useCedulaInput();
  const { 
    horarioSeleccionado, 
    platosDisponibles, 
    cambiarHorario, 
    descontarPlato, 
    resetearPlatos 
  } = usePlatosPorHorario();
  const { registrado, registrar, cancelar } = useAsistencia();
  const [isScannerVisible, setScannerVisible] = useState(false);

  return (
    <Container>
        <StatusBar backgroundColor="#0033aa" barStyle="light-content"/> 
      <NavHead navigation={navigation} />
      <ContentContainer>
        <Header Titulo="Registrar Asistencias" showSubtitle={false} />
        <Card>
            <FechaActual />
              <View style={styles.rowContainer}>
              <View style={styles.horarioContainer}>
                <HorarioComidaSelect 
                  selectedValue={horarioSeleccionado}
                  onValueChange={cambiarHorario}
                />
              </View>
              <View style={styles.platosContainer}>
                <PlatosDisponibles platos={platosDisponibles} />
              </View>
            </View>
            <CedulaInput 
              value={cedula} 
              onChange={handleCedulaChange} 
              onScanQR={() => setScannerVisible(true)}
              editable={!registrado && platosDisponibles > 0} 
            />
            <QRScannerModal 
              visible={isScannerVisible}
              onClose={() => setScannerVisible(false)}
              onCodeScanned={(data) => {
                setByQR(data);
                setScannerVisible(false);
              }}
            />
            {estudiante && (
              <EstudianteInfo estudiante={estudiante} />
            )}
            <BotonesAsistencia
              onConfirmar={() => {
                registrar();
                descontarPlato();
              }}
              onCancelar={() => {
                cancelar();
                clear();
              }}
              disabled={!estudiante || platosDisponibles === 0 || registrado}
            />
          </Card>
      </ContentContainer>
      <BottomNavBar navigation={navigation} />
    </Container>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'column',
    gap: 1,
    width: '100%',
  },
  platosContainer: {
    width: '100%',
  },
  horarioContainer: {
    flex: 1,
    marginLeft: 8,
  },
});
