import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import toast from '../../utils/toast';
import { useContainers } from '../../state/ContainerContext';
import LogoScreen from '../LogoScreen';

interface Process {
    uuid: string;
    pid: string;
    ppid: string;
    c: string;
    tty: string;
    time: string;
    cmd: string;
}

const ContainerProcesses = () => {
    const { selectedContainer } = useContainers();
    const [processes, setProcess] = useState<Process[]>([]);

    const isContainerRunning = () => {
        return (
            selectedContainer != null &&
            selectedContainer?.Status.toLowerCase().includes('up')
        );
    };

    const getProcesses = async () => {
        try {
            const response: Process[] = await invoke('get_container_processes', {
                container: selectedContainer?.Names[0].replace('/', '') || '',
            });
            setProcess(response);
        } catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        let intervalId: number | undefined;

        if (isContainerRunning()) {
            getProcesses();
            intervalId = window.setInterval(() => {
                getProcesses();
            }, 10000); // Calls getProcesses every 10 seconds
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId); // Clears the interval when the component unmounts
            }
        };
    }, [selectedContainer]);

    if (!isContainerRunning()) {
        return <LogoScreen message="Container is not running!"/>;
    }

    return (
        <div className="overflow-x-auto h-full">
            <table className="table table-sm w-full bg-base-100 text-base">
                <thead>
                <tr>
                    <th>UUID</th>
                    <th>PID</th>
                    <th>PPID</th>
                    <th className="min-w-12">C</th>
                    <th>TTY</th>
                    <th>TIME</th>
                    <th>CMD</th>
                </tr>
                </thead>
                <tbody>
                {processes.map((process, index) => (
                    <tr key={index} className="text-base-content">
                        <td>{process.uuid}</td>
                        <td>{process.pid}</td>
                        <td>{process.ppid}</td>
                        <td>{process.c}</td>
                        <td>{process.tty}</td>
                        <td>{process.time}</td>
                        <td>{process.cmd}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContainerProcesses;
