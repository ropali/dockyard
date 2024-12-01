import {invoke} from '@tauri-apps/api';
import React, {useEffect, useState} from 'react';
import toast from '../../utils/toast';
import {useImages} from "../../state/ImagesContext";
import {IconBxExport, IconBxTrashAlt, IconCopy} from '../../Icons/index';
import ImageHistory from './ImageHistory.js';
import {copyToClipboard, formatSize} from '../../utils';
import LogoScreen from '../LogoScreen';
import JSONSyntaxHighlighter from "../JSONSyntaxHighlighter";

function ImageDetails() {
    const {selectedImage, setSelectedImage, loadImages} = useImages();
    const [activeTab, setActiveTab] = useState('INSPECT');
    const [info, setInfo] = useState("");
    const [loadingButton, setLoadingButton] = useState(null); // State for loading animation

    useEffect(() => {
        if (selectedImage && activeTab === 'INSPECT') {
            getInfo();
        }
    }, [activeTab, selectedImage]);

    function getInfo() {
        invoke('image_info', {name: selectedImage.RepoTags[0]}).then((info) => {
            setInfo(info);
        }).catch((error) => {
            console.error("Error fetching image info:", error);
            toast.error(error);
        });
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'INSPECT':
                return <JSONSyntaxHighlighter id="json-pretty" json={selectedImage}></JSONSyntaxHighlighter>;
            case 'HISTORY':
                return <ImageHistory/>;
            default:
                return null;
        }
    };

    function handleDelete(event) {
        event.preventDefault();
        const modal = document.getElementById('delete_image_modal');
        const forceDelete = modal.querySelector('input[name="forceDelete"]').checked;
        const noPrune = modal.querySelector('input[name="noPrune"]').checked;

        setLoadingButton("delete-btn");
        modal.close();

        invoke("delete_image", {
            imageName: selectedImage.RepoTags[0],
            force: forceDelete,
            noPrune: noPrune
        }).then((res) => {
            toast.success('Image successfully deleted!');
            setSelectedImage(null);
            loadImages();
        }).catch((err) => {
            toast.error(err);
        }).finally(() => {
            setLoadingButton(null);

        });

    }

    const exportImage = () => {
        setLoadingButton("export-btn");
        invoke("export_image", {imageName: selectedImage.RepoTags[0]}).then((res) => {
            toast.success(res);
        }).catch((err) => {
            toast.error(err);
        }).finally(() => {
            setLoadingButton(null);
        });
    }

    if (selectedImage == null) {
        return <LogoScreen message={"Select an image to see more details"}/>;
    }

    return (
        <>
            <dialog id="delete_image_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm Delete</h3>
                    <p className="py-4">Are you sure you want to delete this image?</p>
                    <div className="py-2">
                        <label className="flex items-center">
                            <input type="checkbox" name="forceDelete" className="checkbox checkbox-primary mr-2"
                                   defaultChecked/>
                            Force
                        </label>
                    </div>
                    <div className="py-2">
                        <label className="flex items-center">
                            <input type="checkbox" name="noPrune" className="checkbox checkbox-primary mr-2"/>
                            Prune
                        </label>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost mr-2"
                                    onClick={(e) => document.getElementById('delete_image_modal').closeModal()}>Cancel
                            </button>
                            <button className="btn btn-error" onClick={handleDelete}>Delete</button>
                        </form>
                    </div>
                </div>
            </dialog>

            <div className="dark p-4 bg-base-100 shadow-sm rounded-md h-full overflow-x-hidden flex flex-col">
                <div className="flex items-center">
                    <h1 className="text-lg font-bold mr-2">{selectedImage.RepoTags[0]}</h1>
                    <button className="rounded" onClick={() => copyToClipboard(selectedImage.RepoTags[0])}
                            title="Copy Image Name">
                        <IconCopy className="w-4 h-4 text-gray-600"/>
                    </button>
                    <p className="ml-auto text-sm ">Size: {formatSize(selectedImage.Size)}</p>
                </div>
                <div className="flex items-center mb-4">
                    <p className="text-sm text mr-2">{selectedImage.Id.slice(7, 19)}</p>
                    <button className="rounded" onClick={() => copyToClipboard(selectedImage.Id)} title="Copy full ID">
                        <IconCopy className="w-4 h-4 text-gray-600"/>
                    </button>
                </div>
                <div className="flex mb-4">
                    <div className="tooltip tooltip-bottom hover:tooltip-open z-10" data-tip="Export">
                        <button
                            className="btn btn-square btn-sm mr-3"
                            onClick={exportImage}
                            disabled={loadingButton == "export-btn"}
                        >
                            {loadingButton == "export-btn" ? <span className="loading loading-bars loading-xs"></span> :
                                <IconBxExport className="size-5"/>}
                        </button>
                    </div>

                    <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Delete">
                        <button
                            className="btn btn-square btn-sm hover:btn-error mr-3"
                            onClick={() => document.getElementById('delete_image_modal').showModal()}
                            disabled={loadingButton == "delete-btn"}
                        >
                            {loadingButton == "delete-btn" ? <span className="loading loading-bars loading-xs"></span> :
                                <IconBxTrashAlt className="size-5"/>}

                        </button>
                    </div>
                </div>
                <div className="flex mb-4 border-b border-base-300">
                    <button className={`mr-4 pb-2 ${activeTab === 'INSPECT' ? 'border-b-2 border-base-content' : ''}`}
                            onClick={() => setActiveTab('INSPECT')}>INSPECT
                    </button>
                    <button className={`pb-2 mr-4 ${activeTab === 'HISTORY' ? 'border-b-2 border-base-content' : ''}`}
                            onClick={() => setActiveTab('HISTORY')}>HISTORY
                    </button>
                </div>
                <div className="flex-1 overflow-auto text-black p-2 rounded">
                    {renderContent()}
                </div>
            </div>
        </>
    );
}

export default ImageDetails;
