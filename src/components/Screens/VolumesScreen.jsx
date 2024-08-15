import React, { useState, useEffect } from 'react';
import { useVolumes } from '../../state/VolumesContext';
import VolumesList from '../Volumes/VolumesList';
import VolumeDetails from '../Volumes/VolumeDetails';


export default function VolumesScreen() {
    const { selectedVolume } = useVolumes();

    return (
        <div className="h-full w-full mt-4 flex rounded-lg overflow-hidden">
            <div className="w-1/3 bg-base-300 p-2 overflow-y-auto">
                <VolumesList />
            </div>
            <div className={`w-full h-full bg-base-300 ml-1 overflow-hidden ${selectedVolume ? 'bg-white' : 'bg-gray-200'}`}>
                <VolumeDetails />
            </div>
        </div>
    );
}







