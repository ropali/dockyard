import {IconCancel, IconEdit, IconTick} from "../../Icons/index";
import React, {useState} from "react";
import {invoke} from "@tauri-apps/api";
import {useContainers} from "../../state/ContainerContext";
import toast from "../../utils/toast";



export default function ContainerNameWidget(): JSX.Element {
    const {selectedContainer, refreshSelectedContainer} = useContainers();

    const [isEditingName, setIsEditingName] = useState(false);
    const [newContainerName, setNewContainerName] = useState<string>(
        selectedContainer?.getName() ?? ''
    );

    const handleNameUpdate = (): void => {

        // If the new name is the same as the old name, do nothing
        if (newContainerName === selectedContainer?.getName()) {
            setIsEditingName(false);
            return;
        }

        invoke('rename_container', {
            name: selectedContainer?.getName(),
            newName: newContainerName
        })
            .then((res: unknown) => {
                refreshSelectedContainer();
                setIsEditingName(false);
                toast.success(res as string);
            })
            .catch((error: unknown) => {
                toast.error('Failed to update container name');
                console.error(error);
            })
            .finally(() => setIsEditingName(false));
    };

    const startEditing = (): void => {
        setNewContainerName(selectedContainer?.getName() ?? '');
        setIsEditingName(true);
    };

    const cancelEditing = (): void => {
        setNewContainerName(selectedContainer?.getName() ?? '');
        setIsEditingName(false);
    };

    return (
        <div className="flex items-center space-x-2">
            {isEditingName ? (
                <input
                    type="text"
                    value={newContainerName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewContainerName(e.target.value)}
                    className="text-lg font-bold bg-transparent border-b border-gray-300 focus:outline-none focus:border-gray-600"
                    autoFocus
                    onBlur={() => setTimeout(() => setIsEditingName(false), 100)}
                />
            ) : (
                <h1 className="text-lg font-bold">
                    {selectedContainer?.getName()}
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