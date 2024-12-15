import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, IconButton, Dialog, Portal, Text, List, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStorageContext } from '../../contexts/StorageContext';

export default function CategoryManager({ type, visible, onDismiss }) {
  const { categories, addCategory, deleteCategory } = useStorageContext();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const commonIcons = [
    'food', 'cart', 'train', 'home', 'gamepad', 'cash',
    'gift', 'chart-line', 'school', 'medical-bag', 'car', 'airplane',
    'book', 'music', 'movie', 'coffee', 'bike', 'basketball'
  ];

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryIcon) return;

    const newCategory = {
      id: `custom_${Date.now()}`,
      label: newCategoryName.trim(),
      icon: newCategoryIcon,
    };

    const success = await addCategory(type, newCategory);
    if (success) {
      setNewCategoryName('');
      setNewCategoryIcon('');
      setShowAddDialog(false);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>管理{type === 'expense' ? '支出' : '收入'}类别</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            <List.Section>
              {categories[type].map((category) => (
                <List.Item
                  key={category.id}
                  title={category.label}
                  left={() => <Icon name={category.icon} size={24} style={styles.categoryIcon} />}
                  right={() => category.id.startsWith('custom_') ? (
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => deleteCategory(type, category.id)}
                    />
                  ) : null}
                />
              ))}
            </List.Section>
          </ScrollView>
        </Dialog.ScrollArea>

        <Dialog.Actions>
          <Button onPress={() => setShowAddDialog(true)}>添加自定义类别</Button>
          <Button onPress={onDismiss}>关闭</Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
        <Dialog.Title>添加自定义类别</Dialog.Title>
        <Dialog.Content>
          <View style={styles.iconSelector}>
            <Button
              mode="outlined"
              onPress={() => setShowIconPicker(true)}
              style={styles.iconButton}
              contentStyle={styles.iconButtonContent}
            >
              {newCategoryIcon ? (
                <Icon name={newCategoryIcon} size={32} />
              ) : (
                <View style={styles.iconPlaceholder}>
                  <Icon name="plus" size={24} />
                </View>
              )}
            </Button>
            <Text style={styles.iconButtonLabel}>
              选择图标
            </Text>
          </View>
          <TextInput
            label="类别名称"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => {
            setShowAddDialog(false);
            setNewCategoryName('');
            setNewCategoryIcon('');
          }}>取消</Button>
          <Button 
            onPress={handleAddCategory}
            disabled={!newCategoryName.trim() || !newCategoryIcon}
          >
            添加
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Dialog visible={showIconPicker} onDismiss={() => setShowIconPicker(false)}>
        <Dialog.Title>选择图标</Dialog.Title>
        <Dialog.Content>
          <ScrollView>
            <View style={styles.iconGrid}>
              {commonIcons.map((icon) => (
                <IconButton
                  key={icon}
                  icon={icon}
                  size={32}
                  onPress={() => {
                    setNewCategoryIcon(icon);
                    setShowIconPicker(false);
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  categoryIcon: {
    marginRight: 8,
  },
  input: {
    marginTop: 16,
  },
  iconSelector: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconButton: {
    width: 80,
    height: 80,
    margin: 0,
    marginBottom: 4,
  },
  iconButtonContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  iconButtonLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  iconPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
}); 