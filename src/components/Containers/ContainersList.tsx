import React, { useEffect, useState } from 'react';
import ContainersTopBar from './ContainersTopBar';
import ContainerCard from './ContainerCard';
import { useContainers } from '../../state/ContainerContext';

const ContainersList = () => {
  const { containers, loadContainers, selectedContainer, setSelectedContainer } = useContainers();

  const [searchQuery, setSearchQuery] = useState('');
  const [containerFilter, setContainerFilter] = useState('all');

  const filteredContainers = containers.filter((container) => {
    const matchesSearchQuery = container.Names[0].toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter;

    switch (containerFilter.toLowerCase()) {
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

  useEffect(() => {
    loadContainers();
    const interval = setInterval(() => {
      loadContainers();
    }, 3000);
    return () => clearInterval(interval);
  }, [loadContainers]);

  return (
    <div className="h-full flex flex-col">
      <ContainersTopBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterChange={(value) => setContainerFilter(value)}
      />
      <div className="flex-1 overflow-y-auto mt-2">
        {filteredContainers.map((container) => (
          <ContainerCard
            key={container.Id}
            container={container}
            onClick={() => setSelectedContainer(container)}
            isSelected={selectedContainer != null && selectedContainer.Id === container.Id}
          />
        ))}
      </div>
    </div>
  );
};

export default ContainersList;
