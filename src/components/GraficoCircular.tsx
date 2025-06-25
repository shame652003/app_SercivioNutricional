import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function GraficoCircular() {
  const data = [
    { name: 'Frutas', population: 40, color: '#0662c5', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Verduras', population: 30, color: '#5fc1ff', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Proteínas', population: 20, color: '#049ff9', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Granos', population: 10, color: '#201db8', legendFontColor: '#333', legendFontSize: 12 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alimentos Disponibles</Text>
      <PieChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#f0f0f0',
          backgroundGradientFrom: '#f0f0f0',
          backgroundGradientTo: '#f0f0f0',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        hasLegend={true}
      />
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
    marginHorizontal:10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0066CC',  
  },
});
