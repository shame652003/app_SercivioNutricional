// components/GraficoCircular.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native'; // Importa ScrollView
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function GraficoCircular({ data, title }) {
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {/* Usamos un ScrollView horizontal para el caso de que el gráfico sea muy ancho o la leyenda sea larga */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartScrollView}>
        <PieChart
          data={data}
          // Aumentamos el ancho del gráfico para que tenga espacio suficiente
          // Puedes ajustar este valor si el círculo sigue sin verse completo
          width={screenWidth * 1.2} // Por ejemplo, 120% del ancho de la pantalla
          height={220} // Mantén la altura
          chartConfig={{
            backgroundColor: '#f0f0f0',
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#f0f0f0',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            // Configuramos las propiedades para las etiquetas del gráfico (porcentajes)
            propsForLabels: {
              fontSize: 10, // Un poco más pequeña para asegurar que quepa
              fill: '#fff', // Color de texto para que se vea sobre los colores del gráfico
            },
            // Configuramos las propiedades para la leyenda
            propsForDots: {
              r: '6', // Tamaño de los puntos de la leyenda
              strokeWidth: '2',
              stroke: '#fff',
            },
            decimalPlaces: 0, // Si quieres números enteros en los porcentajes
          }}
          accessor="population"
          backgroundColor="transparent"
          // Mueve el paddingLeft para alinear el gráfico si el texto de la leyenda se mueve abajo
          paddingLeft="0" // Cambiado a 0 si la leyenda va abajo o se usa un contenedor específico
          center={[0, 0]} // Centra el gráfico si es necesario. Ajusta si tienes problemas.
          hasLegend={false} // Desactivamos la leyenda por defecto del PieChart
          style={{
            marginVertical: 8,
            alignSelf: 'center', // Para centrar el gráfico dentro del ScrollView
          }}
          // No necesitamos pasar propsForLabels aquí de nuevo, ya está en chartConfig
        />
      </ScrollView>

      {/* Creamos una leyenda personalizada debajo del gráfico */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.name} ({item.population}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#00000054',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0066CC',
  },
  chartScrollView: {
    alignItems: 'center', // Centra el contenido si es más ancho que el ScrollView
  },
  legendContainer: {
    flexDirection: 'column', // Muestra los elementos de la leyenda en una columna
    alignItems: 'flex-start', // Alinea los elementos a la izquierda
    marginTop: 10, // Espacio entre el gráfico y la leyenda
    width: '100%', // Para que la leyenda ocupe todo el ancho disponible
    paddingLeft: 20, // Un poco de padding a la izquierda para alinear con el gráfico
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, // Espacio entre cada elemento de la leyenda
  },
  legendColorBox: {
    width: 15,
    height: 15,
    borderRadius: 7.5, // Para que sean círculos
    marginRight: 10,
  },
  legendText: {
    fontSize: 14, // Ajusta el tamaño de la fuente para que quepa bien
    color: '#333',
  },
});