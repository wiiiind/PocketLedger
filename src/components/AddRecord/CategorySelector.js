import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CategorySelector({ type, selected, onSelect, categories }) {
  const theme = useTheme();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.category,
            {
              backgroundColor: selected === cat.id 
                ? theme.colors[type]
                : theme.colors.surface,
            },
          ]}
          onPress={() => onSelect(cat.id)}
        >
          <Icon
            name={cat.icon}
            size={24}
            color={selected === cat.id ? '#fff' : theme.colors[type]}
          />
          <Text
            style={[
              styles.label,
              { color: selected === cat.id ? '#fff' : theme.colors.text },
            ]}
          >
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  category: {
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    borderWidth: 1,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
  },
}); 