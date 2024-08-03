
import React from 'react'
import ContainersList from '../Containers/ContainersList'
import ContainerDetails from '../Containers/ContainerDetails'
import { useContainers } from '../../state/ContainerContext'

export default function ContainersScreen() {

    const { selectedContainer } = useContainers();

    return (
        <div className="h-full w-full mt-4 flex rounded-lg overflow-hidden">
            <div className="w-1/3 bg-gray-200 p-2 overflow-y-auto">
                <ContainersList />
            </div>
            <div className={`w-full bg-gray-200 ml-1 overflow-hidden ${selectedContainer ? 'bg-white' : 'bg-gray-200'}`}>
                <ContainerDetails />
            </div>
        </div>
    )
}
