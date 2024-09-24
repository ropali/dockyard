import {IconCancel, IconEdit, IconTickSmall} from "../../Icons/index.jsx";
import React, {useState} from "react";

export default function ContainerNameWidget({ContainerName}) {

    const [isEditingName, setIsEditingName] = useState(false);
    const [newContainerName, setNewContainerName] = useState(ContainerName);

    const handleNameUpdate = () => {
        // Implement the logic to update the container name
        // For example:
        // invoke('update_container_name', { containerId: selectedContainer.Id, newName: newContainerName })
        //     .then(() => {
        //         refreshSelectContainer();
        //         setIsEditingName(false);
        //         toast.success('Container name updated successfully');
        //     })
        //     .catch((error) => {
        //         toast.error('Failed to update container name');
        //         console.error(error);
        //     });

        // For now, we'll just log the new name and reset the editing state
        console.log('New container name:', newContainerName);
        // setIsEditingName(false);
    };

    const startEditing = () => {
        console.log("---- Start editing container name");
        setNewContainerName(ContainerName);
        setIsEditingName(true);
    };


    const cancelEditing = () => {
        console.log('Cancelling name edit');
        setNewContainerName(ContainerName);
        setIsEditingName(false);
    };


    return (<>
            {isEditingName ? (<input
                    type="text"
                    value={ContainerName}
                    onChange={(e) => setNewContainerName(e.target.value)}
                    className="text-lg font-bold bg-transparent border-b border-base-content focus:outline-none"
                    autoFocus
                    onBlur={() => setTimeout(() => setIsEditingName(false), 500)} // Delay the blur to allow button clicks
                />) : (<h1 className="text-lg font-bold">{ContainerName}</h1>)}
            {!isEditingName && <button
                className="btn btn-ghost btn-xs ml-2 bg-transparent	"
                onClick={startEditing}
            >
                <IconEdit className="size-5"/>
            </button>}
            {isEditingName && (<div className="ml-1">
                    <button
                        className="btn btn-ghost btn-xs bg-transparent"
                        onClick={handleNameUpdate}
                    >
                        <IconTickSmall className="size-5"/>
                    </button>
                    <button
                        className="btn btn-ghost btn-xs bg-transparent"
                        onClick={cancelEditing}
                    >
                        <IconCancel className="size-5"/>
                    </button>
                </div>)}

        </>)
}