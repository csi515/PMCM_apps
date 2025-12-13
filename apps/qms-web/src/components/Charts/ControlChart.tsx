import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface ControlChartProps {
    title: string;
    dataPoints: number[];
    labels: string[];
    nominal?: number;
    usl?: number;
    lsl?: number;
    ucl?: number;
    lcl?: number;
}

const ControlChart: React.FC<ControlChartProps> = ({
    title,
    dataPoints,
    labels,
    nominal,
    usl,
    lsl,
    ucl,
    lcl
}) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: title,
            },
            annotation: {
                // annotations would go here if using chartjs-plugin-annotation
            }
        },
        scales: {
            y: {
                title: { display: true, text: 'Value' }
            }
        }
    };

    const datasets = [
        {
            label: 'Measurements',
            data: dataPoints,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            pointRadius: 4,
        },
    ];

    // Add Limit Lines if present. We create a constant line for each.
    // Note: For a real app, annotations plugin is better, but simple datasets work for now.
    if (usl !== undefined) {
        datasets.push({
            label: 'USL',
            data: Array(dataPoints.length).fill(usl),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'transparent',
            pointRadius: 0,
            borderDash: [5, 5],
            borderWidth: 2
        } as any);
    }
    if (lsl !== undefined) {
        datasets.push({
            label: 'LSL',
            data: Array(dataPoints.length).fill(lsl),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'transparent',
            pointRadius: 0,
            borderDash: [5, 5],
            borderWidth: 2
        } as any);
    }
    if (nominal !== undefined) {
        datasets.push({
            label: 'Nominal',
            data: Array(dataPoints.length).fill(nominal),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'transparent',
            pointRadius: 0,
            borderWidth: 1
        } as any);
    }

    const data = {
        labels,
        datasets,
    };

    return <Line options={options} data={data} />;
}

export default ControlChart;
