import React from 'react';
import { IconDatabase } from '../../Icons';
import { formatDate } from '../../utils';

function VolumeCard({ volume, onClick }) {
    return (
        <div
            className="border p-2 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer mb-2 relative"
            onClick={onClick}
        >
            <h2 className="text-sm font-semibold mb-1">{volume.Name}</h2>
            <div className="text-xs text-gray-600 space-y-0.5">
                <p><span className="font-medium">ID:</span> {volume.Id.slice(0, 12)}</p>
                <p><span className="font-medium">Scope:</span> {volume.Scope}</p>
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    );
}

export default VolumeCard;