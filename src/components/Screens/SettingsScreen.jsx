import React, { useState, useEffect } from 'react';
import { capitalizeFirstLetter } from '../../utils';

const SettingsScreen = () => {

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme.toLowerCase());
    document.documentElement.setAttribute('data-theme', newTheme.toLowerCase());
  };

  useEffect(() => {

    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }

  }, [])


  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ]

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
                  {themes.map(option => (
                    <option key={option} value={option}>
                      {capitalizeFirstLetter(option)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <SettingsItem label="Language" type="select" options={['English', 'Spanish', 'French']} />
            <SettingsItem label="Auto-start on login" type="toggle" />
          </SettingsGroup>

          <SettingsGroup title="Docker">
            <SettingsItem label="Docker path" type="input" placeholder="/usr/local/bin/docker" />
            <SettingsItem label="Default network" type="select" options={['bridge', 'host', 'none']} />
            <SettingsItem label="Enable experimental features" type="toggle" />
          </SettingsGroup>


          <SettingsGroup title="Security">
            <SettingsItem label="TLS Verification" type="toggle" />
            <SettingsItem label="Certificates Path" type="input" placeholder="/path/to/certs" />
          </SettingsGroup>

          <SettingsGroup title="Proxies">
            <SettingsItem label="HTTP Proxy" type="input" placeholder="http://proxy.example.com:8080" />
            <SettingsItem label="HTTPS Proxy" type="input" placeholder="https://proxy.example.com:8443" />
            <SettingsItem label="No Proxy" type="input" placeholder="localhost,127.0.0.1" />
          </SettingsGroup>

          <SettingsGroup title="Volumes">
            <SettingsItem label="Default Volume Path" type="input" placeholder="/var/lib/docker/volumes" />
            <SettingsItem label="Prune Volumes on Exit" type="toggle" />
          </SettingsGroup>

          <SettingsGroup title="Networking">
            <SettingsItem label="Default DNS Servers" type="input" placeholder="8.8.8.8, 8.8.4.4" />
            <SettingsItem label="Host-to-Container Networking" type="toggle" />
          </SettingsGroup>

          <SettingsGroup title="Updates">
            <SettingsItem label="Auto-Update" type="toggle" />
            <div className="mb-4">
              <button className="btn btn-info">Check for Updates</button>
            </div>
          </SettingsGroup>

          <SettingsGroup title="Advanced">
            <SettingsItem label="Docker Daemon Options" type="input" placeholder="--experimental --log-level=debug" />
            <button className="btn btn-error">Restart Docker</button>
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

const SettingsItem = ({ label, type, options, placeholder, min, max, unit }) => {
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
        return <input type="text" className="input input-bordered w-full max-w-xs" placeholder={placeholder} />;
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
