import {invoke} from '@tauri-apps/api';
import React, {useEffect, useState} from 'react';
import {Event, listen} from '@tauri-apps/api/event';

import LogsViewer from '../LogsViewer';
import {
    IconBxTerminal,
    IconBxTrashAlt,
    IconCircleStop,
    IconPlayCircle,
    IconRestart,
    IconThreeDots,
    IconWeb,
} from '../../Icons';

import {useContainers} from '../../state/ContainerContext';
import LogoScreen from '../LogoScreen';
import ContainerStats from './ContainerStats';
import JSONSyntaxHighlighter from '../JSONSyntaxHighlighter';
import ContainerNameWidget from './ContainerNameWidget';
import Swal, {SweetAlertResult} from 'sweetalert2';
import toast from '../../utils/toast';
import ContainerProcesses from './ContainerProcesses';
import ContainerEnvVars from './ContainerEnvVars';
import TerminalComponent from '../Terminal';


type LoadingButtonType =
    | 'delete'
    | 'export'
    | 'stop'
    | 'start'
    | 'restart'
    | 'web'
    | 'exec'
    | null;

type Tab = 'LOGS' | 'INFO' | 'STATS' | 'PROCESSES' | 'ENV_VARS' | 'TERMINAL'

type ActionType = 'start' | 'stop' | 'restart' | 'exec' | 'web';

