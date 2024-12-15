import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../utils/helpers';

export default function DateTimePicker({ value, onChange, mode = 'date' }) {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      onChange({ type: 'set', nativeEvent: { timestamp: selectedDate }});
    }
  };

  return (
    <View>
      <Button 
        mode="outlined" 
        onPress={() => setShow(true)}
        style={styles.button}
      >
        {formatDate(value)}
      </Button>

      {show && (
        <RNDateTimePicker
          value={value}
          mode={mode}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 16,
  },
}); 