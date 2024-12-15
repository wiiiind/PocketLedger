import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, useTheme, Divider } from 'react-native-paper';

interface SettingsScreenProps {
  isDarkMode: boolean;
  followSystem: boolean;
  onFollowSystemChange: (value: boolean) => void;
  onToggleTheme: () => void;
}

export default function SettingsScreen({
  isDarkMode,
  followSystem,
  onFollowSystemChange,
  onToggleTheme,
}: SettingsScreenProps) {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>主题设置</List.Subheader>
        <List.Item
          title="跟随系统"
          right={() => (
            <Switch
              value={followSystem}
              onValueChange={onFollowSystemChange}
            />
          )}
        />
        <List.Item
          title="深色模式"
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={onToggleTheme}
              disabled={followSystem}
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>关于</List.Subheader>
        <List.Item
          title="版本"
          description="1.0.0"
          left={props => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title="反馈问题"
          description="帮助我们改进应用"
          left={props => <List.Icon {...props} icon="message-alert" />}
          onPress={() => {/* 添加反馈链接 */}}
        />
        <List.Item
          title="隐私政策"
          left={props => <List.Icon {...props} icon="shield-check" />}
          onPress={() => {/* 添加隐私政策链接 */}}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 