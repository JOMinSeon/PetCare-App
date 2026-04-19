import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryLineChart, VictoryTheme } from 'victory-native';

interface ChartDataItem {
  date: string;
  minutes: number;
  steps?: number;
}

interface ActivityLineChartProps {
  data: ChartDataItem[];
  goalMinutes: number;
  height?: number;
}

export const ActivityLineChart: React.FC<ActivityLineChartProps> = ({
  data,
  goalMinutes,
  height = 200,
}) => {
  const screenWidth = Dimensions.get('window').width - 32;

  const chartData = data.map((item, index) => ({
    x: index + 1,
    y: item.minutes,
  }));

  const goalLineData = [
    { x: 0, y: goalMinutes },
    { x: 8, y: goalMinutes },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3);
  };

  return (
    <View style={styles.container}>
      <VictoryLineChart
        width={screenWidth}
        height={height}
        theme={VictoryTheme.material}
        data={chartData}
        interpolation="monotoneX"
        style={{
          data: { stroke: '#00897B', strokeWidth: 2 },
        }}
        domainPadding={{ x: 20, y: 20 }}
        yAxisOverride={{ tickValues: [0, goalMinutes / 2, goalMinutes, goalMinutes * 1.5] }}
      />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: '#00897B' }]} />
          <Text style={styles.legendText}>Activity (min)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: '#EF5350', borderStyle: 'dashed' }]} />
          <Text style={styles.legendText}>Goal: {goalMinutes} min</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});