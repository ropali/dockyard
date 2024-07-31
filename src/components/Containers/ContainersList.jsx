import React, { useState, useEffect } from 'react'
import ContainersTopBar from "./ContainersTopBar"
import Card from '../Card'
import { useContainers } from '../../state/ContainerContext'


function ContainersList() {

    const { containers, loadContainers, selectedContainer ,setSelectedContainer } = useContainers();

    const [searchQuery, setSearchQuery] = useState('');

    const [containerFilter, setContainerFilter] = useState("all");

    const filteredContainers = containers.filter(container => {
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

        loadContainers()

    }, [containers])



    return (
        <div className="h-full flex flex-col">
            <ContainersTopBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onFilterChange={(value) => setContainerFilter(value)}
            />
            <div className="flex-1 overflow-y-auto mt-2">
                {filteredContainers.map(container => (
                    <Card
                        key={container.Id}
                        container={container}
                        onClick={() => setSelectedContainer(container)}
                    />
                ))}
            </div>

        </div>
    )
}

export default ContainersList;
