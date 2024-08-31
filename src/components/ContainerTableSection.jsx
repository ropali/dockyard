import React, { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api';

const ContainerTableSection = ({ selectedContainer }) => {
    const [containers, setContainers] = useState([
        { name: 'focused_lalande', id: '323b03dbc13b', cpu: '-', memory: '-', netIO: '-', blockIO: '-', pids: '-' },
        { name: 'my-postgres', id: '48e2dd571d6b', cpu: '-', memory: '-', netIO: '-', blockIO: '-', pids: '-' }
    ]);

    useEffect(() => {
        if (selectedContainer) {
            const unlistenStats = listen('stats', (event) => {
                const updatedContainers = containers.map(container => {
                    if (container.id === selectedContainer.Id) {
                        const cpuUsage = (event.payload.cpu_stats.cpu_usage.total_usage / event.payload.cpu_stats.system_cpu_usage) * 100;
                        const memoryUsage = `${(event.payload.memory_stats.usage / (1024 * 1024)).toFixed(2)} MB / ${(event.payload.memory_stats.limit / (1024 * 1024)).toFixed(2)} MB`;
                        const netIO = `${(event.payload.networks.eth0.tx_bytes / 1024).toFixed(2)} KB / ${(event.payload.networks.eth0.rx_bytes / 1024).toFixed(2)} KB`;
                        const blockWrite = event.payload.blkio_stats.io_service_bytes_recursive?.find(io => io.op === 'write')?.value / (1024 * 1024);
                        const blockRead = event.payload.blkio_stats.io_service_bytes_recursive?.find(io => io.op === 'read')?.value / (1024 * 1024);
                        const blockIO = `${blockWrite ? blockWrite.toFixed(2) : '0'} MB / ${blockRead ? blockRead.toFixed(2) : '0'} MB`;

                        return {
                            ...container,
                            cpu: `${cpuUsage.toFixed(3)}%`,
                            memory: memoryUsage,
                            netIO: netIO,
                            blockIO: blockIO,
                            pids: event.payload.pids_stats.current
                        };
                    }
                    return container;
                });
                setContainers(updatedContainers);
            });

            invoke('container_stats', { cId: selectedContainer.Id });

            return () => {
                invoke('cancel_stream', { streamType: "stats" });
                unlistenStats.then(f => f());
            };
        }
    }, [selectedContainer, containers]);

    return (
        <div className="col-span-12 bg-base-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Stats Monitor</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left whitespace-nowrap">
                    <thead className="bg-base-300">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Container ID</th>
                            <th className="p-4">CPU</th>
                            <th className="p-4">Memory Usage / Limit</th>
                            <th className="p-4">Net I/O</th>
                            <th className="p-4">Block I/O</th>
                            <th className="p-4">PIDs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {containers.map((container, index) => (
                            <tr key={index} className={`hover:bg-base-300 ${index % 2 === 0 ? 'bg-base-200' : 'bg-base-100'}`}>
                                <td className="p-4 font-medium">{container.name}</td>
                                <td className="p-4">{container.id}</td>
                                <td className="p-4 text-center">{container.cpu}</td>
                                <td className="p-4">{container.memory}</td>
                                <td className="p-4">{container.netIO}</td>
                                <td className="p-4">{container.blockIO}</td>
                                <td className="p-4 text-center">{container.pids}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContainerTableSection;
