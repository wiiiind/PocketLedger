import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, Platform } from 'react-native';
import { TextInput, Button, SegmentedButtons, useTheme, Text } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import CategorySelector from './CategorySelector';
import CategoryManager from './CategoryManager';
import { useStorageContext } from '../../contexts/StorageContext';

export default function AddRecordForm({ onSubmit }) {
  const theme = useTheme();
  const { categories } = useStorageContext();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const handleSubmit = () => {
    if (!amount || !category) {
      Alert.alert('提示', '请填写金额和选择分类');
      return;
    }
    
    const record = {
      type,
      amount: parseFloat(amount),
      category,
      note,
      date: date.toISOString(),
    };

    onSubmit(record);

    // 重置表单
    setAmount('');
    setCategory('');
    setNote('');
    setDate(new Date());
  };

  const formatAmount = (value) => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    const parts = cleanValue.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1] || '';

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  };

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/,/g, '');
    setAmount(numericValue);
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    segment: {
      marginBottom: 16,
    },
    input: {
      marginBottom: 16,
    },
    dateButton: {
      marginBottom: 16,
    },
    submitButton: {
      marginTop: 16,
      marginBottom: 32,
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    calendarContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      padding: 10,
      width: '90%',
      maxWidth: 400,
    },
    closeButton: {
      marginTop: 10,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <SegmentedButtons
        value={type}
        onValueChange={(newType) => {
          setType(newType);
          setCategory(''); // 切换类型时清空已选分类
        }}
        buttons={[
          { value: 'expense', label: '支出' },
          { value: 'income', label: '收入' },
        ]}
        style={styles.segment}
      />

      <TextInput
        label="金额"
        value={formatAmount(amount)}
        onChangeText={handleAmountChange}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <View style={styles.categoryHeader}>
        <Text>选择分类</Text>
        <Button
          mode="text"
          onPress={() => setShowCategoryManager(true)}
        >
          管理分类
        </Button>
      </View>

      <CategorySelector
        type={type}
        selected={category}
        onSelect={setCategory}
        categories={categories[type]}
      />

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        选择日期: {date.toLocaleDateString()}
      </Button>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              current={date.toISOString()}
              onDayPress={(day) => {
                setDate(new Date(day.timestamp));
                setShowDatePicker(false);
              }}
              markedDates={{
                [date.toISOString().split('T')[0]]: { selected: true }
              }}
              theme={{
                selectedDayBackgroundColor: theme.colors.primary,
                todayTextColor: theme.colors.primary,
                arrowColor: theme.colors.primary,
                calendarBackground: theme.colors.background,
                textSectionTitleColor: theme.colors.text,
                dayTextColor: theme.colors.text,
                monthTextColor: theme.colors.text,
                textDisabledColor: theme.colors.disabled,
              }}
            />
            <Button 
              onPress={() => setShowDatePicker(false)}
              style={styles.closeButton}
            >
              关闭
            </Button>
          </View>
        </View>
      </Modal>

      <TextInput
        label="备注"
        value={note}
        onChangeText={setNote}
        multiline
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        保存
      </Button>

      <CategoryManager
        type={type}
        visible={showCategoryManager}
        onDismiss={() => setShowCategoryManager(false)}
      />
    </ScrollView>
  );
} 