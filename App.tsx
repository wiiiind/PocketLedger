import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { lightTheme, darkTheme } from './src/constants/theme';
import HomeScreen from './src/screens/HomeScreen';
import AddScreen from './src/screens/AddScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, Platform } from 'react-native';
import { StorageProvider } from './src/contexts/StorageContext';

const Tab = createBottomTabNavigator();
const THEME_SETTINGS_KEY = 'THEME_SETTINGS';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const theme = Appearance.getColorScheme();
    console.log('初始系统主题:', theme);
    return theme === 'dark';
  });
  const [followSystem, setFollowSystem] = useState(true);

  // 监听系统主题变化
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('系统主题变化:', colorScheme);
      if (followSystem) {
        setIsDarkMode(colorScheme === 'dark');
      }
    });

    // 确保在组件挂载时检查一次主题
    const currentTheme = Appearance.getColorScheme();
    if (followSystem) {
      setIsDarkMode(currentTheme === 'dark');
    }

    return () => {
      subscription.remove();
    };
  }, [followSystem]);

  const loadThemeSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem(THEME_SETTINGS_KEY);
      if (settings) {
        const { followSystem: savedFollowSystem, isDark } = JSON.parse(settings);
        setFollowSystem(savedFollowSystem);
        if (!savedFollowSystem) {
          setIsDarkMode(isDark);
        } else {
          const currentSystemTheme = Appearance.getColorScheme();
          setIsDarkMode(currentSystemTheme === 'dark');
        }
      }
    } catch (error) {
      console.error('加载主题设置失败:', error);
    }
  };

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const saveThemeSettings = async (followSystem: boolean, isDark: boolean) => {
    try {
      await AsyncStorage.setItem(
        THEME_SETTINGS_KEY,
        JSON.stringify({ followSystem, isDark })
      );
    } catch (error) {
      console.error('保存主题设置失败:', error);
    }
  };

  const toggleTheme = () => {
    if (!followSystem) {
      const newIsDarkMode = !isDarkMode;
      setIsDarkMode(newIsDarkMode);
      saveThemeSettings(followSystem, newIsDarkMode);
    }
  };

  const handleFollowSystemChange = (value: boolean) => {
    setFollowSystem(value);
    if (value) {
      // 立即应用系统主题
      const currentTheme = Appearance.getColorScheme();
      setIsDarkMode(currentTheme === 'dark');
      saveThemeSettings(value, currentTheme === 'dark');
    } else {
      saveThemeSettings(value, isDarkMode);
    }
  };

  const theme = {
    ...(isDarkMode ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(isDarkMode ? MD3DarkTheme.colors : MD3LightTheme.colors),
      ...(isDarkMode ? darkTheme.colors : lightTheme.colors),
    },
  };

  const screenOptions = ({ route: { name } }) => ({
    tabBarIcon: ({ focused, color }) => {
      let iconName = '';
      switch (name) {
        case '账目':
          iconName = focused ? 'book-open-variant' : 'book-open-outline';
          break;
        case '记账':
          iconName = focused ? 'plus-circle' : 'plus-circle-outline';
          break;
        case '统计':
          iconName = focused ? 'chart-pie' : 'chart-donut';
          break;
        case '设置':
          iconName = focused ? 'cog' : 'cog-outline';
          break;
        default:
          iconName = 'help-circle';
      }
      return <Icon name={iconName} size={24} color={color} />;
    },
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: 'gray',
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
    },
    headerStyle: {
      backgroundColor: theme.colors.surface,
    },
    headerTintColor: theme.colors.text,
    tabBarLabelStyle: {
      fontSize: 12,
    },
    animationEnabled: false,
    gestureEnabled: false,
  });

  return (
    <StorageProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer
          theme={{
            dark: isDarkMode,
            colors: {
              primary: theme.colors.primary,
              background: theme.colors.background,
              card: theme.colors.surface,
              text: theme.colors.text,
              border: theme.colors.outline,
              notification: theme.colors.error,
            },
          }}
          documentTitle={{
            enabled: false
          }}
        >
          <Tab.Navigator 
            screenOptions={screenOptions}
            backBehavior="none"
            sceneContainerStyle={{
              backgroundColor: theme.colors.background
            }}
          >
            <Tab.Screen 
              name="账目" 
              component={HomeScreen}
              options={{
                unmountOnBlur: true,
                freezeOnBlur: true,
              }}
            />
            <Tab.Screen 
              name="记账" 
              component={AddScreen}
              options={{
                unmountOnBlur: true,
                freezeOnBlur: true,
              }}
            />
            <Tab.Screen 
              name="统计" 
              component={StatsScreen}
              options={{
                unmountOnBlur: true,
                freezeOnBlur: true,
              }}
            />
            <Tab.Screen 
              name="设置" 
              children={() => (
                <SettingsScreen 
                  isDarkMode={isDarkMode}
                  followSystem={followSystem}
                  onFollowSystemChange={handleFollowSystemChange}
                  onToggleTheme={toggleTheme}
                />
              )}
              options={{
                unmountOnBlur: true,
                freezeOnBlur: true,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StorageProvider>
  );
}
