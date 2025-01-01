// @ts-ignore
import React, { createContext, useState, useContext, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Image } from '../models/Image';

interface ImageContextType {
  images: Image[];
  selectedImage: Image | null;
  loadImages: () => void;
  setSelectedImage: (image: Image | null) => void;
}

const ImagesContext = createContext<ImageContextType | null>(null);

export function ImagesProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const loadImages = useCallback(() => {
    invoke<Image[]>('list_images').then((images) => {
      setImages(images.map((image) => new Image(image)));
    });
  }, []);

  return (
    <ImagesContext.Provider value={{ images, selectedImage, loadImages, setSelectedImage }}>
      {children}
    </ImagesContext.Provider>
  );
}

export function useImages(): ImageContextType {
  const context = useContext(ImagesContext);
  if (!context) {
    throw new Error('useImages must be used within an ImagesProvider');
  }
  return context;
}