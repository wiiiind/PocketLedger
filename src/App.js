import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { lightTheme, darkTheme } from './constants/theme';
import HomeScreen from './screens/HomeScreen';
import AddScreen from './screens/AddScreen';
import StatsScreen from './screens/StatsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === '账目') {
                iconName = focused ? 'book-open-variant' : 'book-open-outline';
              } else if (route.name === '记账') {
                iconName = focused ? 'plus-circle' : 'plus-circle-outline';
              } else if (route.name === '统计') {
                iconName = focused ? 'chart-pie' : 'chart-donut';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="账目" component={HomeScreen} />
          <Tab.Screen name="记账" component={AddScreen} />
          <Tab.Screen name="统计" component={StatsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
} 