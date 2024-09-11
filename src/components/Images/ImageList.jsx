import React, { useState, useEffect } from 'react'

import { useImages } from '../../state/ImagesContext'
import ImagesTopBar from './ImagesTopBar'
import ImageCard from './ImageCard'

function ImagesList() {

    const { images, loadImages, setSelectedImage, selectedImage } = useImages();

    const [searchQuery, setSearchQuery] = useState('');

    const filteredImages = images.filter(image => {
        return image.RepoTags[0]?.toLowerCase().includes(searchQuery.toLowerCase());
    });



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
                {filteredImages.map(image => (
                    <ImageCard
                        key={image.Id}
                        image={image}
                        onClick={() => setSelectedImage(image)}
                        isSelected={selectedImage && selectedImage.Id === image.Id}
                    />
                ))}
            </div>

        </div>
    )
}

export default ImagesList;
