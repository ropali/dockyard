import React, { createContext, useState, useContext, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

const VolumesContext = createContext();

export function VolumesProvider({ children }) {
    const [volumes, setVolumes] = useState([]);
    const [selectedVolume, setSelectedVolume] = useState(null)

    const loadVolumes = useCallback(() => {
        invoke('list_volumes').then((volumes) => {
            setVolumes(volumes);
        });

    }, []);



    return (
        <VolumesContext.Provider value={{ volumes, loadVolumes, selectedVolume, setSelectedVolume }}>
            {children}
        </VolumesContext.Provider>
    );
}

export function useVolumes() {
    return useContext(VolumesContext);
}