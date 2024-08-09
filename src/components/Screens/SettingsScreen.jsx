import React from 'react';

const SettingsScreen = () => {
  return (
    <div className="bg-gray-100 p-8 h-screen w-full flex justify-center">
      <div className="max-w-5xl w-full max-h-full overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="grid grid-cols-2 gap-8">
          <SettingsGroup title="General">
            <SettingsItem label="Theme" type="select" options={['Light', 'Dark', 'System']} />
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
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Check for Updates</button>
            </div>
          </SettingsGroup>

          <SettingsGroup title="Advanced">
            <SettingsItem label="Docker Daemon Options" type="input" placeholder="--experimental --log-level=debug" />
            <SettingsItem label="Restart Docker" type="button" />
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
      <div className="bg-gray-200 rounded-lg p-6">
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
          <select className="w-full p-2 bg-white rounded border border-gray-300">
            {options.map(option => <option key={option}>{option}</option>)}
          </select>
        );
      case 'toggle':
        return <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />;
      case 'input':
        return <input type="text" className="w-full p-2 bg-white rounded border border-gray-300" placeholder={placeholder} />;
      case 'range':
        return (
          <div className="flex items-center">
            <input type="range" min={min} max={max} className="w-full mr-2" />
            <span>{unit}</span>
          </div>
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
