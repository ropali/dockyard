
import React from 'react'
import ContainersList from '../Containers/ContainersList'
import ContainerDetails from '../Containers/ContainerDetails'
import { useContainers } from '../../state/ContainerContext'

export default function ContainersScreen() {

    const { selectedContainer } = useContainers();

    return (
        <div className="h-full w-full mt-4 flex rounded-lg overflow-hidden ">
            <div className="w-1/3 bg-base-300 p-2 overflow-y-auto">
                <ContainersList />
            </div>
            <div className={`w-full bg-base-200 ml-1 overflow-hidden ${selectedContainer ? 'bg-base-100' : 'bg-base-400'}`}>
                <ContainerDetails />
            </div>
        </div>
    )
}
