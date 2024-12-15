import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Title, Text, useTheme } from 'react-native-paper';
import { calculateTotals, formatMoney } from '../../utils/helpers';

export default function TotalSummary({ records }) {
  const theme = useTheme();
  const { income, expense, balance } = calculateTotals(records);

  return (
    <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Title style={{ color: theme.colors.income }}>收入</Title>
            <Text style={styles.amount}>{formatMoney(income)}</Text>
          </View>
          <View style={styles.column}>
            <Title style={{ color: theme.colors.expense }}>支出</Title>
            <Text style={styles.amount}>{formatMoney(expense)}</Text>
          </View>
          <View style={styles.column}>
            <Title>结余</Title>
            <Text style={[
              styles.amount,
              { color: balance >= 0 ? theme.colors.income : theme.colors.expense }
            ]}>
              {formatMoney(balance)}
            </Text>
          </View>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    marginTop: 4,
  },
}); 