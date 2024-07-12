

import React from 'react'
import ContainersTopBar from "./ContainersTopBar"
import Card from '../Card'

function ContainersList({ containers, onContainerClick, searchQuery, setSearchQuery, showAll, setShowAll }) {
    return (
        <div>
            <ContainersTopBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showAll={showAll}
                setShowAll={setShowAll}
            />
            {containers.map(container => (
                <Card
                    key={container.Id}
                    container={container}
                    onClick={() => onContainerClick(container)}
                />
            ))}
        </div>
    )
}

export default ContainersList