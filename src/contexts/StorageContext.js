import React, { createContext, useContext } from 'react';
import { useStorage } from '../hooks/useStorage';

const StorageContext = createContext(null);

export const StorageProvider = ({ children }) => {
  const storage = useStorage();
  
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorageContext must be used within a StorageProvider');
  }
  return context;
}; 