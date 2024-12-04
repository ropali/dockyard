import React, { createContext, useState, useContext, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

import { Network } from '../models/Network';


interface NetworkContextType {
    networks: Network[];
    loadNetworks: () => Promise<void>;
    selectedNetwork: Network | null;
    setSelectedNetwork: (network: Network | null) => void;
}

const NetworksContext = createContext<NetworkContextType | null>(null);

export function NetworksProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [networks, setNetworks] = useState<Network[]>([]);
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);

    const loadNetworks = useCallback(async (): Promise<void> => {
        const networkData = await invoke<any[]>('list_networks');
        const networkInstances = networkData.map(data => new Network(data));
        setNetworks(networkInstances);
    }, []);

    return (
        <NetworksContext.Provider value={{ networks, loadNetworks, selectedNetwork, setSelectedNetwork }}>
            {children}
        </NetworksContext.Provider>
    );
}

export function useNetworks(): NetworkContextType {
    const context = useContext(NetworksContext);
    if (!context) {
        throw new Error('useNetworks must be used within a NetworksProvider');
    }
    return context;
}