const ContainerDetails: React.FC = () => {
    const {selectedContainer, refreshSelectedContainer, setSelectedContainer} =
        useContainers();

    const [activeTab, setActiveTab] = useState<Tab>('LOGS');

    const [info, setInfo] = useState<any>('');
    const [logs, setLogs] = useState<string[]>([]);

    const [isContainerRunning, setIsContainerRunning] = useState<boolean>(false);

    const [loadingButton, setLoadingButton] = useState<LoadingButtonType>(null);

    // @ts-ignore
    useEffect(() => {
        if (selectedContainer) {
            setIsContainerRunning(
                selectedContainer.Status.toLowerCase().includes('up')
            );

            setLogs([]); // Clear logs before subscribing

            const unlistenLogs = listen<string>('log_chunk', (event: Event<string>) => {
                const sanitizedLog = sanitizeLog(event.payload);
                setLogs((prevLogs) => [...prevLogs, sanitizedLog]);
            });

            invoke('stream_docker_logs', {
                containerName: selectedContainer.getName(),
            });

            return () => {
                unlistenLogs.then((f) => f());
            };
        }
    }, [selectedContainer]);

    useEffect(() => {
        if (activeTab === 'INFO' && selectedContainer) {
            getInfo();
        }
    }, [activeTab, selectedContainer]);

    // @ts-ignore
    useEffect(() => {
        if (selectedContainer) {
            const intervalId = setInterval(() => {
                refreshSelectedContainer();
            }, 60000); // 60000 milliseconds = 1 minute

            return () => {
                clearInterval(intervalId);
                invoke('cancel_stream', {streamType: 'logs'});
            };
        }
    }, [selectedContainer]);

    function getInfo() {
        if (!selectedContainer) return;

        invoke('fetch_container_info', {cId: selectedContainer.Id})
            .then((info) => {
                setInfo(info);
                console.log('Fetched container info:', info);
            })
            .catch((error) => {
                console.error('Error fetching container info:', error);
            });
    }

    function sanitizeLog(log: string): string {
        return log.replace(/[\x00-\x1F\x7F]/g, '');
    }

    const isWeb = (): boolean => {
        return (
            selectedContainer?.Ports != null &&
            selectedContainer.Ports.length > 0 &&
            selectedContainer.Ports[0].PublicPort !== null
        );
    };

    // @ts-ignore
    const deleteContainer = async () => {
        let result: SweetAlertResult<any> = await Swal.fire({
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
                <span class="font-bold">Delete Volumes</span>
                <input type="checkbox" checked="checked" class="checkbox" id="delete-vol"/>
              </label>
          </div>
        `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    (document.getElementById('force-delete') as HTMLInputElement).checked,
                    (document.getElementById('delete-vol') as HTMLInputElement).checked,
                ];
            },
            background: 'oklch(var(--b2))',
            customClass: {
                popup: 'text-base-content',
            },
        });

        if (result.isDenied || result.isDismissed) {
            setLoadingButton(null);
            return null;
        }

        setLoadingButton('delete');

        invoke('delete_container', {
            containerName: selectedContainer?.getName(),
            force: result.value[0],
            delVolume: result.value[1],
        })
            .then((res) => {
                if (res) {
                    toast.success(res as string);
                    setSelectedContainer(null);
                }
            })
            .catch((e) => {
                toast.error(e);
            })
            .finally(() => {
                setLoadingButton(null);
            });
    };

    async function containerOperation(actionType: ActionType) {
        setLoadingButton(actionType);

        invoke('container_operation', {
            containerName: selectedContainer?.getName(),
            opType: actionType,
        })
            .then((res) => {
                if (res) {
                    toast.success(res as string);
                    refreshSelectedContainer();
                }
            })
            .catch((e) => {
                toast.error(e);
            })
            .finally(() => {
                setLoadingButton(null);
            });
    }

    const exportContainer = () => {
        setLoadingButton('export');
        invoke('export_container', {
            name: selectedContainer?.getName(),
        })
            .then((res) => {
                if (res) {
                    toast.success(res as string);
                    refreshSelectedContainer();
                }
            })
            .catch((e) => {
                toast.error(e);
            })
            .finally(() => {
                setLoadingButton(null);
            });
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'LOGS':
                return <LogsViewer logs={logs}/>;
            case 'INFO':
                return (
                    <JSONSyntaxHighlighter id="json-pretty" json={info}></JSONSyntaxHighlighter>
                );
            case 'STATS':
                return <ContainerStats selectedContainer={selectedContainer}/>;

            case 'PROCESSES':
                return <ContainerProcesses/>;
            case 'ENV_VARS':
                return <ContainerEnvVars/>;
            case 'TERMINAL':
                return <TerminalComponent/>
            default:
                return null;
        }
    };

    if (selectedContainer == null) {
        return <LogoScreen message={'Select a container to see more details'}/>;
    }

    return (
        <div className="dark p-4 bg-base-100 shadow-sm rounded-md h-full overflow-x-hidden flex flex-col">
            <div className="flex items-center mb-4">
                <ContainerNameWidget/>

                <p className="ml-auto text-sm text-gray-500">
                    Status: {selectedContainer.Status}
                </p>
            </div>
            <div className="flex mb-4">
                <div
                    className="tooltip tooltip-bottom hover:tooltip-open"
                    data-tip="Web"
                >
                    <button
                        className="btn btn-square btn-sm mr-3"
                        disabled={!isWeb() && !isContainerRunning}
                        onClick={() => containerOperation('web')}
                    >
                        {loadingButton === 'web' ? (
                            <span className="loading loading-bars loading-xs"></span>
                        ) : (
                            <IconWeb className="size-5"/>
                        )}
                    </button>
                </div>
                <div
                    className="tooltip tooltip-bottom hover:tooltip-open"
                    data-tip="Open Terminal"
                >
                    <button
                        className="btn btn-square btn-sm mr-3"
                        disabled={!isContainerRunning}
                        onClick={() => containerOperation('exec')}
                    >
                        {loadingButton === 'exec' ? (
                            <span className="loading loading-bars loading-xs"></span>
                        ) : (
                            <IconBxTerminal className="size-5"/>
                        )}
                    </button>
                </div>

                <div
                    className="tooltip tooltip-bottom hover:tooltip-open"
                    data-tip={isContainerRunning ? 'Stop' : 'Start'}
                >
                    {isContainerRunning ? (
                        <button
                            className="btn btn-square btn-sm mr-3"
                            onClick={() => containerOperation('stop')}
                        >
                            {loadingButton === 'stop' ? (
                                <span className="loading loading-bars loading-xs"></span>
                            ) : (
                                <IconCircleStop className="size-5"/>
                            )}
                        </button>
                    ) : (
                        <button
                            className="btn btn-square btn-sm mr-3"
                            onClick={() => containerOperation('start')}
                        >
                            {loadingButton === 'start' ? (
                                <span className="loading loading-bars loading-xs"></span>
                            ) : (
                                <IconPlayCircle className="size-5"/>
                            )}
                        </button>
                    )}
                </div>

                <div
                    className="tooltip tooltip-bottom hover:tooltip-open"
                    data-tip="Restart"
                >
                    <button
                        className="btn btn-square btn-sm mr-3"
                        disabled={!isContainerRunning}
                        onClick={() => containerOperation('restart')}
                    >
                        {loadingButton === 'restart' ? (
                            <span className="loading loading-bars loading-xs"></span>
                        ) : (
                            <IconRestart className="size-5"/>
                        )}
                    </button>
                </div>

                <div
                    className="tooltip tooltip-bottom hover:tooltip-open"
                    data-tip="Delete"
                >
                    <button
                        className="btn btn-square btn-sm hover:btn-error mr-3"
                        onClick={() => deleteContainer()}
                    >
                        {loadingButton === 'delete' ? (
                            <span className="loading loading-bars loading-xs"></span>
                        ) : (
                            <IconBxTrashAlt className="size-5"/>
                        )}
                    </button>
                </div>

                <div className="dropdown dropdown-bottom">
                    {loadingButton === 'export' ? (
                        <button className="btn btn-square btn-sm mr-3">
                            <span className="loading loading-bars loading-xs"></span>
                        </button>
                    ) : (
                        <>
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-square btn-sm mr-3"
                            >
                                <IconThreeDots className="size-5"/>
                            </div>

                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                            >
                                <li>
                                    <a onClick={() => exportContainer()}>Export Container</a>
                                </li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
            <div className="flex mb-4 border-b border-base-300">
                <button
                    className={`mr-4 pb-2 ${activeTab === 'LOGS' ? 'border-b-2 border-base-content' : ''
                    }`}
                    onClick={() => setActiveTab('LOGS')}
                >
                    LOGS
                </button>
                <button
                    className={`pb-2 mr-4 ${activeTab === 'INFO' ? 'border-b-2 border-base-content' : ''
                    }`}
                    onClick={() => setActiveTab('INFO')}
                >
                    INFO
                </button>
                <button
                    className={`mr-4 pb-2 ${activeTab === 'STATS' ? 'border-b-2 border-base-content' : ''
                    }`}
                    onClick={() => setActiveTab('STATS')}
                >
                    STATS
                </button>
                <button
                    className={`mr-4 pb-2 ${activeTab === 'PROCESSES' ? 'border-b-2 border-base-content' : ''
                    }`}
                    onClick={() => setActiveTab('PROCESSES')}
                >
                    PROCESSES
                </button>
                <button
                    className={`mr-4 pb-2 ${activeTab === 'ENV_VARS' ? 'border-b-2 border-base-content' : ''
                    }`}
                    onClick={() => setActiveTab('ENV_VARS')}
                >
                    ENV VARS
                </button>
                <button
                    className={`mr-4 pb-2 relative ${activeTab === 'TERMINAL' ? 'border-b-2 border-base-content' : ''}`}
                    onClick={() => setActiveTab('TERMINAL')}>
                    TERMINAL
                    <span
                        className="absolute -top-2 -right-4 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold leading-none text-white bg-blue-600 rounded">BETA</span>
                </button>
            </div>
            <div className="flex-1 overflow-auto text-black p-2 rounded">
                {renderContent()}
            </div>
        </div>
    );
};

export default ContainerDetails;
