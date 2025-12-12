import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 기본 차트 옵션
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          size: 12,
          family: "'Inter', sans-serif",
        },
        padding: 12,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold' as const,
      },
      bodyFont: {
        size: 12,
      },
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
  },
};

// Xbar-R 관리도 전용 설정
export const xbarRChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
    title: {
      display: true,
      text: 'Xbar-R 관리도',
      font: {
        size: 16,
        weight: 'bold' as const,
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: '샘플 번호',
      },
      grid: {
        display: false,
      },
    },
    y: {
      title: {
        display: true,
        text: '측정값',
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
    },
    line: {
      tension: 0.1,
    },
  },
};

// 색상 팔레트
export const chartColors = {
  primary: '#0ea5e9',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
};

// RPN 차트용 색상 (위험도에 따른 그라데이션)
export const getRPNColor = (rpn: number): string => {
  if (rpn >= 200) return chartColors.danger;
  if (rpn >= 150) return chartColors.warning;
  if (rpn >= 100) return chartColors.info;
  return chartColors.success;
};

