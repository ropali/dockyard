import React, {useEffect, useState} from 'react';
import {invoke} from "@tauri-apps/api";
import toast from "../../utils/toast.js";
import {useContainers} from "../../state/ContainerContext.jsx";
import LogoScreen from "../LogoScreen.jsx";

const ContainerProcesses = () => {
    const {selectedContainer} = useContainers();
    const [processes, setProcess] = useState([]);

    const isContainerRunning = () => {
        return (
            selectedContainer != null &&
            selectedContainer?.Status.toLowerCase().includes("up")
        );
    };

    const getProcesses = async () => {
        try {
            const response = await invoke("get_container_processes", {
                container: selectedContainer.Names[0].replace("/", ""),
            });
            setProcess(response);
        } catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        let intervalId;

        if (isContainerRunning()) {
            getProcesses();
            intervalId = setInterval(() => {
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
        return <LogoScreen message={"Container is not running!"}/>;
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
                {processes?.map((process, index) => (
                    <tr key={index} className="text-base-content">
                        <td>{process[0]}</td>
                        <td>{process[1]}</td>
                        <td>{process[2]}</td>
                        <td>{process[3]}</td>
                        <td>{process[4]}</td>
                        <td>{process[5]}</td>
                        <td>{process[6]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContainerProcesses;
