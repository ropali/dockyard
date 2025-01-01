import {invoke} from '@tauri-apps/api/core';
import React, {useEffect, useState} from 'react';
import toast from '../../utils/toast';
import {useImages} from "../../state/ImagesContext";
import {IconBxExport, IconBxTrashAlt, IconCopy} from '../../Icons';
import {copyToClipboard, formatSize} from '../../utils';
import LogoScreen from '../LogoScreen';
import JSONSyntaxHighlighter from "../JSONSyntaxHighlighter";
import ImageHistory from "./ImageHistory";
import Swal, {SweetAlertResult} from "sweetalert2";

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
        invoke('image_info', {name: selectedImage?.getName()}).then((info) => {
            setInfo(info as string);
        }).catch((error) => {
            console.error("Error fetching image info:", error);
            toast.error(error as string);
        });
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'INSPECT':
                return <JSONSyntaxHighlighter id="json-pretty" json={info}></JSONSyntaxHighlighter>;
            case 'HISTORY':
                return <ImageHistory/>;
            default:
                return null;
        }
    };

    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();
        let result: SweetAlertResult = await Swal.fire({
            title: 'Are you sure?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            icon: 'warning',
            html: `
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="font-bold">Force</span>
                <input type="checkbox" checked="checked" class="checkbox" id="force-delete" />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="font-bold">Prune</span>
                <input type="checkbox" checked="checked" class="checkbox" id="prune"/>
              </label>
          </div>
        `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    (document.getElementById('force-delete') as HTMLInputElement).checked,
                    (document.getElementById('prune') as HTMLInputElement).checked,
                ];
            },
            background: 'oklch(var(--b2))',
            customClass: {
                popup: 'text-base-content',
            },
        });

        if (result.isDenied || result.isDismissed) {
            setLoadingButton(null);
            return;
        }

        //@ts-ignore
        setLoadingButton("delete-btn");

        invoke("delete_image", {
            imageName: selectedImage?.getName(),
            force: result.value[0],
            noPrune: result.value[1],
        }).then((_: unknown) => {
            toast.success('Image successfully deleted!');
            setSelectedImage(null);
            loadImages();
        }).catch((err) => {
            toast.error(err);
        }).finally(() => {
            setLoadingButton(null);

        });

    };

    const exportImage = () => {
        //@ts-ignore
        setLoadingButton("export-btn");

        invoke("export_image", {imageName: selectedImage?.getName()}).then((res) => {
            toast.success(res as string);
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
            <div className="dark p-4 bg-base-100 shadow-sm rounded-md h-full overflow-x-hidden flex flex-col">
                <div className="flex items-center">
                    <h1 className="text-lg font-bold mr-2">{selectedImage?.getName()}</h1>
                    <button className="rounded" onClick={() => copyToClipboard(selectedImage?.getName())}
                            title="Copy Image Name">
                        <IconCopy className="w-4 h-4 text-gray-600"/>
                    </button>
                    <p className="ml-auto text-sm ">Size: {formatSize(selectedImage.Size)}</p>
                </div>
                <div className="flex items-center mb-4">
                    <p className="text-sm text mr-2">{selectedImage.getShortId()}</p>
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
                            onClick={handleDelete}
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
