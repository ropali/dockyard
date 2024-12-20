import React, {useEffect, useState} from 'react';
import {useImages} from '../../state/ImagesContext'
import {invoke} from '@tauri-apps/api';
import toast from '../../utils/toast';
import {ImageHistory as ImageHistoryModel} from '../../models/Image';


interface ImageHistoryProps {}

const ImageHistory: React.FC<ImageHistoryProps> = () => {

    const { selectedImage } = useImages();

    const [history, setHistory] = useState<Array<ImageHistoryModel>>([])

    const getHistory = () => {
        if (selectedImage) {
            invoke<Array<Record<any, any>>>('image_history', {name: selectedImage.RepoTags[0]})
                .then((history: Array<Record<any, any>>) => {

                    const parsedHistory = (history as Array<any>).map(item => {
                        return new ImageHistoryModel({...item});
                    });
                    setHistory(parsedHistory);
                })
                .catch((error) => {
                    toast.error("Failed to fetch image history.");
                    console.error("Error fetching image history:", error);
                });
        }
    };


    useEffect(() => {
        getHistory()

    }, [selectedImage])

    return (
        <div className="overflow-x-auto h-full">
            <table className="table table-sm w-full bg-base-100 text-base">
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

                        <tr key={idx + 1} className="text-base-content">
                            <td className="text-base">{idx + 1}</td>
                            <td className="whitespace-nowrap text-base">{layer?.getCreatedDate()}</td>
                            <td className="max-w-md truncate text-base" title={layer.CreatedBy}>
                                {layer.CreatedBy || 'N/A'}
                            </td>
                            <td className='min-w-12 text-base'>{layer?.c()}</td>
                            <td>
                                {layer.Tags && layer.Tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {layer.Tags.map((tag, i) => (
                                            <span key={i} className="badge badge-primary">
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