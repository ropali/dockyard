import React, { useState, useEffect } from "react";
import {useVolumes} from "../../state/VolumesContext"
import VolumesTopBar from "./VolumesTopBar";
import VolumeCard from "./VolumeCard";


export default function VolumesList() {
    const { volumes, loadVolumes, setSelectedVolume, selectedVolume } = useVolumes();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVolumes = Array.isArray(volumes) ? volumes.filter(volume =>
        volume.Name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    useEffect(() => {
        loadVolumes();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <VolumesTopBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <div className="flex-1 overflow-y-auto mt-2">
                {filteredVolumes.map(volume => (
                    <VolumeCard
                        key={volume.Name}
                        volume={volume}
                        onClick={() => setSelectedVolume(volume)}
                        isSelected={selectedVolume != null && selectedVolume.Name === volume.Name}
                    />
                ))}
            </div>
        </div>
    );
}