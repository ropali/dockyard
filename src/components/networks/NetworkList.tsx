import React, { useState, useEffect } from "react";

import { useNetworks } from "../../state/NetworkContext";
import NetworkTopBar from "./NetworkTopBar";
import NetworkCard from "./NetworkCard";


export default function NetworkList() {
    const { networks, loadNetworks, setSelectedNetwork, selectedNetwork } = useNetworks();
    const [searchQuery, setSearchQuery] = useState<string>('');
    
    const filteredNetworks = networks.filter(network =>
        network.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        loadNetworks();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <NetworkTopBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <div className="flex-1 overflow-y-auto mt-2">
                {filteredNetworks.map(network => (
                    <NetworkCard
                        key={network.Name}
                        network={network}
                        onClick={() => setSelectedNetwork(network)}
                        isSelected={selectedNetwork != null && selectedNetwork.Name === network.Name}
                    />
                ))}
            </div>
        </div>
    );
}