import React, { useState, useEffect } from 'react'

import { useImages } from '../../state/ImagesContext'
import ImagesTopBar from './ImagesTopBar'
import ImageCard from './ImageCard'

function ImagesList() {

    const { images, loadImages, setSelectedImage } = useImages();

    const [searchQuery, setSearchQuery] = useState('');

    

    useEffect(() => {

        loadImages()

    }, [])



    return (
        <div className="h-full flex flex-col">
            <ImagesTopBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <div className="flex-1 overflow-y-auto mt-2">
                {images.map(image => (
                    <ImageCard
                        key={image.Id}
                        image={image}
                        onClick={() => setSelectedImage(image)}
                    />
                ))}
            </div>

        </div>
    )
}

export default ImagesList;
