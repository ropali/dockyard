// @ts-ignore
import React, { createContext, useState, useContext, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import type { Docker } from '../types/docker';

interface ImageContextType {
  images: Docker.ImageInfo[];
  selectedImage: Docker.ImageInfo | null;
  loadImages: () => void;
  setSelectedImage: (image: Docker.ImageInfo | null) => void;
}

const ImagesContext = createContext<ImageContextType | null>(null);

export function ImagesProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [images, setImages] = useState<Docker.ImageInfo[]>([]);
  const [selectedImage, setSelectedImage] = useState<Docker.ImageInfo | null>(null);

  const loadImages = useCallback(() => {
    invoke<Docker.ImageInfo[]>('list_images').then((images) => {
      setImages(images);
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