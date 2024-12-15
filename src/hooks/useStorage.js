import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../constants/categories';

const STORAGE_KEY = 'ACCOUNT_RECORDS';
const CATEGORIES_KEY = 'CUSTOM_CATEGORIES';

// 添加一些测试数据
const TEST_RECORDS = [
  {
    id: '1',
    type: 'expense',
    amount: 100,
    category: 'food',
    note: '午餐',
    date: new Date().toISOString()
  },
  {
    id: '2',
    type: 'income',
    amount: 5000,
    category: 'salary',
    note: '工资',
    date: new Date().toISOString()
  }
];

export const useStorage = () => {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedRecords, savedCategories] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(CATEGORIES_KEY)
      ]);

      // 如果没有保存的记录，使用测试数据
      if (!savedRecords) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(TEST_RECORDS));
        setRecords(TEST_RECORDS);
      } else {
        setRecords(JSON.parse(savedRecords));
      }
      
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.warn('加载数据失败:', error);
      // 使用测试数据作为默认值
      setRecords(TEST_RECORDS);
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  const saveRecord = async (newRecord) => {
    try {
      const updatedRecords = [...records, { ...newRecord, id: Date.now().toString() }];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
      setRecords(updatedRecords);
      return true;
    } catch (error) {
      console.error('保存记录失败:', error);
      return false;
    }
  };

  const deleteRecord = async (recordId) => {
    try {
      const updatedRecords = records.filter(record => record.id !== recordId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
      setRecords(updatedRecords);
      return true;
    } catch (error) {
      console.error('删除记录失败:', error);
      return false;
    }
  };

  const addCategory = async (type, newCategory) => {
    try {
      const updatedCategories = {
        ...categories,
        [type]: [...categories[type], newCategory]
      };
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      return true;
    } catch (error) {
      console.error('添加分类失败:', error);
      return false;
    }
  };

  const deleteCategory = async (type, categoryId) => {
    try {
      const updatedCategories = {
        ...categories,
        [type]: categories[type].filter(cat => cat.id !== categoryId)
      };
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      return true;
    } catch (error) {
      console.error('删除分类失败:', error);
      return false;
    }
  };

  return {
    records,
    categories,
    loading,
    saveRecord,
    deleteRecord,
    addCategory,
    deleteCategory,
  };
}; 