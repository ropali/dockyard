import React from 'react'
import ContainersTopBar from "./ContainersTopBar"
import Card from '../Card'

function ContainersList({ containers, onContainerClick, searchQuery, setSearchQuery, showAll, setShowAll }) {
    return (
        <div className="h-full flex flex-col">
            <ContainersTopBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showAll={showAll}
                setShowAll={setShowAll}
            />
            <div className="flex-1 overflow-y-auto mt-2">
                {containers.map(container => (
                    <Card
                        key={container.Id}
                        container={container}
                        onClick={() => onContainerClick(container)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ContainersList;
