import React, { FC } from 'react';
import { Network } from '../../models/Network';

interface NetworkCardProps {
    network: Network;
    onClick: () => void;
    isSelected: boolean;
}

const NetworkCard: FC<NetworkCardProps> = ({ network, onClick, isSelected }) => {
    return (
        <div
            className={`bg-base-100 shadow-sm rounded-md p-4 mb-4 cursor-pointer hover:bg-base-200 transition-colors duration-200 relative
                ${isSelected ? 'border-l-4 border-base-content' : ''}`}
            onClick={onClick}
        >
            <h2 className="text-sm font-semibold mb-1 truncate pr-6">{network.Name}</h2>
            <div className="text-xs  space-y-0.5">
                <p><span className="font-medium">ID:</span> {network?.getShortId()}</p>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    );
};

export default NetworkCard;