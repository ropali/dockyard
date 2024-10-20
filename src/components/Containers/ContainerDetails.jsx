import {invoke} from '@tauri-apps/api';
import React, {useEffect, useState} from 'react';
import {listen} from '@tauri-apps/api/event';

import LogsViewer from '../LogsViewer';
import {IconBxTerminal, IconBxTrashAlt, IconCircleStop, IconPlayCircle, IconRestart, IconWeb} from '../../Icons';

import {useContainers} from '../../state/ContainerContext';
import LogoScreen from '../LogoScreen';
import ContainerStats from './ContainerStats';
import JSONSyntaxHighlighter from "../JSONSyntaxHighlighter.jsx";
import ContainerNameWidget from "./ContainerNameWidget.jsx";
import {TOAST_OPTIONS_ERROR, TOAST_OPTIONS_SUCCESS} from "../../constants.js";
import Swal from 'sweetalert2';


function ContainerDetails() {

    const {selectedContainer, refreshSelectedContainer} = useContainers()

    const [activeTab, setActiveTab] = useState('LOGS');
    const [info, setInfo] = useState("");
    const [logs, setLogs] = useState([]);

    const [isContainerRunning, setIsContainerRunning] = useState(false)

    const [loadingButton, setLoadingButton] = useState(null)


    useEffect(() => {
        if (selectedContainer) {

            setIsContainerRunning(selectedContainer.Status.toLowerCase().includes("up"))

            setLogs([]); // Clear logs before subscribing

            const unlistenLogs = listen('log_chunk', (event) => {

                const sanitizedLog = sanitizeLog(event.payload);
                setLogs((prevLogs) => [...prevLogs, sanitizedLog]);
            });


            invoke('stream_docker_logs', {containerName: selectedContainer.Names[0].replace("/", "")});

            return () => {
                unlistenLogs.then(f => f());
            };
        }
    }, [selectedContainer]);

    useEffect(() => {
        if (activeTab === 'INFO' && selectedContainer) {
            getInfo();
        }


    }, [activeTab, selectedContainer]);


    useEffect(() => {
        if (selectedContainer) {
            const intervalId = setInterval(() => {
                refreshSelectedContainer();
            }, 60000); // 60000 milliseconds = 1 minute

            // Clean up function to clear the interval when the component unmounts
            // or when selectedContainer changes
            return () => {
                clearInterval(intervalId);
                invoke('cancel_stream', {streamType: "logs"});
            };
        }
    }, [selectedContainer]);


    function getInfo() {
        invoke('fetch_container_info', {cId: selectedContainer.Id}).then((info) => {
            setInfo(info);
            console.log("Fetched container info:", info);
        }).catch((error) => {
            console.error("Error fetching container info:", error);
        });
    }


    function sanitizeLog(log) {
        return log.replace(/[\x00-\x1F\x7F]/g, "");
    }

    const isWeb = () => {
        return selectedContainer.Ports.length > 0 && selectedContainer.Ports[0].PublicPort !== null;
    };


    function containerOperation(actionType) {
        setLoadingButton(actionType)
        invoke('container_operation', {
            containerName: selectedContainer.Names[0].replace("/", ""),
            opType: actionType
        }).then((res) => {
            if (res) {
                Swal.fire({
                    text: res,
                    ...TOAST_OPTIONS_SUCCESS
                })

                refreshSelectedContainer()
            }
        }).catch((e) => {
            Swal.fire({
                text: e,
                ...TOAST_OPTIONS_ERROR
            })
        }).finally(() => {
            setLoadingButton(null)
        });
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'LOGS':
                return <LogsViewer logs={logs}/>;
            case 'INFO':
                return <JSONSyntaxHighlighter id="json-pretty" json={info}></JSONSyntaxHighlighter>;
            case 'STATS':
                return <ContainerStats selectedContainer={selectedContainer}/>;
            default:
                return null;
        }
    };

    if (selectedContainer == null) {
        return <LogoScreen message={"Select a container to see more details"}/>

    }

    return (
        <div className="dark p-4 bg-base-100 shadow-sm rounded-md h-full overflow-x-hidden flex flex-col">
            <div className="flex items-center mb-4">
                <ContainerNameWidget ContainerName={selectedContainer.Names[0].replace("/", "")}/>

                <p className="ml-auto text-sm text-gray-500">Status: {selectedContainer.Status}</p>
            </div>
            <div className="flex mb-4">
                <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Web">
                    <button className="btn btn-square btn-sm mr-3"
                            disabled={!isWeb() && !isContainerRunning}
                            onClick={() => containerOperation("web")}
                    >
                        {loadingButton === 'web' ? <span className="loading loading-bars loading-xs"></span> :
                            <IconWeb className="size-5"/>}
                    </button>
                </div>
                <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Open Terminal">
                    <button className="btn btn-square btn-sm mr-3"
                            disabled={!isContainerRunning}
                            onClick={() => containerOperation("exec")}
                    >
                        {loadingButton == 'exec' ? <span className="loading loading-bars loading-xs"></span> :
                            <IconBxTerminal className="size-5"/>}
                    </button>
                </div>

                <div className="tooltip tooltip-bottom hover:tooltip-open"
                     data-tip={isContainerRunning ? "Stop" : "Start"}>
                    {isContainerRunning ?
                        <button className="btn btn-square btn-sm mr-3"
                                onClick={() => containerOperation("stop")}
                        >
                            {loadingButton == 'stop' ? <span className="loading loading-bars loading-xs"></span> :
                                <IconCircleStop className="size-5"/>}
                        </button>
                        : <button className="btn btn-square btn-sm mr-3"
                                  onClick={() => containerOperation("start")}
                        >
                            {loadingButton == 'start' ? <span className="loading loading-bars loading-xs"></span> :
                                <IconPlayCircle className="size-5"/>}
                        </button>
                    }
                </div>

                <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Restart">
                    <button className="btn btn-square btn-sm mr-3"
                            disabled={!isContainerRunning}
                            onClick={() => containerOperation("restart")}
                    >
                        {loadingButton == 'restart' ? <span className="loading loading-bars loading-xs"></span> :
                            <IconRestart className="size-5"/>}
                    </button>
                </div>

                <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Delete">
                    <button className="btn btn-square btn-sm hover:btn-error mr-3"
                            onClick={() => containerOperation("delete")}
                    >
                        {loadingButton == 'delete' ? <span className="loading loading-bars loading-xs"></span> :
                            <IconBxTrashAlt className="size-5"/>}
                    </button>
                </div>
            </div>
            <div className="flex mb-4 border-b border-base-300">
                <button className={`mr-4 pb-2 ${activeTab === 'LOGS' ? 'border-b-2 border-base-content' : ''}`}
                        onClick={() => setActiveTab('LOGS')}>LOGS
                </button>
                <button className={`pb-2 mr-4 ${activeTab === 'INFO' ? 'border-b-2 border-base-content' : ''}`}
                        onClick={() => setActiveTab('INFO')}>INFO
                </button>
                <button className={`mr-4 pb-2 ${activeTab === 'STATS' ? 'border-b-2 border-base-content' : ''}`}
                        onClick={() => setActiveTab('STATS')}>STATS
                </button>
            </div>
            <div className="flex-1 overflow-auto text-black p-2 rounded">
                {renderContent()}
            </div>
        </div>
    );
}

export default ContainerDetails;
