// components/GraficoCircular.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function GraficoCircular({ data, title }) {
  const [selectedSlice, setSelectedSlice] = useState(null);

  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.population, 0);

  const chartData = data.map((item) => ({
    ...item,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12, // Tamaño de fuente más pequeño para la leyenda
  }));

  const chartConfig = {
    backgroundColor: '#f0f0f0',
    backgroundGradientFrom: '#f0f0f0',
    backgroundGradientTo: '#f0f0f0',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const handlePress = (slice) => {
    setSelectedSlice(slice);
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <PieChart
        data={chartData}
        width={screenWidth - 80} // Reducir aún más el ancho para dejar espacio
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        hasLegend={true}
        center={[0, 0]}
        absolute
        onDataPointClick={handlePress}
      />
      {selectedSlice && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {selectedSlice.name}: {selectedSlice.population} ({((selectedSlice.population / total) * 100).toFixed(2)}%)
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  infoContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});