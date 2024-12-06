import React, { createContext, useCallback, useContext, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Container } from '../models/Container';

/**
 * ContainerContextType is the type definition for the ContainerContext.
 * It includes the containers, the selected container, functions to load and refresh containers,
 * as well as the loading state and any error messages.
 */
export type ContainerContextType = {
    containers: Container[];
    selectedContainer: Container | null;
    loadContainers: () => void;
    setSelectedContainer: (container: Container | null) => void;
    refreshSelectedContainer: () => void;
    isLoading: boolean;
    error: string | null;
};

const ContainerContext = createContext<ContainerContextType | null>(null);

/**
 * ContainerProvider is a React context provider that manages the state of containers.
 * It provides the containers, the selected container, functions to load and refresh containers,
 * as well as the loading state and any error messages.
 */
export function ContainerProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [containers, setContainers] = useState<Container[]>([]);
    const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * loadContainers is a function that loads the containers from the backend.
     * It sets the loading state to true, resets any error messages, and then invokes the 'fetch_containers' command.
     * If the invocation is successful, it sets the containers state with the new containers.
     * If the invocation fails, it sets the error state with the error message.
     * Finally, it sets the loading state to false.
     */
    const loadContainers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const newContainers = await invoke<{ [id: string]: any }[]>('fetch_containers');
            setContainers(newContainers.map((container) => new Container(container)));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load containers');
            console.error('Error loading containers:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * refreshSelectedContainer is a function that refreshes the selected container from the backend.
     * It sets the loading state to true, resets any error messages, and then invokes the 'get_container' command.
     * If the invocation is successful and a container is returned, it sets the selected container state with the new container.
     * If the invocation fails, it sets the error state with the error message.
     * Finally, it sets the loading state to false.
     */
    const refreshSelectedContainer = useCallback(async () => {
        if (selectedContainer === null) return;

        try {
            setIsLoading(true);
            setError(null);
            const res = await invoke<{ [id: string]: string }>('get_container', { cId: selectedContainer.Id });
            if (res) {
                setSelectedContainer(new Container(res));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to refresh container');
            console.error('Error refreshing container:', err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedContainer]);

    return (
        <ContainerContext.Provider
            value={{
                containers,
                selectedContainer,
                loadContainers,
                setSelectedContainer,
                refreshSelectedContainer,
                isLoading,
                error,
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