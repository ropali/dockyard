import React, { useEffect, useState } from 'react';
import { useImages } from '../../state/ImagesContext'
import { formatSize, formatDate } from '../../utils';
import { invoke } from '@tauri-apps/api';
import toast from '../../utils/toast';

interface ImageHistory {
    Created: number;
    CreatedBy: string;
    Size: number;
    Tags?: string[];
}

interface ImageHistoryProps {

}

const ImageHistory: React.FC<ImageHistoryProps> = () => {

    const { selectedImage } = useImages();

    const [history, setHistory] = useState<Array<ImageHistory>>([])

    const getHistory = () => {
        if (selectedImage) {
            invoke('image_history', { name: selectedImage.RepoTags[0] }).then((history: unknown) => {
                setHistory(history as Array<ImageHistory>);
            }).catch((error) => {
                toast.error("Failed to fetch image history.")
                console.error("Error fetching image history:", error);
            });
        }
    }

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
                            <td className="whitespace-nowrap text-base">{formatDate(layer.Created)}</td>
                            <td className="max-w-md truncate text-base" title={layer.CreatedBy}>
                                {layer.CreatedBy || 'N/A'}
                            </td>
                            <td className='min-w-12 text-base'>{formatSize(layer.Size)}</td>
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