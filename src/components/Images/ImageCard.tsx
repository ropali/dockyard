import React, {FC} from 'react';
import {formatSize} from "../../utils";
import type {Docker} from "../../types/docker";

interface ImageCardProps {
    image: Docker.Image;
    onClick: () => void;
    isSelected: boolean;
}

const ImageCard: FC<ImageCardProps> = ({image, onClick, isSelected}) => {

    return (
        <div
            className={
                `p-2 bg-base-100 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer mb-2 relative
                ${isSelected ? 'border-l-4 border-base-content' : ''}`
            }
            onClick={onClick}
        >
            <h2 className="text-sm font-semibold mb-1">{image.RepoTags[0]}</h2>
            <div className="text-xs space-y-0.5">
                <p><span className="font-medium">ID:</span> {image.getShortId()}</p>
                <p><span className="font-medium">Size:</span> {formatSize(image.Size)}</p>
                <p><span className="font-medium">Created:</span> {image.Created}</p>
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    );
};

export default ImageCard;