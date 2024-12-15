import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import RecordList from '../components/RecordList/RecordList';
import TotalSummary from '../components/RecordList/TotalSummary';
import FilterBar from '../components/RecordList/FilterBar';
import { useStorageContext } from '../contexts/StorageContext';

export default function HomeScreen() {
  const { records, loading, deleteRecord } = useStorageContext();
  const theme = useTheme();
  const [filters, setFilters] = useState({
    dateRange: null,
    type: 'all',
    category: 'all'
  });

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const recordDate = new Date(record.date);
      const dateMatch = !filters.dateRange || !filters.dateRange.start || !filters.dateRange.end || 
        (recordDate >= filters.dateRange.start && recordDate <= filters.dateRange.end);
      
      const typeMatch = filters.type === 'all' || record.type === filters.type;
      
      const categoryMatch = filters.category === 'all' || record.category === filters.category;
      
      return dateMatch && typeMatch && categoryMatch;
    });
  }, [records, filters]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TotalSummary records={filteredRecords} />
        <FilterBar 
          filters={filters}
          onFilterChange={setFilters}
        />
      </View>
      <RecordList 
        records={filteredRecords} 
        loading={loading}
        onDelete={deleteRecord}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // 删除白色背景
    // backgroundColor: 'white',
    // 删除阴影效果
    // elevation: 4,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
}); 