import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { reteriveValue, storeValue } from '../utils/storage';
reteriveValue

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  const loadSettings = async () => {
    setSettings(await reteriveValue("settings"));
  };

  const setSettingsValue = (key, value) => {
    let updatedSettings = {...settings, [key]: value}
    setSettings(updatedSettings)
    storeValue("settings", updatedSettings)
  }

  useEffect(() => {
    loadSettings();
    
  }, [])
  
  

  return (
    <SettingsContext.Provider value={{ settings, setSettingsValue }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}