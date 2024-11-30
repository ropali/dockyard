import React, { createContext, useCallback, useContext, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

export type ContainerSummary = {
    Id: string;
    Name: string;
    Image: string;
    Status: string;
    State: string;
};

export type ContainerContextType = {
    containers: ContainerSummary[];
    selectedContainer: ContainerSummary | null;
    loadContainers: () => void;
    setSelectedContainer: (container: ContainerSummary | null) => void;
    refreshSelectedContainer: () => void;
};

const ContainerContext = createContext<ContainerContextType | null>(null);

export function ContainerProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [containers, setContainers] = useState<ContainerSummary[]>([]);
    const [selectedContainer, setSelectedContainer] = useState<ContainerSummary | null>(null);

    const loadContainers = useCallback(() => {
        invoke<ContainerSummary[]>('fetch_containers').then((newContainers) => {
            setContainers(newContainers);
        });
    }, []);

    function refreshSelectedContainer() {
        if (selectedContainer === null) {
            return;
        }

        invoke<ContainerSummary>('get_container', { cId: selectedContainer.Id }).then((res) => {
            if (res) {
                setSelectedContainer(res);
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

export function useContainers(): ContainerContextType {
    const context = useContext(ContainerContext);

    if (context === null) {
        throw new Error('useContainers must be used within a ContainerProvider');
    }

    return context;
}