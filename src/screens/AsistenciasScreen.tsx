import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import NavHead from '../components/NavHead';
import Container from '../components/Container';
import ContentContainer from '../components/ContentContainer';
import Card from '../components/Card';
import CedulaInput from '../components/CedulaInput';
import EstudianteInfo from '../components/EstudianteInfo';
import PlatosDisponibles from '../components/PlatosDisponibles';
import BotonesAsistencia from '../components/BotonesAsistencia';
import useCedulaInput from '../hooks/useCedulaInput';
import usePlatosPorHorario from '../hooks/usePlatosPorHorario';
import useRegistrarAsistencia from '../hooks/useRegistrarAsistencia';
import FechaActual from '../components/FechaActual';
import HorarioComidaSelect from '../components/HorarioComidaSelect';
import QRScannerModal from '../components/QRScannerModal';


export default function AsistenciasScreen({ navigation }) {

  const { cedula, estudiante, handleCedulaChange, clear, setByQR } = useCedulaInput();
  const { 
    horarioSeleccionado, 
    platosDisponibles, 
    cargando: cargandoPlatos,
    idMenu,
    cambiarHorario, 
    actualizarPlatosDisponibles,
    hayPlatosDisponibles
  } = usePlatosPorHorario();
  const { loading: loadingAsistencia, registrarAsistencia } = useRegistrarAsistencia(navigation);
  const [isScannerVisible, setScannerVisible] = useState(false);

  return (
    <Container>
      <NavHead navigation={navigation} />
      <ContentContainer>
        <Header 
          Titulo="Registrar Asistencias" 
          showSubtitle={false} 
          showConsultarAsistencia={true}
          navigation={navigation}
        />
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
              editable={hayPlatosDisponibles()}
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
              onConfirmar={async () => {
                if (estudiante && idMenu) {
                  await registrarAsistencia(estudiante.cedula, idMenu, horarioSeleccionado);
                  await actualizarPlatosDisponibles();
                  clear();
                }
              }}
              onCancelar={() => {
                clear();
              }}
              disabled={!estudiante || !hayPlatosDisponibles() || loadingAsistencia}
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
    width: '100%',
  },
});
