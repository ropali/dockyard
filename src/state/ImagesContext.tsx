// @ts-ignore
import React, { createContext, useState, useContext, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

interface ImageInfo {
  Id: string;
  name: string;
  tag: string;
  created: string;
  size: number;
  RepoTags: string[];
}

interface ImageContextType {
  images: ImageInfo[];
  selectedImage: ImageInfo | null;
  loadImages: () => void;
  setSelectedImage: (image: ImageInfo | null) => void;
}

const ImagesContext = createContext<ImageContextType | null>(null);

export function ImagesProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);

  const loadImages = useCallback(() => {
    invoke<ImageInfo[]>('list_images').then((images) => {
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