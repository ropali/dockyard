import React, { useEffect, useState, useMemo } from 'react';
import ContainersTopBar from './ContainersTopBar';
import ContainerCard from './ContainerCard';
import { useContainers } from '../../state/ContainerContext';

enum ContainerFilterType {
    All = 'All',
    Running = 'Running',
    Stopped = 'Stopped'
}

const ContainersList = () => {
    const { containers, loadContainers, selectedContainer, setSelectedContainer, isLoading, error } = useContainers();
    const [searchQuery, setSearchQuery] = useState('');
    const [containerFilter, setContainerFilter] = useState<ContainerFilterType>(ContainerFilterType.All);

    const filteredContainers = useMemo(() => {
        return containers.filter((container) => {
            const matchesSearchQuery = container.getName().toLowerCase().includes(searchQuery.toLowerCase());
            let matchesFilter = true;
            switch (containerFilter) {
                case ContainerFilterType.Running:
                    matchesFilter = container.isRunning();
                    break;
                case ContainerFilterType.Stopped:
                    matchesFilter = !container.isRunning();
                    break;
            }

            return matchesSearchQuery && matchesFilter;
        });
    }, [containers, searchQuery, containerFilter]);

    useEffect(() => {
        loadContainers();
        const interval = setInterval(loadContainers, 3000);
        return () => clearInterval(interval);
    }, [loadContainers]);

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-error">
                <p>Error loading containers: {error}</p>
                <button className="btn btn-primary mt-4" onClick={loadContainers}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <ContainersTopBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onFilterChange={(value) => setContainerFilter(value as ContainerFilterType)}
            />
            <div className="flex-1 overflow-y-auto mt-2">
                {isLoading && containers.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="loading loading-spinner loading-lg"></div>
                    </div>
                ) : filteredContainers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-base-content/60">
                        <p>No containers found</p>
                        {searchQuery && <p className="mt-2">Try adjusting your search or filter</p>}
                    </div>
                ) : (
                    filteredContainers.map((container) => (
                        <ContainerCard
                            key={container.Id}
                            container={container}
                            onClick={() => setSelectedContainer(container)}
                            isSelected={selectedContainer?.Id === container.Id}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ContainersList;
