import React, { createContext, useCallback, useContext, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Container } from '../models/Container';


export type ContainerContextType = {
    containers: Container[];
    selectedContainer: Container | null;
    loadContainers: () => void;
    setSelectedContainer: (container: Container | null) => void;
    refreshSelectedContainer: () => void;
};

const ContainerContext = createContext<ContainerContextType | null>(null);


export function ContainerProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [containers, setContainers] = useState<Container[]>([]);
    const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);


    const loadContainers = useCallback(() => {
        invoke<{ [id: string]: any }[]>('fetch_containers').then((newContainers) => {
            setContainers(
                newContainers.map((container) => new Container(container))
            );
        });
    }, []);


    function refreshSelectedContainer() {
        if (selectedContainer === null) {
            return;
        }

        invoke<{ [id: string]: any }>('get_container', { cId: selectedContainer.Id }).then((res) => {
            if (res) {
                setSelectedContainer(new Container(res));
            }
        });
    }

    return (
        <ContainerContext.Provider
            value={{
                containers,
                selectedContainer,
                loadContainers,
                setSelectedContainer,
                refreshSelectedContainer,
            }}
        >
            {children}
        </ContainerContext.Provider>
    );
}

/**
 * useContainers is a React hook that provides the ContainerContext.
 * It throws an error if the hook is used outside of a ContainerProvider.
 */
export function useContainers(): ContainerContextType {
    const context = useContext(ContainerContext);

    if (context === null) {
        throw new Error('useContainers must be used within a ContainerProvider');
    }

    return context;
}