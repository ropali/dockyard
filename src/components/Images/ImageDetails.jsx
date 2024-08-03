import { invoke } from '@tauri-apps/api';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/acai.css';
import { useImages } from "../../state/ImagesContext"

import { IconDocker, IconBxTrashAlt, IconDownload, IconCopy, IconTag } from '../../Icons';
import ImageHistory from './ImageHistory';
import { copyToClipboard, formatSize } from '../../utils';
import LogoScreen from '../LogoScreen';


function ImageDetails() {
  const { selectedImage, setSelectedImage } = useImages();
  const [activeTab, setActiveTab] = useState('INSPECT');
  const [info, setInfo] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (selectedImage && activeTab === 'INSPECT') {
      getInfo();
    }
    if (selectedImage && activeTab === 'HISTORY') {
      getHistory();
    }
  }, [activeTab, selectedImage]);

  function getInfo() {
    // invoke('fetch_image_info', { imageId: selectedImage.Id }).then((info) => {
    //   setInfo(info);
    //   console.log("Fetched image info:", info);
    // }).catch((error) => {
    //   console.error("Error fetching image info:", error);
    // });
    // TODO: Implement Image inspect API
    let data = {
      "Id": "sha256:ec3f0931a6e6b6855d76b2d7b0be30e81860baccd891b2e243280bf1cd8ad710",
      "RepoTags": [
        "example:1.0",
        "example:latest",
        "example:stable",
        "internal.registry.example.com:5000/example:1.0"
      ],
      "RepoDigests": [
        "example@sha256:afcc7f1ac1b49db317a7196c902e61c6c3c4607d63599ee1a82d702d249a0ccb",
        "internal.registry.example.com:5000/example@sha256:b69959407d21e8a062e0416bf13405bb2b71ed7a84dde4158ebafacfa06f5578"
      ],
      "Parent": "",
      "Comment": "",
      "Created": "2022-02-04T21:20:12.497794809Z",
      "DockerVersion": "27.0.1",
      "Author": "",
      "Config": {
        "Hostname": "",
        "Domainname": "",
        "User": "web:web",
        "AttachStdin": false,
        "AttachStdout": false,
        "AttachStderr": false,
        "ExposedPorts": {
          "80/tcp": {},
          "443/tcp": {}
        },
        "Tty": false,
        "OpenStdin": false,
        "StdinOnce": false,
        "Env": [
          "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        ],
        "Cmd": [
          "/bin/sh"
        ],
        "Healthcheck": {
          "Test": [
            "string"
          ],
          "Interval": 0,
          "Timeout": 0,
          "Retries": 0,
          "StartPeriod": 0,
          "StartInterval": 0
        },
        "ArgsEscaped": true,
        "Image": "",
        "Volumes": {
          "/app/data": {},
          "/app/config": {}
        },
        "WorkingDir": "/public/",
        "Entrypoint": [],
        "OnBuild": [],
        "Labels": {
          "com.example.some-label": "some-value",
          "com.example.some-other-label": "some-other-value"
        },
        "StopSignal": "SIGTERM",
        "Shell": [
          "/bin/sh",
          "-c"
        ]
      },
      "Architecture": "arm",
      "Variant": "v7",
      "Os": "linux",
      "OsVersion": "",
      "Size": 1239828,
      "VirtualSize": 1239828,
      "GraphDriver": {
        "Name": "overlay2",
        "Data": {
          "MergedDir": "/var/lib/docker/overlay2/ef749362d13333e65fc95c572eb525abbe0052e16e086cb64bc3b98ae9aa6d74/merged",
          "UpperDir": "/var/lib/docker/overlay2/ef749362d13333e65fc95c572eb525abbe0052e16e086cb64bc3b98ae9aa6d74/diff",
          "WorkDir": "/var/lib/docker/overlay2/ef749362d13333e65fc95c572eb525abbe0052e16e086cb64bc3b98ae9aa6d74/work"
        }
      },
      "RootFS": {
        "Type": "layers",
        "Layers": [
          "sha256:1834950e52ce4d5a88a1bbd131c537f4d0e56d10ff0dd69e66be3b7dfa9df7e6",
          "sha256:5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef"
        ]
      },
      "Metadata": {
        "LastTagTime": "2022-02-28T14:40:02.623929178Z"
      }
    }

    setInfo(data)
  }

  function getHistory() {
    invoke('fetch_image_history', { imageId: selectedImage.Id }).then((history) => {
      setHistory(history);
      console.log("Fetched image history:", history);
    }).catch((error) => {
      console.error("Error fetching image history:", error);
    });
  }

  function imageOperation(actionType) {
    invoke('image_operation', { imageId: selectedImage.Id, opType: actionType }).then((res) => {
      if (res) {
        toast(res);
        // Refresh image details or list as needed
      }
    }).catch((e) => {
      toast.error(e);
    });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'INSPECT':
        return <JSONPretty id="json-pretty" data={info}></JSONPretty>;
      case 'HISTORY':
        return <ImageHistory />;
      default:
        return null;
    }
  };

  if (selectedImage == null) {
    return <LogoScreen message={"Select an image to see more details"}/>
  }

  return (
    <div className="dark p-4 bg-white shadow-sm rounded-md h-full overflow-x-hidden flex flex-col">
      <div className="flex items-center">
        <h1 className="text-lg font-bold mr-2">{selectedImage.RepoTags[0]}</h1>
        <button
          className="hover:bg-gray-200 rounded"
          onClick={() => copyToClipboard(selectedImage.RepoTags[0])}
          title="Copy Image Name"
        >
          <IconCopy className="w-4 h-4 text-gray-600" />
        </button>
        <p className="ml-auto text-sm text-gray-600">Size: {formatSize(selectedImage.Size)}</p>
      </div>
      <div className="flex items-center mb-4">
        <p className="text-sm text-gray-600 mr-2">{selectedImage.Id.slice(7, 19)}</p>
        <button
          className="hover:bg-gray-200 rounded"
          onClick={() => copyToClipboard(selectedImage.Id)}
          title="Copy full ID"
        >
          <IconCopy className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="flex mb-4">

        <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Tag Image">
          <button className="btn btn-square btn-sm mr-3" onClick={() => imageOperation("tag")}>
            <IconTag className="size-5" />
          </button>
        </div>

        <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Delete">
          <button className="btn btn-square btn-sm btn-error mr-3" onClick={() => imageOperation("delete")}>
            <IconBxTrashAlt className="size-5" />
          </button>
        </div>
      </div>
      <div className="flex mb-4 border-b">
        <button className={`mr-4 pb-2 ${activeTab === 'INSPECT' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('INSPECT')}>INSPECT</button>
        <button className={`pb-2 mr-4 ${activeTab === 'HISTORY' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('HISTORY')}>HISTORY</button>
      </div>
      <div className="flex-1 overflow-auto text-black p-2 rounded">
        {renderContent()}
      </div>
    </div>
  );
}

export default ImageDetails;