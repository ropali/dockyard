import react, { useState } from "react";
import { useVolumes } from "../../state/VolumesContext"
import { IconCopy, IconBxTrashAlt } from "../../Icons";
import JSONPretty from "react-json-pretty";
import LogoScreen from "../LogoScreen";
import { copyToClipboard } from "../../utils";
import VolumeAttachedContainers from "./VolumeAttachedContainers";


export default function VolumeDetails() {
    const { selectedVolume, setSelectedVolume, loadVolumes } = useVolumes();
    const [activeTab, setActiveTab] = useState('INSPECT');

    if (selectedVolume == null) {
        return <LogoScreen message={"Select a volume to see more details"} />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'INSPECT':
                return <JSONPretty id="json-pretty" data={selectedVolume}></JSONPretty>;
            case 'CONTAINERS':
                return <VolumeAttachedContainers />;
            default:
                return null;
        }
    };

    return (
        <div className="dark p-4 bg-white shadow-sm rounded-md h-full overflow-x-hidden flex flex-col">
            <div className="flex items-center mb-4">
                <h1 className="text-lg font-bold mr-2">{selectedVolume.Name}</h1>
                <button
                    className="hover:bg-gray-200 rounded"
                    onClick={() => copyToClipboard(selectedVolume.Name)}
                    title="Copy Name"
                >
                    <IconCopy className="w-4 h-4 text-gray-600" />
                </button>
                
            </div>
            

            <div className="flex items-center">
                <p className="text-sm text-gray-600 mr-2">Created At: {selectedVolume.CreatedAt}</p>
                
            </div>
            <div className="flex items-center mb-4">
                <p className="text-sm text-gray-600 mr-2">Driver: {selectedVolume.Driver}</p>
                
            </div>

            <div className="flex mb-4">
                {/* <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Delete">
                    <button className="btn btn-square btn-sm btn-error mr-3" onClick={() => {}}>
                        <IconBxTrashAlt className="size-5" />
                    </button>
                </div> */}
            </div>
            <div className="flex mb-4 border-b">
                <button className={`mr-4 pb-2 ${activeTab === 'INSPECT' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('INSPECT')}>INSPECT</button>
                <button className={`mr-4 pb-2 ${activeTab === 'CONTAINERS' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('CONTAINERS')}>CONTAINERS</button>

            </div>
            <div className="flex-1 overflow-auto text-black p-2 rounded">
                {renderContent()}
            </div>

        </div>
    );
}