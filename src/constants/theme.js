import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: '#ffffff',
    text: '#000000',
    error: '#B00020',
    success: '#4CAF50',
    income: '#4CAF50',
    expense: '#F44336',
    surfaceVariant: '#f5f5f5',
    elevation: {
      level0: 'transparent',
      level1: '#fff',
      level2: '#fff',
      level3: '#fff',
      level4: '#fff',
      level5: '#fff',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    accent: '#03dac4',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    error: '#CF6679',
    success: '#4CAF50',
    income: '#81C784',
    expense: '#E57373',
    surfaceVariant: '#2c2c2c',
    elevation: {
      level0: 'transparent',
      level1: '#1e1e1e',
      level2: '#232323',
      level3: '#252525',
      level4: '#272727',
      level5: '#2a2a2a',
    },
  },
}; 