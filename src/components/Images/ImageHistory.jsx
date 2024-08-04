import React, { useEffect, useState } from 'react';
import { useImages } from '../../state/ImagesContext'
import { formatSize, formatDate } from '../../utils';
import { invoke } from '@tauri-apps/api';
import { toast } from 'react-toastify';


const ImageHistory = () => {

    const { selectedImage } = useImages();

    const [history, setHistory] = useState([])


    function getHistory() {
        invoke('image_history', { name: selectedImage.RepoTags[0] }).then((history) => {
            setHistory(history);

        }).catch((error) => {
            toast.error("Failed to fetch image history.")
            console.error("Error fetching image history:", error);
        });
    }


    useEffect(() => {
        getHistory()

    }, [selectedImage])



    return (
        <div className="overflow-x-auto h-full">
            <table className="table table-sm w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Created</th>
                        <th>Created By</th>
                        <th className='min-w-12'>Size</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((layer, idx) => (
                        <tr key={idx + 1} className="hover:bg-gray-100">
                            <td>{idx + 1}</td>
                            <td className="whitespace-nowrap ">{formatDate(layer.Created)}</td>
                            <td className="max-w-md truncate" title={layer.CreatedBy}>
                                {layer.CreatedBy || 'N/A'}
                            </td>
                            <td className='min-w-12'>{formatSize(layer.Size)}</td>
                            <td>
                                {layer.Tags && layer.Tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {layer.Tags.map((tag, i) => (
                                            <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    'N/A'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ImageHistory;