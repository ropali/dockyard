import { invoke } from '@tauri-apps/api';
import React, { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event'


import LogsViewer from './LogsViewer';


function DetailsPanel({ selectedContainer }) {
  const [activeTab, setActiveTab] = useState('LOGS');

  const [info, setInfo] = useState("")

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (selectedContainer) {
      setLogs([]); // Clear logs before subscribing

      const unlisten = listen('log_chunk', (event) => {
        console.log("log_chunk", event.payload);

        const sanitizedLog = sanitizeLog(event.payload);
        setLogs((prevLogs) => [...prevLogs, sanitizedLog]);
      });

      invoke('stream_docker_logs', { containerId: selectedContainer.Id });

      return () => {
        unlisten.then(f => f());
      };
    }
    
  }, [selectedContainer]);
  

  function getInfo() {
    invoke('fetch_container_info', { cId: selectedContainer.Id }).then((info) => {
      setInfo(info)
    });
  }

  function sanitizeLog(log) {
    // Remove control characters and non-printable characters
    return log.replace(/[\x00-\x1F\x7F]/g, "");
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'LOGS':
        return <LogsViewer logs={logs}/>
      case 'STATS':
        return <div>Stats content here</div>;
      case 'INFO':
        return <div>{info}</div>;
      default:
        return null;
    }
  };

  if(!selectedContainer) {
    return <div className="text-gray-600 p-4 shadow-sm rounded-md h-full overflow-x-hidden flex flex-col">Select a container to see more details</div>
  }

  return (
    <div className="dark p-4 bg-white shadow-sm rounded-md h-full overflow-x-hidden flex flex-col">
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-bold">{selectedContainer.Names[0].slice(1)}</h1>
        <p className="ml-auto text-sm text-gray-600">Status: {selectedContainer.Status}</p>
      </div>
      <div className="flex mb-4">
        <button className="mx-1 btn btn-primary btn-sm">WEB</button>
        <button className="mx-1 btn btn-primary btn-sm">EXEC</button>
        <button className="mx-1 btn btn-primary btn-sm">START</button>
        <button className="mx-1 btn btn-primary btn-sm">RESTART</button>
        <button className="mx-1 btn btn-error btn-sm">REMOVE</button>
        <button className="mx-1 btn btn-warning btn-sm" onClick={getInfo}>INFO</button>
      </div>
      <div className="flex mb-4 border-b">
        <button className={`mr-4 pb-2 ${activeTab === 'LOGS' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('LOGS')}>LOGS</button>
        <button className={`mr-4 pb-2 ${activeTab === 'STATS' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('STATS')}>STATS</button>
        <button className={`pb-2 ${activeTab === 'INFO' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('INFO')}>INFO</button>
      </div>
      <div className="flex-1 overflow-auto text-white p-2 rounded">
        {renderContent()}
      </div>
    </div>
  );
}

export default DetailsPanel;
