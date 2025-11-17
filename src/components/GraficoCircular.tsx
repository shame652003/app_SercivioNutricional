
import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native'; // Importa ScrollView
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function GraficoCircular({ data, title }) {
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartScrollView}>
        <PieChart
          data={data}
    
          width={screenWidth * 1.2} 
          height={220} 
          chartConfig={{
            backgroundColor: '#f0f0f0',
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#f0f0f0',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
           
            propsForLabels: {
              fontSize: 10, 
              fill: '#fff', 
            },
          
            propsForDots: {
              r: '6', 
              strokeWidth: '2',
              stroke: '#fff',
            },
            decimalPlaces: 0, 
          }}
          accessor="population"
          backgroundColor="transparent"
        
          paddingLeft="0"
          center={[0, 0]} 
          hasLegend={false} 
          style={{
            marginVertical: 8,
            alignSelf: 'center', 
          }}

        />
      </ScrollView>

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
    alignItems: 'center', 
  },
  legendContainer: {
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    marginTop: 10,
    width: '100%', 
    paddingLeft: 20, 
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColorBox: {
    width: 15,
    height: 15,
    borderRadius: 7.5, 
    marginRight: 10,
  },
  legendText: {
    fontSize: 14, 
    color: '#333',
  },
});