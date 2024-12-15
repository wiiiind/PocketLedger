import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Button, Menu, Divider, Portal, useTheme } from 'react-native-paper';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useStorageContext } from '../../contexts/StorageContext';

LocaleConfig.locales['zh'] = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
};

LocaleConfig.defaultLocale = 'zh';

export default function FilterBar({ filters, onFilterChange }) {
  const theme = useTheme();
  const { categories } = useStorageContext();
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [tempDateRange, setTempDateRange] = useState(null);

  const types = [
    { value: 'all', label: '收/支' },
    { value: 'expense', label: '支出' },
    { value: 'income', label: '收入' }
  ];

  const allCategories = [
    { id: 'all', label: '全部' },
    ...categories.expense,
    ...categories.income
  ];

  const formatDateRange = () => {
    if (!filters.dateRange) return '日期';
    const { start, end } = filters.dateRange;
    if (!start && !end) return '日期';

    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const startTime = start.getTime();
    const endTime = end.getTime();
    
    // 修改本月的判断逻辑
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    thisMonthStart.setHours(0, 0, 0, 0);
    const today = new Date(now);
    today.setHours(23, 59, 59, 999);
    
    // 如果开始时间是本月1号，结束时间是今天，就显示"本月"
    if (startTime === thisMonthStart.getTime() && endTime === today.getTime()) {
      return '本月';
    }

    // 检查是否是某个月的完整月份
    const startMonth = new Date(start);
    const endMonth = new Date(end);
    if (startMonth.getDate() === 1 && 
        endMonth.getDate() === new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0).getDate() &&
        startMonth.getMonth() === endMonth.getMonth() &&
        startMonth.getFullYear() === endMonth.getFullYear()) {
      
      // 如果是今年的月份
      if (startMonth.getFullYear() === now.getFullYear()) {
        return `${startMonth.getMonth() + 1}月`;
      }
      // 如果是往年的月份
      return `${String(startMonth.getFullYear()).slice(-2)}年${startMonth.getMonth() + 1}月`;
    }

    // 本周（从本周一到今天）
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
    thisWeekStart.setHours(0, 0, 0, 0);
    if (startTime === thisWeekStart.getTime() && endTime === now.getTime()) return '本周';

    // 今天
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    if (startTime === todayStart.getTime() && endTime === now.getTime()) return '今天';

    // 近两周
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 13);
    twoWeeksAgo.setHours(0, 0, 0, 0);
    if (startTime === twoWeeksAgo.getTime() && endTime === now.getTime()) return '近两周';

    // 今年（从1月1日到今天）
    const thisYearStart = new Date(now.getFullYear(), 0, 1);
    thisYearStart.setHours(0, 0, 0, 0);
    if (startTime === thisYearStart.getTime() && endTime === now.getTime()) return '今年';

    // 如果不是特殊时间段，显示天数
    const days = Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1;
    return `${days}天`;
  };

  const handleQuickSelect = (range) => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    let start;

    switch (range) {
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'all':
        start = null;
        break;
    }

    onFilterChange({ 
      ...filters, 
      dateRange: start ? { start, end: now } : { start: null, end: null } 
    });
  };

  const showMenu = (event, setVisible) => {
    const { pageY, pageX } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    setVisible(true);
  };

  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    button: {
      flex: 1,
      borderRadius: 8,
    },
    buttonContent: {
      height: 40,
    },
    buttonLabel: {
      fontSize: 12,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    calendarContainer: {
      backgroundColor: theme.dark ? theme.colors.elevation.level1 : theme.colors.background,
      borderRadius: 10,
      padding: 10,
      width: '90%',
      maxWidth: 400,
    },
    closeButton: {
      marginTop: 10,
    },
    calendarButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingHorizontal: 10,
      gap: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button 
          mode="outlined" 
          onPress={() => setShowDatePicker(true)}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {formatDateRange()}
        </Button>

        <Button 
          mode="outlined" 
          onPress={(e) => showMenu(e, setTypeMenuVisible)}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {filters.type === 'all' ? '收/支' : types.find(t => t.value === filters.type)?.label}
        </Button>

        <Button 
          mode="outlined" 
          onPress={(e) => showMenu(e, setCategoryMenuVisible)}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {filters.category === 'all' ? '类别' : allCategories.find(c => c.id === filters.category)?.label}
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.calendarContainer}>
              <Calendar
                current={filters.dateRange?.start?.toISOString() || new Date().toISOString()}
                onDayPress={(day) => {
                  const selectedDate = new Date(Date.UTC(day.year, day.month - 1, day.day));
                  
                  if (!tempDateRange || tempDateRange.end) {
                    setTempDateRange({
                      start: selectedDate,
                      end: null
                    });
                  } else {
                    let startDate = new Date(Date.UTC(
                      tempDateRange.start.getUTCFullYear(),
                      tempDateRange.start.getUTCMonth(),
                      tempDateRange.start.getUTCDate()
                    ));
                    let endDate = selectedDate;
                    
                    if (startDate > endDate) {
                      [startDate, endDate] = [endDate, startDate];
                    }
                    
                    startDate.setUTCHours(0, 0, 0, 0);
                    endDate.setUTCHours(23, 59, 59, 999);
                    
                    setTempDateRange({
                      start: startDate,
                      end: endDate
                    });
                  }
                }}
                markedDates={{
                  ...(tempDateRange?.start && !tempDateRange?.end && {
                    [tempDateRange.start.toISOString().split('T')[0]]: { 
                      selected: true,
                      color: theme.colors.primary,
                      textColor: 'white'
                    }
                  }),
                  ...(tempDateRange?.start && tempDateRange?.end && {
                    [tempDateRange.start.toISOString().split('T')[0]]: { 
                      startingDay: true, 
                      color: theme.colors.primary,
                      textColor: 'white'
                    },
                    [tempDateRange.end.toISOString().split('T')[0]]: { 
                      endingDay: true, 
                      color: theme.colors.primary,
                      textColor: 'white'
                    },
                    ...getDatesInRange(tempDateRange.start, tempDateRange.end).reduce((acc, date) => {
                      const dateStr = date.toISOString().split('T')[0];
                      if (dateStr !== tempDateRange.start.toISOString().split('T')[0] && 
                          dateStr !== tempDateRange.end.toISOString().split('T')[0]) {
                        acc[dateStr] = {
                          color: theme.colors.primary,
                          textColor: 'white'
                        };
                      }
                      return acc;
                    }, {})
                  }),
                  ...(filters.dateRange?.start && filters.dateRange?.end && !tempDateRange && {
                    [filters.dateRange.start.toISOString().split('T')[0]]: { 
                      startingDay: true, 
                      color: theme.colors.primary,
                      textColor: 'white'
                    },
                    [filters.dateRange.end.toISOString().split('T')[0]]: { 
                      endingDay: true, 
                      color: theme.colors.primary,
                      textColor: 'white'
                    },
                    ...getDatesInRange(filters.dateRange.start, filters.dateRange.end).reduce((acc, date) => {
                      const dateStr = date.toISOString().split('T')[0];
                      if (dateStr !== filters.dateRange.start.toISOString().split('T')[0] && 
                          dateStr !== filters.dateRange.end.toISOString().split('T')[0]) {
                        acc[dateStr] = {
                          color: theme.colors.primary,
                          textColor: 'white'
                        };
                      }
                      return acc;
                    }, {})
                  })
                }}
                markingType={'period'}
                theme={{
                  selectedDayBackgroundColor: theme.colors.primary,
                  todayTextColor: theme.colors.primary,
                  arrowColor: theme.colors.primary,
                  calendarBackground: theme.colors.background,
                  textSectionTitleColor: theme.colors.text,
                  dayTextColor: theme.colors.text,
                  monthTextColor: theme.colors.text,
                  textDisabledColor: theme.colors.disabled,
                  'stylesheet.calendar.main': {
                    dayContainer: {
                      flex: 1,
                      alignItems: 'center',
                    },
                    emptyDayContainer: {
                      flex: 1,
                      alignItems: 'center',
                    },
                    disabledText: {
                      color: theme.colors.disabled,
                      opacity: 0.3,
                    },
                  },
                  'stylesheet.calendar.header': {
                    monthText: {
                      fontSize: 16,
                      fontWeight: 'bold',
                      paddingVertical: 10,
                      color: theme.colors.text,
                    },
                    dayHeader: {
                      marginTop: 2,
                      marginBottom: 7,
                      width: 32,
                      textAlign: 'center',
                      fontSize: 12,
                      color: theme.colors.text,
                    },
                    week: {
                      marginTop: 7,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    },
                    dayTextAtIndex0: {
                      color: theme.colors.text,
                    },
                    dayTextAtIndex1: {
                      color: theme.colors.text,
                    },
                    dayTextAtIndex2: {
                      color: theme.colors.text,
                    },
                    dayTextAtIndex3: {
                      color: theme.colors.text,
                    },
                    dayTextAtIndex4: {
                      color: theme.colors.text,
                    },
                    dayTextAtIndex5: {
                      color: theme.colors.text,
                    },
                    dayTextAtIndex6: {
                      color: theme.colors.text,
                    },
                  }
                }}
                monthFormat={'yyyy年MM月'}
                firstDay={1}
                hideExtraDays={true}
              />
              <View style={styles.calendarButtons}>
                <Button 
                  onPress={() => {
                    setTempDateRange(null);
                    setShowDatePicker(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  onPress={() => {
                    handleQuickSelect('all');
                    setShowDatePicker(false);
                    setTempDateRange(null);
                  }}
                >
                  显示全部
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {
                    if (tempDateRange?.start && tempDateRange?.end) {
                      onFilterChange({
                        ...filters,
                        dateRange: tempDateRange
                      });
                      setShowDatePicker(false);
                      setTempDateRange(null);
                    }
                  }}
                  disabled={!tempDateRange?.end}
                  buttonColor={theme.dark ? theme.colors.elevation.level1 : theme.colors.background}
                  textColor={theme.colors.primary}
                >
                  确认
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        <Menu
          visible={typeMenuVisible}
          onDismiss={() => setTypeMenuVisible(false)}
          anchor={menuPosition}
        >
          {types.map((type) => (
            <Menu.Item
              key={type.value}
              onPress={() => {
                onFilterChange({ ...filters, type: type.value });
                setTypeMenuVisible(false);
              }}
              title={type.label}
            />
          ))}
        </Menu>

        <Menu
          visible={categoryMenuVisible}
          onDismiss={() => setCategoryMenuVisible(false)}
          anchor={menuPosition}
        >
          {allCategories.map((category) => (
            <Menu.Item
              key={category.id}
              onPress={() => {
                onFilterChange({ ...filters, category: category.id });
                setCategoryMenuVisible(false);
              }}
              title={category.label}
            />
          ))}
        </Menu>
      </Portal>
    </View>
  );
} 