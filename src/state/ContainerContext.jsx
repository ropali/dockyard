import React, { createContext, useState, useContext, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

const ContainerContext = createContext();

export function ContainerProvider({ children }) {
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState()

  const loadContainers = useCallback(() => {
    invoke('fetch_containers').then((newContainers) => {
      setContainers(newContainers);
    });
  }, []);


  const filterContainers = useCallback((filter, searchQuery) => {

    console.log("===F", filter);
    let filtered = containers.filter(container => {
      const matchesSearchQuery = container.Names[0].toLowerCase().includes(searchQuery.toLowerCase());
      let matchesFilter;

      switch (filter.toLowerCase()) {
        case 'all':
          matchesFilter = true;
          break;
        case 'running':
          matchesFilter = container.Status.toLowerCase().includes('up');
          break;
        case 'stopped':
          matchesFilter = !container.Status.toLowerCase().includes('up');
          break;
        default:
          matchesFilter = true;
      }

      return matchesSearchQuery && matchesFilter;
    });
    console.log('---', filtered);
    setContainers(filtered)
  })

  return (
    <ContainerContext.Provider value={{ containers, selectedContainer, loadContainers, filterContainers, setSelectedContainer }}>
      {children}
    </ContainerContext.Provider>
  );
}

export function useContainers() {
  return useContext(ContainerContext);
}