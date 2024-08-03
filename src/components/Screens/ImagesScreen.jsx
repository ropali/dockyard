
import React, { useEffect } from 'react'
import { useImages } from '../../state/ImagesContext';
import ImagesList from '../Images/ImageList';
import ImageDetails from '../Images/ImageDetails';


export default function ImagesScreen() {

    const {selectedImage } = useImages();

   


    return (
        <div className="h-full w-full mt-4 flex rounded-lg overflow-hidden">
            <div className="w-1/3 bg-gray-200 p-2 overflow-y-auto">
                <ImagesList />
            </div>
            <div className={`w-full bg-gray-200 ml-1 overflow-hidden ${selectedImage ? 'bg-white' : 'bg-gray-200'}`}>
                <ImageDetails />
            </div>
        </div>
    )
}
