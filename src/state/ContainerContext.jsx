import React, {createContext, useCallback, useContext, useState} from 'react';
import {invoke} from '@tauri-apps/api/tauri';

const ContainerContext = createContext();

export function ContainerProvider({children}) {
    const [containers, setContainers] = useState([]);
    const [selectedContainer, setSelectedContainer] = useState(null)

    const loadContainers = useCallback(() => {
        invoke('fetch_containers').then((newContainers) => {
            setContainers(newContainers);
        });
    }, []);


    return (
        <ContainerContext.Provider value={{containers, selectedContainer, loadContainers, setSelectedContainer}}>
            {children}
        </ContainerContext.Provider>
    );
}

export function useContainers() {
    return useContext(ContainerContext);
}