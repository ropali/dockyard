import React, { createContext, useState, useContext, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

const ImagesContext = createContext();

export function ImagesProvider({ children }) {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null)

  const loadImages = useCallback(() => {
    invoke('list_images').then((images) => {
      setImages(images);

    });

  }, []);



  return (
    <ImagesContext.Provider value={{ images, selectedImage, loadImages, setSelectedImage }}>
      {children}
    </ImagesContext.Provider>
  );
}

export function useImages() {
  return useContext(ImagesContext);
}