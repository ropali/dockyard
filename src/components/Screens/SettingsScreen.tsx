import React, {useCallback, useEffect, useState} from 'react';
import {capitalizeFirstLetter} from '../../utils';
import {ALL_THEMES, DEFAULT_THEME, DOCKER_TERMINAL, Theme} from '../../constants';
import {useSettings} from '../../state/SettingsContext';
import {getVersion} from '@tauri-apps/api/app';
import {checkUpdate, installUpdate} from '@tauri-apps/api/updater';
import {relaunch} from '@tauri-apps/api/process';
import {IconGithub} from '../../Icons/index';
import Swal from 'sweetalert2';
import {invoke} from '@tauri-apps/api';
import {reteriveValue, storeValue} from '../../utils/storage';
import toast from '../../utils/toast';

interface SettingsItemProps {
    label: string;
    type: 'select' | 'toggle' | 'input' | 'range' | 'button';
    options?: string[];
    placeholder?: string;
    storageKey?: string;
    value: string;
    onChange: (value: string) => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
    label,
    type,
    options,
    placeholder,
    storageKey,
    value,
    onChange,
}) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        const loadStoredValue = async () => {
            if (storageKey) {
                const storedValue = await reteriveValue(storageKey);
                if (storedValue) {
                    setInputValue(storedValue as string);
                }
            }
        };
        loadStoredValue();
    }, [storageKey]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newValue = e.target.value;
        console.log('SettingsItem input change:', { 
            type, 
            value: newValue, 
            options: options || [] 
        });
        setInputValue(newValue);
        
        // Add type guard to ensure we're passing a string
        if (typeof newValue === 'string') {
            onChange(newValue);
        } else {
            console.error('Invalid value type for onChange:', typeof newValue);
        }
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
                        {options?.map(option => (
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
                        <input type="range" min={0} max={100} value={25} className="range" step={1} />
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

interface SettingsGroupProps {
    title: string;
    children: React.ReactNode;
}

const SettingsGroup: React.FC<SettingsGroupProps> = ({ title, children }) => (
    <div>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="bg-base-200 rounded-lg p-6">{children}</div>
    </div>
);

const SettingsScreen = () => {
    const [theme, setTheme] = useState(DEFAULT_THEME);
    const [appVersion, setAppVersion] = useState<string | null>(null);
    const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
    const { settings, setSettingsValue } = useSettings();
    const [terminal, setTerminal] = useState('');
    const [availableTerminals, setAvailableTerminals] = useState<string[]>([]);

    const changeTheme = useCallback(async (newTheme: string) => {
        setTheme(newTheme as Theme);
        document.documentElement.setAttribute('data-theme', newTheme.toLowerCase());
        await setSettingsValue('theme', newTheme.toLowerCase());
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
            const {shouldUpdate} = await checkUpdate();
            if (!shouldUpdate) {
                toast.success('Your app is up to date.');
                return;
            }
            await installUpdate();
            await relaunch();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message ? error.message : 'Failed to automatically update. Please install the update manually.',
                footer: '<a target="_blank" href="https://github.com/ropali/dockyard/releases/latest">Visit Latest Release Page</a>',
                background: 'oklch(var(--b2))',
                customClass: {
                    popup: 'text-base-content',
                },
            });
        } finally {
            setIsCheckingUpdate(false);
        }
    }, []);

    const loadTerminal = useCallback(async () => {
        try {
            const terminal = await reteriveValue(DOCKER_TERMINAL);
            setTerminal(terminal as string);
        } catch (error) {
            console.error('Failed to load terminal:', error);
        }
    }, []);

    const loadAvailableTerminals = useCallback(async () => {
        try {
            const terminals = await invoke<string[]>('get_available_terminals');
            setAvailableTerminals(terminals);
        } catch (error) {
            console.error('Failed to load available terminals:', error);
        }
    }, []);

    const saveTerminal = useCallback(async (newTerminal: string) => {
        try {
            console.log('Saving terminal:', newTerminal);
            await storeValue(DOCKER_TERMINAL, newTerminal);
            setTerminal(newTerminal);
        } catch (error) {
            console.error('Failed to save terminal:', error);
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
                                <button className="btn btn-info" onClick={updater}>
                                    Check for Updates
                                </button>
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

export default SettingsScreen;
