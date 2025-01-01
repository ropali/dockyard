import React, {useEffect, useState} from 'react';
import {invoke} from '@tauri-apps/api/core';
import toast from '../../utils/toast';
import {useContainers} from '../../state/ContainerContext';
import LogoScreen from '../LogoScreen';
import {ContainerProcess} from "../../models";


const ContainerProcesses = () => {
    const {selectedContainer} = useContainers();
    const [processes, setProcess] = useState<ContainerProcess[]>([]);

    const isContainerRunning = () => {
        return (
            selectedContainer != null &&
            selectedContainer?.Status.toLowerCase().includes('up')
        );
    };

    const getProcesses = async () => {
        try {
            const response: string[][] = await invoke('get_container_processes', {
                container: selectedContainer?.getName() || '',
            });

            setProcess(response.map((process: string[]) => {

                return new ContainerProcess(
                    {
                        uuid: process[0],
                        pid: process[1],
                        ppid: process[2],
                        c: process[3],
                        tty: process[4],
                        time: process[5],
                        cmd: process[6],
                    }
                )

            }));


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
