import React, { useEffect, useState } from 'react';

import { useContainers } from '../../state/ContainerContext';
import { useVolumes } from '../../state/VolumesContext';

import { Container } from '../../models/Container';
import { Volume } from '../../models/Volume';

const VolumeAttachedContainers = () => {

    const { selectedVolume } = useVolumes();

    const [containerList, setContainerList] = useState<Container[]>([])

    const { containers, loadContainers } = useContainers()


    function filterContainersByVolume() {
        let result = Array.isArray(containers) ? containers.filter((container) => {
            let matched = false
            if (container && container.Mounts) {

                container.Mounts.forEach((mount) => {
                    if (mount.Name === selectedVolume?.Name) {
                        matched = true
                    }
                })
            }

            return matched
        }) : [];

        return result
    }


    useEffect(() => {
        // Load containers if not already loaded
        if (!containers.length) {
            loadContainers();
        } else {
            // Filter containers once they are loaded
            setContainerList(filterContainersByVolume());
        }
    }, [selectedVolume, containers, loadContainers]);



    return (
        <div className="overflow-x-auto h-full">
            <table className="table table-sm w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Id</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {containerList.map((container, idx) => (
                        <tr key={idx + 1} className="hover:bg-gray-100">
                            <td>{idx + 1}</td>
                            <td className="whitespace-nowrap ">{container.Names[0].replace("/", "")}</td>
                            <td className="max-w-md truncate" title={container.Id}>
                                {container.Id}
                            </td>
                            <td className="whitespace-nowrap ">{container.Status || 'N/A'}</td>



                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VolumeAttachedContainers;