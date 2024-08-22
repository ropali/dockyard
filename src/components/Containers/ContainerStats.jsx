import React, { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api';
import StatsChart from '../StatsChart';

function ContainerStats({ selectedContainer }) {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (selectedContainer) {
      const unlistenStats = listen('stats', (event) => {
        setStats((prevStats) => [...prevStats, event.payload]);
      });

      invoke('container_stats', { cId: selectedContainer.Id });

      return () => {
        invoke('cancel_stream', {streamType: "stats"});  // Set the cancel flag when unmounting
        unlistenStats.then(f => f());
      };
    }
  }, [selectedContainer]);

  if (stats.length === 0) {
    return <div className="flex h-full w-full items-center justify-center">
      <span className="loading loading-dots loading-lg bg-base-content"></span>
    </div>;
  }

  const cpuData = {
    labels: stats.map((stat) => new Date(stat.read).toLocaleTimeString()),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: stats.map((stat) => (stat.cpu_stats.cpu_usage.total_usage / stat.cpu_stats.system_cpu_usage) * 100),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const memoryData = {
    labels: stats.map((stat) => new Date(stat.read).toLocaleTimeString()),
    datasets: [
      {
        label: 'Memory Usage (MB)',
        data: stats.map((stat) => stat.memory_stats.usage / (1024 * 1024)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const blockIOData = {
    labels: stats.map((stat) => new Date(stat.read).toLocaleTimeString()),
    datasets: [
      {
        label: 'Block Write (MB)',
        data: stats.map((stat) => stat.blkio_stats.io_service_bytes_recursive?.find(io => io.op === 'write').value / (1024 * 1024)),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Block Read (MB)',
        data: stats.map((stat) => stat.blkio_stats.io_service_bytes_recursive?.find(io => io.op === 'read').value / (1024 * 1024)),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      },
    ],
  };

  const networkData = {
    labels: stats.map((stat) => new Date(stat.read).toLocaleTimeString()),
    datasets: [
      {
        label: 'Network Sent (KB)',
        data: stats.map((stat) => stat.networks?.eth0.tx_bytes / 1024),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Network Received (KB)',
        data: stats.map((stat) => stat.networks?.eth0.rx_bytes / 1024),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Container Stats',
      },
    },
  };

  return (
    <div className="stats-container grid grid-cols-2 gap-4">
      <StatsChart title="CPU Usage" data={cpuData} options={options} />
      <StatsChart title="Memory Usage" data={memoryData} options={options} />
      <StatsChart title="Block I/O" data={blockIOData} options={options} />
      <StatsChart title="Network I/O" data={networkData} options={options} />
    </div>
  );
}

export default ContainerStats;
