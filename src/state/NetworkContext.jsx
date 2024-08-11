import React, { createContext, useState, useContext, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

const NetworksContext = createContext();

export function NetworksProvider({ children }) {
    const [networks, setNetworks] = useState([]);
    const [selectedNetwork, setSelectedNetwork] = useState(null)

    const loadNetworks = useCallback(() => {
        invoke('list_networks').then((networks) => {
            setNetworks(networks);
        });

    }, []);



    return (
        <NetworksContext.Provider value={{ networks, loadNetworks, selectedNetwork, setSelectedNetwork }}>
            {children}
        </NetworksContext.Provider>
    );
}

export function useNetworks() {
    return useContext(NetworksContext);
}