import {IconCancel, IconEdit, IconTick} from "../../Icons/index.tsx";
import React, {useState} from "react";
import {invoke} from "@tauri-apps/api";
import {useContainers} from "../../state/ContainerContext.tsx";
import toast from "../../utils/toast.ts";

export default function ContainerNameWidget() {
    const {selectedContainer, refreshSelectedContainer} = useContainers();

    const [isEditingName, setIsEditingName] = useState(false);
    const [newContainerName, setNewContainerName] = useState(
        selectedContainer.Names[0].replace("/", "")
    );

    const handleNameUpdate = () => {

        // If the new name is the same as the old name, do nothing
        if (newContainerName === selectedContainer.Names[0].replace("/", "")) {
            setIsEditingName(false);
            return;
        }

        invoke('rename_container', {
            name: selectedContainer.Names[0].replace("/", ""),
            newName: newContainerName
        })
            .then((res) => {
                refreshSelectedContainer();
                setIsEditingName(false);
                toast.success(res);
            })
            .catch((error) => {
                toast.error('Failed to update container name');
                console.error(error);
            })
            .finally(() => setIsEditingName(false));
    };

    const startEditing = () => {
        setNewContainerName(selectedContainer.Names[0].replace("/", ""));
        setIsEditingName(true);
    };

    const cancelEditing = () => {
        setNewContainerName(selectedContainer.Names[0].replace("/", ""));
        setIsEditingName(false);
    };

    return (
        <div className="flex items-center space-x-2">
            {isEditingName ? (
                <input
                    type="text"
                    value={newContainerName}
                    onChange={(e) => setNewContainerName(e.target.value)}
                    className="text-lg font-bold bg-transparent border-b border-gray-300 focus:outline-none focus:border-gray-600"
                    autoFocus
                    onBlur={() => setTimeout(() => setIsEditingName(false), 100)}
                />
            ) : (
                <h1 className="text-lg font-bold">
                    {selectedContainer.Names[0].replace("/", "")}
                </h1>
            )}
            {!isEditingName && (
                <button
                    className="p-1 text-gray-600 hover:text-base-content transition-colors duration-200 tooltip tooltip-bottom hover:tooltip-open"
                    data-tip="Edit Name"
                    onClick={startEditing}
                >
                    <IconEdit className="w-4 h-4"/>
                </button>
            )}
            {isEditingName && (
                <div className="flex items-center space-x-2">
                    <button
                        className="p-1 text-gray-600 hover:text-green-600 transition-colors duration-200 tooltip tooltip-bottom hover:tooltip-open"
                        data-tip="Save"
                        onClick={handleNameUpdate}
                    >
                        <IconTick className="w-4 h-4"/>
                    </button>
                    <button
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors duration-200 tooltip tooltip-bottom hover:tooltip-open"
                        data-tip="Cancel"
                        onClick={cancelEditing}
                    >
                        <IconCancel className="w-4 h-4"/>
                    </button>
                </div>
            )}
        </div>
    );
}