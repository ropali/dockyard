import { invoke } from '@tauri-apps/api';
import React, { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

import LogsViewer from '../LogsViewer';
import StatsChart from '../StatsChart';
import { IconDocker, IconBxTrashAlt, IconPlayCircle, IconBxTerminal, IconRestart, IconWeb, IconCircleStop } from '../../Icons';

import { toast } from 'react-toastify';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/acai.css';
import { useContainers } from '../../state/ContainerContext';
import LogoScreen from '../LogoScreen';
import ContainerStats from './ContainerStats';

function ContainerDetails() {

  const { selectedContainer, setSelectedContainer } = useContainers()

  const [activeTab, setActiveTab] = useState('LOGS');
  const [info, setInfo] = useState("");
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([]);
  const [isContainerRunning, setIsContainerRunning] = useState(false)

  useEffect(() => {
    if (selectedContainer) {

      setIsContainerRunning(selectedContainer.Status.toLowerCase().includes("up"))

      setLogs([]); // Clear logs before subscribing

      const unlistenLogs = listen('log_chunk', (event) => {

        const sanitizedLog = sanitizeLog(event.payload);
        setLogs((prevLogs) => [...prevLogs, sanitizedLog]);
      });



      invoke('stream_docker_logs', { containerName: selectedContainer.Names[0].replace("/", "") });

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
        refreshSelectContainer();
      }, 60000); // 60000 milliseconds = 1 minute

      // Clean up function to clear the interval when the component unmounts
      // or when selectedContainer changes
      return () => {
        clearInterval(intervalId);
        invoke('cancel_stream', { streamType: "logs" });
      };
    }
  }, [selectedContainer]);



  function getInfo() {
    invoke('fetch_container_info', { cId: selectedContainer.Id }).then((info) => {
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

  function refreshSelectContainer() {
    invoke('get_container', { cId: selectedContainer.Id }).then((res) => {

      if (res) {
        setSelectedContainer(res)
      }

    })
  }

  function containerOperation(actionType) {
    invoke('container_operation', { containerName: selectedContainer.Names[0].replace("/", ""), opType: actionType }).then((res) => {
      if (res) {
        toast(res);

        refreshSelectContainer()
      }
    }).catch((e) => {
      toast.error(e);
    });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'LOGS':
        return <LogsViewer logs={logs} />;
      case 'INFO':
        return <JSONPretty id="json-pretty" data={info}></JSONPretty>;
      case 'STATS':
        return <ContainerStats selectedContainer={selectedContainer} />;
      default:
        return null;
    }
  };

  if (selectedContainer == null) {
    return <LogoScreen message={"Select a container to see more details"} />

  }

  return (
    <div className="dark p-4 bg-base-100 shadow-sm rounded-md h-full overflow-x-hidden flex flex-col">
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-bold">{selectedContainer.Names[0].slice(1)}</h1>
        <p className="ml-auto text-sm text-gray-500">Status: {selectedContainer.Status}</p>
      </div>
      <div className="flex mb-4">
        <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Web">
          <button className="btn btn-square btn-sm mr-3"
            disabled={!isWeb() && !isContainerRunning}
            onClick={() => containerOperation("web")}
          >
            <IconWeb className="size-5" />
          </button>
        </div>
        <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Open Terminal">
          <button className="btn btn-square btn-sm mr-3"
            disabled={!isContainerRunning}
            onClick={() => containerOperation("exec")}
          >
            <IconBxTerminal className="size-5" />
          </button>
        </div>

        <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip={isContainerRunning ? "Stop" : "Start"}>
          {isContainerRunning ?
            <button className="btn btn-square btn-sm mr-3"
              onClick={() => containerOperation("stop")}
            >
              <IconCircleStop className="size-5" />
            </button>
            : <button className="btn btn-square btn-sm mr-3"
              onClick={() => containerOperation("start")}
            >
              <IconPlayCircle className="size-5" />
            </button>
          }
        </div>

        <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Restart">
          <button className="btn btn-square btn-sm mr-3"
            disabled={!isContainerRunning}
            onClick={() => containerOperation("restart")}
          >
            <IconRestart className="size-5" />
          </button>
        </div>

        <div className="tooltip tooltip-bottom hover:tooltip-open" data-tip="Delete">
          <button className="btn btn-square btn-sm hover:btn-error mr-3"
            onClick={() => containerOperation("delete")}
          >
            <IconBxTrashAlt className="size-5" />
          </button>
        </div>
      </div>
      <div className="flex mb-4 border-b border-base-300">
        <button className={`mr-4 pb-2 ${activeTab === 'LOGS' ? 'border-b-2 border-base-content' : ''}`} onClick={() => setActiveTab('LOGS')}>LOGS</button>
        <button className={`pb-2 mr-4 ${activeTab === 'INFO' ? 'border-b-2 border-base-content' : ''}`} onClick={() => setActiveTab('INFO')}>INFO</button>
        <button className={`mr-4 pb-2 ${activeTab === 'STATS' ? 'border-b-2 border-base-content' : ''}`} onClick={() => setActiveTab('STATS')}>STATS</button>
      </div>
      <div className="flex-1 overflow-auto text-black p-2 rounded">
        {renderContent()}
      </div>
    </div>
  );
}

export default ContainerDetails;
