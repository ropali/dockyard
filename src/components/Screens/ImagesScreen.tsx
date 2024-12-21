import React, { useEffect } from 'react';
import { useImages } from '../../state/ImagesContext';
import ImagesList from '../Images/ImageList';
import ImageDetails from '../Images/ImageDetails';


export default function ImagesScreen(): JSX.Element {

    const { selectedImage } = useImages();
    
    return (
        <div className="h-full w-full mt-4 flex rounded-lg overflow-hidden">
            <div className="w-1/3 bg-base-300 p-2 overflow-y-auto">
                <ImagesList />
            </div>
            <div className={`w-full bg-base-200 ml-1 overflow-hidden ${selectedImage ? 'bg-base-100' : 'bg-base-400'}`}>
                <ImageDetails />
            </div>
        </div>
    )
}
