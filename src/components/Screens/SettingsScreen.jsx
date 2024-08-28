import React, { useState, useEffect } from 'react';
import { capitalizeFirstLetter } from '../../utils';

import { reteriveValue, storeValue } from '../../utils/storage';
import { ALL_THEMES, DEFAULT_THEME, DOCKER_TERMINAL } from '../../constants';
import { useSettings } from '../../state/SettingsContext';

const SettingsScreen = () => {

  const [theme, setTheme] = useState(DEFAULT_THEME);

  const { settings, setSettingsValue } = useSettings();

  const changeTheme = async (newTheme) => {
    setTheme(newTheme);

    document.documentElement.setAttribute('data-theme', newTheme.toLowerCase());

    await setSettingsValue("theme", newTheme.toLowerCase());

  };

  const loadDefaultTheme = async () => {
    console.log("--S", settings);
    
    const storedTheme = settings?.theme;

    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  }

  useEffect(() => {
    loadDefaultTheme()

  }, [])



  return (
    <div className="bg-base-100 p-8 h-screen w-full flex justify-center">
      <div className="max-w-5xl w-full max-h-full overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="grid grid-cols-2 gap-8">
          <SettingsGroup title="General">
            <div className="mb-4 flex items-center">
              <label className="font-medium w-1/3">Theme</label>
              <div className="w-2/3">

                <select
                  className="select w-full max-w-xs"
                  value={theme}
                  onChange={(e) => changeTheme(e.target.value)}
                >
                  {ALL_THEMES.map(option => (
                    <option key={option} value={option}>
                      {capitalizeFirstLetter(option)}
                    </option>
                  ))}
                </select>
              </div>
            </div>


          </SettingsGroup>

          <SettingsGroup title="Docker">
            <SettingsItem label="Terminal Program" type="input" placeholder="gnome-terminal" storageKey={DOCKER_TERMINAL} />
          </SettingsGroup>


          <SettingsGroup title="Updates">
            <div className="mb-4">
              <button className="btn btn-info">Check for Updates</button>
            </div>
          </SettingsGroup>


        </div>
      </div>
    </div>
  );
};

const SettingsGroup = ({ title, children }) => {
  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="bg-base-200 rounded-lg p-6">
        {children}
      </div>
    </div>
  );
};


const SettingsItem = ({ label, type, options, placeholder, min, max, unit, storageKey = null }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = async () => {
    if (storageKey) {
      await storeValue(storageKey, inputValue);
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select className="select w-full max-w-xs">
            {options.map(option => <option key={option}>{option}</option>)}
          </select>
        );
      case 'toggle':
        return <input type="checkbox" className="checkbox" />;
      case 'input':
        return (
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        );
      case 'range':
        return (
          <>
            <input type="range" min={min} max={max} value="25" className="range" step={unit} />
            <div className="flex w-full justify-between px-2 text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
          </>
        );
      case 'button':
        return (
          <button className="bg-red-500 text-white px-4 py-2 rounded">Restart Docker</button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-4 flex items-center">
      <label className="font-medium w-1/3">{label}</label>
      <div className="w-2/3">{renderInput()}</div>
    </div>
  );
};


export default SettingsScreen;
