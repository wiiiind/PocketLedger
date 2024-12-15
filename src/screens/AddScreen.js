import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import AddRecordForm from '../components/AddRecord/AddRecordForm';
import { useStorageContext } from '../contexts/StorageContext';

export default function AddScreen({ navigation }) {
  const theme = useTheme();
  const { saveRecord } = useStorageContext();

  const handleSubmit = async (record) => {
    const success = await saveRecord(record);
    if (success) {
      navigation.navigate('账目');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AddRecordForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 