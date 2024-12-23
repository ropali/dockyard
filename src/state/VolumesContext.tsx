import React, {createContext, useCallback, useContext, useState} from 'react';
import {invoke} from '@tauri-apps/api/tauri';
import {Volume} from '../models/Volume';

interface VolumesContextType {
    volumes: Volume[];
    loadVolumes: () => Promise<void>;
    selectedVolume: Volume | null;
    setSelectedVolume: (volume: Volume | null) => void;
}

const VolumesContext = createContext<VolumesContextType | null>(null);

export function VolumesProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [volumes, setVolumes] = useState<Volume[]>([]);
    const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);

    const loadVolumes = useCallback(async (): Promise<void> => {
        const data = await invoke<Volume[]>('list_volumes');
        // @ts-ignore
        setVolumes(data["Volumes"] || []);
    }, []);

    return (
        <VolumesContext.Provider value={{ volumes, loadVolumes, selectedVolume, setSelectedVolume }}>
            {children}
        </VolumesContext.Provider>
    );
}

export function useVolumes(): VolumesContextType {
    const context = useContext(VolumesContext);
    if (!context) {
        throw new Error('useVolumes must be used within a VolumesProvider');
    }
    return context;
}