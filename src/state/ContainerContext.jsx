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

    function refreshSelectedContainer() {
        invoke('get_container', {cId: selectedContainer.Id}).then((res) => {

            if (res) {
                setSelectedContainer(res)
            }

        })
    }


    return (
        <ContainerContext.Provider
            value={{containers, selectedContainer, loadContainers, setSelectedContainer, refreshSelectedContainer}}>
            {children}
        </ContainerContext.Provider>
    );
}

export function useContainers() {
    return useContext(ContainerContext);
}