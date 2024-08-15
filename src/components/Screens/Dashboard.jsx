import React from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    return (
        <div className="bg-base-100 p-8 h-screen overflow-y-auto">
            <h1 className="text-4xl font-bold mb-8 ">Dashboard</h1>

            <div className="grid grid-cols-12 gap-8">
                <OverviewSection />
                <ContainerStatsSection />
                <VolumeUsageSection />
                <NetworkStatusSection />
                <RecentLogsSection />
                <ResourceUsageSection />
            </div>
        </div>
    );
};

const OverviewSection = () => {
    const data = [
        { name: 'Running Containers', value: 5, color: '#10B981' },
        { name: 'Stopped Containers', value: 3, color: '#EF4444' },
        { name: 'Volumes', value: 12, color: '#3B82F6' },
        { name: 'Networks', value: 4, color: '#F59E0B' },
    ];

    return (
        <div className="col-span-12 bg-base-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {data.map((item, index) => (
                    <OverviewCard key={index} title={item.name} value={item.value} color={item.color} />
                ))}
            </div>
        </div>
    );
};

const OverviewCard = ({ title, value, color }) => (
    <div className="bg-base-300 p-4 rounded-lg shadow-md border-l-4 transition-all hover:shadow-xl" style={{ borderColor: color }}>
        <h3 className="text-lg font-medium ">{title}</h3>
        <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
    </div>
);

const ContainerStatsSection = () => {
    const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    const cpuData = {
        labels,
        datasets: [
            {
                label: 'CPU Usage (%)',
                data: [65, 58, 80, 75, 90, 70],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
        ],
    };

    const memoryData = {
        labels,
        datasets: [
            {
                label: 'Memory Usage (GB)',
                data: [4, 3, 5, 7, 6, 4],
                backgroundColor: '#10B981',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="col-span-6 bg-base-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 ">Container Stats</h2>
            <div className="space-y-6">
                <div className="h-64">
                    <Line data={cpuData} options={options} />
                </div>
                <div className="h-64">
                    <Bar data={memoryData} options={options} />
                </div>
            </div>
        </div>
    );
};

const VolumeUsageSection = () => {
    const data = {
        labels: ['Used', 'Free'],
        datasets: [
            {
                data: [67, 33],
                backgroundColor: ['#3B82F6', '#E5E7EB'],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="col-span-3 bg-base-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 ">Volume Usage</h2>
            <div className="h-64">
                <Doughnut data={data} options={options} />
            </div>
            <div className="mt-4 text-center">
                <p className="text-lg font-medium ">67% Used</p>
            </div>
        </div>
    );
};

const NetworkStatusSection = () => {
    const data = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [
            {
                label: 'Incoming',
                data: [65, 58, 80, 75, 90, 70],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
            {
                label: 'Outgoing',
                data: [45, 38, 60, 55, 70, 50],
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="col-span-3 bg-base-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 ">Network Status</h2>
            <div className="h-64">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

const RecentLogsSection = () => {
    const logs = [
        { timestamp: "08:00:01", message: "Container 'webapp' started", type: "info" },
        { timestamp: "08:05:22", message: "Network 'bridge' created", type: "success" },
        { timestamp: "08:15:43", message: "Volume 'data' attached to container 'db'", type: "info" },
        { timestamp: "08:30:10", message: "Container 'cache' stopped unexpectedly", type: "error" },
        { timestamp: "08:45:55", message: "Image 'nginx:latest' pulled successfully", type: "success" },
    ];

    return (
        <div className="col-span-12 bg-base-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 ">Recent Logs</h2>
            <div className="bg-gray-900 text-white p-4 rounded-lg h-64 overflow-y-auto">
                {logs.map((log, index) => (
                    <LogItem key={index} {...log} />
                ))}
            </div>
        </div>
    );
};

const ResourceUsageSection = () => {
    const data = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [
            {
                label: 'CPU Usage (%)',
                data: [45, 38, 60, 55, 70, 50],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="col-span-12 bg-base-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 ">Resource Usage</h2>
            <div className="h-64">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

const LogItem = ({ timestamp, message, type }) => {
    const typeColors = {
        info: 'text-blue-400',
        success: 'text-green-400',
        error: 'text-red-400'
    };

    return (
        <div className="mb-2">
            <span className="font-mono text-sm ">{timestamp}</span>{' '}
            <span className={typeColors[type] || 'text-white'}>{message}</span>
        </div>
    );
};

export default Dashboard;