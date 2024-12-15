import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator, List, Text, IconButton, useTheme } from 'react-native-paper';
import { groupRecordsByDate, formatDate, formatMoney } from '../../utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStorageContext } from '../../contexts/StorageContext';

export default function RecordList({ records, loading, onDelete }) {
  const theme = useTheme();
  const { categories } = useStorageContext();

  if (loading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  const groupedRecords = groupRecordsByDate(records);
  const sortedDates = Object.keys(groupedRecords).sort((a, b) => new Date(b) - new Date(a));

  const getCategory = (type, categoryId) => {
    return categories[type].find(cat => cat.id === categoryId) || 
           { id: categoryId, label: '未知分类', icon: 'help-circle' };
  };

  const renderRecord = ({ item }) => {
    const category = getCategory(item.type, item.category);
    
    return (
      <List.Item
        title={category.label}
        description={item.note}
        style={styles.listItem}
        left={() => (
          <Icon
            name={category.icon}
            size={24}
            color={item.type === 'income' ? theme.colors.income : theme.colors.expense}
            style={styles.icon}
          />
        )}
        right={() => (
          <View style={styles.rightContent}>
            <Text style={[
              styles.amount,
              { color: item.type === 'income' ? theme.colors.income : theme.colors.expense }
            ]}>
              {item.type === 'income' ? '+' : '-'}{formatMoney(item.amount)}
            </Text>
            <IconButton
              icon="delete"
              size={20}
              style={styles.deleteButton}
              onPress={() => onDelete(item.id)}
            />
          </View>
        )}
      />
    );
  };

  return (
    <FlatList
      data={sortedDates}
      keyExtractor={date => date}
      contentContainerStyle={styles.listContent}
      renderItem={({ item: date }) => (
        <View>
          <List.Subheader>{formatDate(date)}</List.Subheader>
          {groupedRecords[date].map(record => (
            <View key={record.id}>
              {renderRecord({ item: record })}
            </View>
          ))}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 8,
    alignSelf: 'center',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  amount: {
    fontSize: 16,
    marginRight: 8,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  listItem: {
    paddingRight: 0,
  },
  deleteButton: {
    margin: 0,
    marginLeft: 4,
  },
}); 