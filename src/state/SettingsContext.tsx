import React, {createContext, useContext, useEffect, useState} from 'react';
import {reteriveValue, storeValue} from '../utils/storage';


export interface SettingsContextType {
  settings: {[key: string]: any} | null;
  setSettingsValue: (key: string, value: any) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<{[key: string]: any} | null>(null);

  const loadSettings = async () => {
    setSettings(await reteriveValue("settings"));
  };

  const setSettingsValue = (key: string, value: any) => {
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
  const context = useContext(SettingsContext);
  if (context === null) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}