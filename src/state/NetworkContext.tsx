import React, { createContext, useState, useContext, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

// Add Network interface definition
interface Network {
    id: string;
    name: string;
    // Add other properties as needed based on your backend's list_networks response
}

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
        const networks = await invoke<Network[]>('list_networks');
        setNetworks(networks);
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