import React, { useState, useEffect, useCallback } from 'react';
import { capitalizeFirstLetter } from '../../utils';
import { ALL_THEMES, DEFAULT_THEME, DOCKER_TERMINAL } from '../../constants';
import { useSettings } from '../../state/SettingsContext';
import { getVersion } from "@tauri-apps/api/app";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";
import { IconGithub } from "../../Icons/index.jsx";
import Swal from "sweetalert2";
import { invoke } from '@tauri-apps/api';
import { reteriveValue, storeValue } from "../../utils/storage.js";

const SettingsScreen = () => {
    const [theme, setTheme] = useState(DEFAULT_THEME);
    const [appVersion, setAppVersion] = useState(null);
    const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
    const { settings, setSettingsValue } = useSettings();
    const [terminal, setTerminal] = useState('');
    const [availableTerminals, setAvailableTerminals] = useState([]);

    const changeTheme = useCallback(async (newTheme) => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme.toLowerCase());
        await setSettingsValue("theme", newTheme.toLowerCase());
    }, [setSettingsValue]);

    const getAppVersion = useCallback(async () => {
        const version = await getVersion();
        setAppVersion(version);
    }, []);

    const loadDefaultTheme = useCallback(async () => {
        const storedTheme = settings?.theme;
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.setAttribute('data-theme', storedTheme);
        }
    }, [settings?.theme]);

    const updater = useCallback(async () => {
        setIsCheckingUpdate(true);
        try {
            const { shouldUpdate, manifest } = await checkUpdate();
            if (!shouldUpdate) {
                Swal.fire({
                    position: "bottom-right",
                    icon: "success",
                    title: "Your app is up to date.",
                    showConfirmButton: false,
                    timer: 1500,
                    toast: true
                });
                return;
            }
            console.log(`Installing update ${manifest?.version}, ${manifest?.date}, ${manifest?.body}`);
            await installUpdate();
            await relaunch();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
                footer: '<a target="_blank" href="https://github.com/ropali/dockyard/releases/latest">Visit Latest Release Page</a>'
            });
        } finally {
            setIsCheckingUpdate(false);
        }
    }, []);

    const loadTerminal = useCallback(async () => {
        try {
            const terminal = await invoke('get_terminal_command');
            setTerminal(terminal);
        } catch (error) {
            console.error("Failed to load terminal:", error);
        }
    }, []);

    const loadAvailableTerminals = useCallback(async () => {
        try {
            const terminals = await invoke('get_available_terminals');
            setAvailableTerminals(terminals);
        } catch (error) {
            console.error("Failed to load available terminals:", error);
        }
    }, []);

    const saveTerminal = useCallback(async (newTerminal) => {
        try {
            await invoke('set_terminal', { terminal: newTerminal });
            setTerminal(newTerminal);
        } catch (error) {
            console.error("Failed to save terminal:", error);
        }
    }, []);

    useEffect(() => {
        getAppVersion();
        loadDefaultTheme();
        loadTerminal();
        loadAvailableTerminals();
    }, [getAppVersion, loadDefaultTheme, loadTerminal, loadAvailableTerminals]);

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
                        <SettingsItem
                            label="Terminal Program"
                            type="select"
                            options={availableTerminals}
                            value={terminal}
                            onChange={saveTerminal}
                            storageKey={DOCKER_TERMINAL}
                        />
                    </SettingsGroup>
                    <SettingsGroup title="Updates">
                        <div className="mb-4">
                            {isCheckingUpdate ? (
                                <span>Checking for updates...</span>
                            ) : (
                                <button className="btn btn-info" onClick={updater}>Check for Updates</button>
                            )}
                        </div>
                    </SettingsGroup>
                </div>
                <footer className="mt-8 text-center text-sm text-gray-500 absolute bottom-0 left-0 right-0 py-5">
                    <div className="flex justify-center items-center space-x-4">
                        <span>Version: {appVersion}</span>
                        <a
                            href="https://github.com/ropali/dockyard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:text-blue-500"
                        >
                            <IconGithub className="size-6 text-base-content" />
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

const SettingsGroup = ({ title, children }) => (
    <div>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="bg-base-200 rounded-lg p-6">{children}</div>
    </div>
);

const SettingsItem = ({ label, type, options, placeholder, storageKey = null, value, onChange }) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        const loadStoredValue = async () => {
            if (storageKey) {
                const storedValue = await reteriveValue(storageKey);
                if (storedValue) {
                    setInputValue(storedValue);
                }
            }
        };
        loadStoredValue();
    }, [storageKey]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
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
                    <select
                        className="select w-full max-w-xs"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                    >
                        {options.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
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
                            {[...Array(5)].map((_, i) => <span key={i}>|</span>)}
                        </div>
                    </>
                );
            case 'button':
                return <button className="bg-red-500 text-white px-4 py-2 rounded">Restart Docker</button>;
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
