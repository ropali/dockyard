import React from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ContainerTableSection from '../ContainerTableSection';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);


const Dashboard = () => {
    return (
        <div className="bg-base-100 p-8 h-screen w-screen overflow-y-auto">
            <h1 className="text-4xl font-bold mb-8 ">Dashboard</h1>

            <div className="grid grid-cols-12 gap-8">
                <OverviewSection />
                <ContainerTableSection />
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





// const ContainerTableSection = () => {
//     const containers = [
//         { name: 'focused_lalande', id: '323b03dbc13b', cpu: '0.003%', memory: '62.04 MB / 15.55 GB', netIO: '9.52 KB / 0 B', blockIO: '46.11 MB / 4 KB', pids: 6 },
//         { name: 'my-postgres', id: '48e2dd571d6b', cpu: '-', memory: '-', netIO: '-', blockIO: '-', pids: 0 }
//     ];

//     return (
//         <div className="col-span-12 bg-base-200 p-6 rounded-xl shadow-lg">
//             <h2 className="text-2xl font-semibold mb-6">Stats Monitor</h2>
//             <div className="overflow-x-auto">
//                 <table className="table table-auto w-full text-left whitespace-nowrap">
//                     <thead className="bg-base-300">
//                         <tr>
//                             <th className="p-4">Name</th>
//                             <th className="p-4">Container ID</th>
//                             <th className="p-4">CPU</th>
//                             <th className="p-4">Memory Usage / Limit</th>
//                             <th className="p-4">Net I/O</th>
//                             <th className="p-4">Block I/O</th>
//                             <th className="p-4">PIDs</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {containers.map((container, index) => (
//                             <tr key={index}>
//                                 <td className="p-4 font-medium">{container.name}</td>
//                                 <td className="p-4">{container.id}</td>
//                                 <td className="p-4 text-center">{container.cpu}</td>
//                                 <td className="p-4">{container.memory}</td>
//                                 <td className="p-4">{container.netIO}</td>
//                                 <td className="p-4">{container.blockIO}</td>
//                                 <td className="p-4 text-center">{container.pids}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };






export default Dashboard;