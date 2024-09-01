import React, {useEffect, useState} from "react";
import {IconCopy} from "../../Icons";
import LogoScreen from "../LogoScreen";
import {copyToClipboard} from "../../utils";
import {useNetworks} from "../../state/NetworkContext";
import {invoke} from "@tauri-apps/api";
import JSONSyntaxHighlighter from "../JSONSyntaxHighlighter.jsx";


export default function NetworkDetails() {
    const {selectedNetwork, setSelectedNetwork} = useNetworks();
    const [activeTab, setActiveTab] = useState('INSPECT');

    const inspectNetwork = () => {
        if (selectedNetwork) {
            invoke('inspect_network', {name: selectedNetwork.Name}).then((info) => {
                setSelectedNetwork(info)
            });
        }
    }

    useEffect(() => {
        if (selectedNetwork && activeTab === "INSPECT") {
            inspectNetwork()
        }
    }, [activeTab, selectedNetwork])


    if (selectedNetwork == null) {
        return <LogoScreen message={"Select a network to see more details"}/>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'INSPECT':
                return <JSONSyntaxHighlighter id="json-pretty" json={selectedNetwork}></JSONSyntaxHighlighter>;

            default:
                return null;
        }
    };

    return (
        <div className="dark p-4 bg-base-100 shadow-sm rounded-sm h-full overflow-x-hidden flex flex-col">
            <div className="flex items-center ">
                <h1 className="text-lg font-bold mr-2">{selectedNetwork.Name}</h1>
                <button
                    className="rounded"
                    onClick={() => copyToClipboard(selectedNetwork.Name)}
                    title="Copy Name"
                >
                    <IconCopy className="w-4 h-4 "/>
                </button>

            </div>
            <div className="flex items-center mb-4">
                <p className="text-sm  mr-2">{selectedNetwork.Id.slice(7, 19)}</p>
                <button
                    className="rounded"
                    onClick={() => copyToClipboard(selectedNetwork.Id)}
                    title="Copy full ID"
                >
                    <IconCopy className="w-4 h-4 "/>
                </button>
            </div>


            <div className="flex mb-4">
                <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Delete">
                    {/* <button className="btn btn-square btn-sm btn-error mr-3" onClick={() => { }}>
                        <IconBxTrashAlt className="size-5" />
                    </button> */}
                </div>
            </div>
            <div className="flex mb-4 border-b border-base-300">
                <button className={`mr-4 pb-2 ${activeTab === 'INSPECT' ? 'border-b-2 border-base-content' : ''}`}
                        onClick={() => setActiveTab('INSPECT')}>INSPECT
                </button>

            </div>
            <div className="flex-1 overflow-auto text-black p-2 rounded">
                {renderContent()}
            </div>

        </div>
    );
}