import { invoke } from '@tauri-apps/api';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/acai.css';
import { useImages } from "../../state/ImagesContext"

import { IconBxTrashAlt, IconCopy, IconTag } from '../../Icons';
import ImageHistory from './ImageHistory';
import { copyToClipboard, formatSize } from '../../utils';
import LogoScreen from '../LogoScreen';


function ImageDetails() {
  const { selectedImage, setSelectedImage, loadImages } = useImages();
  const [activeTab, setActiveTab] = useState('INSPECT');
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (selectedImage && activeTab === 'INSPECT') {
      getInfo();
    }

  }, [activeTab, selectedImage]);

  function getInfo() {
    invoke('image_info', { name: selectedImage.RepoTags[0] }).then((info) => {
      setInfo(info);
    }).catch((error) => {
      console.error("Error fetching image info:", error);
      toast.error(error)
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

  function handleDelete(event) {
    event.preventDefault();
    const modal = document.getElementById('delete_image_modal');
    const forceDelete = modal.querySelector('input[name="forceDelete"]').checked;
    const noPrune = modal.querySelector('input[name="noPrune"]').checked;

    invoke("delete_image", { id: selectedImage.Id, force: forceDelete, noPrune: noPrune }).then((res) => {
      toast.success(res)

      setSelectedImage(null)
      loadImages()

    }).then((err) => {
      toast.error(err)
    });
    modal.close();
  }

  if (selectedImage == null) {
    return <LogoScreen message={"Select an image to see more details"} />
  }

  return (
    <>
      <dialog id="delete_image_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">Are you sure you want to delete this image?</p>
          <div className="py-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="forceDelete"
                className="checkbox checkbox-primary mr-2"
                defaultChecked
              />
              Force
            </label>
          </div>
          <div className="py-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="noPrune"
                className="checkbox checkbox-primary mr-2"
              />
              Prune
            </label>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-2" onClick={(e) => document.getElementById('delete_image_modal').closeModal()}>Cancel</button>
              <button className="btn btn-error" onClick={handleDelete}>Delete</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="dark p-4 bg-base-100 shadow-sm rounded-md h-full overflow-x-hidden flex flex-col">
        <div className="flex items-center">
          <h1 className="text-lg font-bold mr-2">{selectedImage.RepoTags[0]}</h1>
          <button
            className="rounded"
            onClick={() => copyToClipboard(selectedImage.RepoTags[0])}
            title="Copy Image Name"
          >
            <IconCopy className="w-4 h-4 text-gray-600" />
          </button>
          <p className="ml-auto text-sm ">Size: {formatSize(selectedImage.Size)}</p>
        </div>
        <div className="flex items-center mb-4">
          <p className="text-sm text mr-2">{selectedImage.Id.slice(7, 19)}</p>
          <button
            className="rounded"
            onClick={() => copyToClipboard(selectedImage.Id)}
            title="Copy full ID"
          >
            <IconCopy className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="flex mb-4">
          {/* TODO: Add more operations */}
          {/* <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Tag Image">
            <button className="btn btn-square btn-sm mr-3" onClick={() => imageOperation("tag")}>
              <IconTag className="size-5" />
            </button>
          </div> */}

          <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Delete">
            <button className="btn btn-square btn-sm btn-error mr-3" onClick={() => document.getElementById('delete_image_modal').showModal()}>
              <IconBxTrashAlt className="size-5" />
            </button>
          </div>
        </div>
        <div className="flex mb-4 border-b border-base-300">
          <button className={`mr-4 pb-2 ${activeTab === 'INSPECT' ? 'border-b-2 border-base-content' : ''}`} onClick={() => setActiveTab('INSPECT')}>INSPECT</button>
          <button className={`pb-2 mr-4 ${activeTab === 'HISTORY' ? 'border-b-2 border-base-content' : ''}`} onClick={() => setActiveTab('HISTORY')}>HISTORY</button>
        </div>
        <div className="flex-1 overflow-auto text-black p-2 rounded">
          {renderContent()}
        </div>
      </div>
    </>

  );
}

export default ImageDetails;