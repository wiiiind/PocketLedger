import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme, SegmentedButtons, Text } from 'react-native-paper';
import { VictoryPie, VictoryLabel } from 'victory-native';
import { useStorageContext } from '../contexts/StorageContext';
import { calculateTotals, formatMoney } from '../utils/helpers';

export default function StatsScreen() {
  const theme = useTheme();
  const { records, categories } = useStorageContext();
  const [type, setType] = useState('expense');

  const getChartData = () => {
    const categoryTotals = records
      .filter(record => record.type === type)
      .reduce((acc, record) => {
        const category = categories[type].find(cat => cat.id === record.category);
        const label = category ? category.label : '未知分类';
        acc[label] = (acc[label] || 0) + Number(record.amount);
        return acc;
      }, {});

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(categoryTotals)
      .map(([label, amount]) => ({
        x: label,
        y: amount,
        percentage: ((amount / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.y - a.y);
  };

  const { income, expense } = calculateTotals(records);
  const total = type === 'income' ? income : expense;
  const chartData = getChartData();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerWrapper: {
      // 删除 backgroundColor 属性
    },
    header: {
      padding: 16,
    },
    segment: {
      marginBottom: 16,
    },
    total: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
    },
    chartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 350,
      marginTop: 20,
    },
    legend: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    legendColor: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 8,
    },
    legendText: {
      flex: 1,
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <SegmentedButtons
            value={type}
            onValueChange={setType}
            buttons={[
              { value: 'expense', label: '支出' },
              { value: 'income', label: '收入' },
            ]}
            style={styles.segment}
          />

          <Text style={styles.total}>
            总{type === 'income' ? '收入' : '支出'}: {formatMoney(total)}
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <VictoryPie
          key={type}
          data={chartData}
          width={Dimensions.get('window').width}
          height={300}
          innerRadius={50}
          padAngle={3}
          radius={({ datum }) => 100}
          labelRadius={({ innerRadius }) => innerRadius + 80}
          colorScale={type === 'income' ? ['#4CAF50', '#81C784', '#A5D6A7'] : ['#F44336', '#E57373', '#FFCDD2']}
          style={{
            labels: {
              fill: theme.colors.text,
              fontSize: 12,
            },
          }}
          labelComponent={
            <VictoryLabel
              style={{ fill: theme.colors.text }}
              labelPlacement="perpendicular"
              angle={0}
              text={({ datum }) => datum.x}
            />
          }
          padding={{ top: 50, bottom: 50, left: 50, right: 50 }}
          animate={{
            duration: 2000,
            onLoad: {
              duration: 1000,
              before: () => ({ startAngle: -90, endAngle: -90 }),
              after: () => ({ startAngle: 0, endAngle: 360 })
            },
            onExit: {
              duration: 500,
              before: () => ({ startAngle: 0, endAngle: 0 })
            },
            onEnter: {
              duration: 1000,
              before: () => ({ startAngle: -90, endAngle: -90 }),
              after: () => ({ startAngle: 0, endAngle: 360 })
            }
          }}
        />
      </View>

      <View style={styles.legend}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                {
                  backgroundColor: type === 'income' 
                    ? ['#4CAF50', '#81C784', '#A5D6A7'][index % 3]
                    : ['#F44336', '#E57373', '#FFCDD2'][index % 3],
                },
              ]}
            />
            <Text style={styles.legendText}>
              {item.x}: {formatMoney(item.y)} ({item.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
} 