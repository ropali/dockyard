import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StatsChartProps {
  title: string;
  data: any;
  options: any;
}

const StatsChart: React.FC<StatsChartProps> = ({ title, data, options }) => {
  return (
    <div className="chart-container text-base-content">
      <h3>{title}</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default StatsChart;
