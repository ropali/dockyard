import React, { createContext, useState, useContext, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

const ImagesContext = createContext();

export function ImagesProvider({ children }) {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null)

  const loadImages = useCallback(() => {
    // invoke('fetch_containers').then((newContainers) => {
    //   setContainers(newContainers);
    // });
    let data = [
      {
        "Containers": -1,
        "Created": 1721734735,
        "Id": "sha256:51119fbbdf398ae4d1a6f442a0ce9d50908a5457fdd84b1cc9f0b7daf7de341c",
        "Labels": null,
        "ParentId": "",
        "RepoDigests": [
          "friendica@sha256:cf908c52fac8906827028d8efaac66c4c532db9b68e9cbc7cb717cd7e22005f1"
        ],
        "RepoTags": [
          "friendica:latest"
        ],
        "SharedSize": -1,
        "Size": 660305638
      },
      {
        "Containers": -1,
        "Created": 1715281091,
        "Id": "sha256:07a4ee949b9e7851d9ef860fd36f486aa821f23e1c17939244155fe825eaf79a",
        "Labels": null,
        "ParentId": "",
        "RepoDigests": [
          "postgres@sha256:d0f363f8366fbc3f52d172c6e76bc27151c3d643b870e1062b4e8bfe65baf609"
        ],
        "RepoTags": [
          "postgres:latest"
        ],
        "SharedSize": -1,
        "Size": 431581956
      },
      {
        "Containers": -1,
        "Created": 1683046167,
        "Id": "sha256:d2c94e258dcb3c5ac2798d32e1249e42ef01cba4841c2234249495f87264ac5a",
        "Labels": null,
        "ParentId": "",
        "RepoDigests": [
          "hello-world@sha256:1408fec50309afee38f3535383f5b09419e6dc0925bc69891e79d84cc4cdcec6"
        ],
        "RepoTags": [
          "hello-world:latest"
        ],
        "SharedSize": -1,
        "Size": 13256
      }
    ]

    setImages(data)
  }, []);


  const getImageHistory = useCallback(() => {
    return [
      {
        "Id": "3db9c44f45209632d6050b35958829c3a2aa256d81b9a7be45b362ff85c54710",
        "Created": 1398108230,
        "CreatedBy": "/bin/sh -c #(nop) ADD file:eb15dbd63394e063b805a3c32ca7bf0266ef64676d5a6fab4801f2e81e2a5148 in /",
        "Tags": [
          "ubuntu:lucid",
          "ubuntu:10.04"
        ],
        "Size": 182964289,
        "Comment": ""
      },
      {
        "Id": "6cfa4d1f33fb861d4d114f43b25abd0ac737509268065cdfd69d544a59c85ab8",
        "Created": 1398108222,
        "CreatedBy": "/bin/sh -c #(nop) MAINTAINER Tianon Gravi <admwiggin@gmail.com> - mkimage-debootstrap.sh -i iproute,iputils-ping,ubuntu-minimal -t lucid.tar.xz lucid http://archive.ubuntu.com/ubuntu/",
        "Tags": [],
        "Size": 0,
        "Comment": ""
      },
      {
        "Id": "511136ea3c5a64f264b78b5433614aec563103b4d4702f3ba7d4d2698e22c158",
        "Created": 1371157430,
        "CreatedBy": "",
        "Tags": [
          "scratch12:latest",
          "scratch:latest"
        ],
        "Size": 0,
        "Comment": "Imported from -"
      }
    ]
  })



  return (
    <ImagesContext.Provider value={{ images, selectedImage, loadImages, setSelectedImage, getImageHistory }}>
      {children}
    </ImagesContext.Provider>
  );
}

export function useImages() {
  return useContext(ImagesContext);
}