import { useApp } from '../../contexts/AppContext';
import { calculateQualityIssueStats, isIssueOverdue } from '../../utils/qualityIssues';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getChartConfig } from '../../utils/chartConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function QualityIssueStats() {
  const { qualityIssues } = useApp();
  const stats = calculateQualityIssueStats(qualityIssues);

  const statusChartData = {
    labels: ['신규', '조사중', '조치중', '검증중', '해결됨', '종료'],
    datasets: [
      {
        label: '이슈 수',
        data: [
          stats.byStatus.new,
          stats.byStatus.investigating,
          stats.byStatus.in_progress,
          stats.byStatus.verifying,
          stats.byStatus.resolved,
          stats.byStatus.closed,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // new - blue
          'rgba(251, 191, 36, 0.8)', // investigating - yellow
          'rgba(239, 68, 68, 0.8)', // in_progress - red
          'rgba(168, 85, 247, 0.8)', // verifying - purple
          'rgba(34, 197, 94, 0.8)', // resolved - green
          'rgba(107, 114, 128, 0.8)', // closed - gray
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const priorityChartData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        label: '이슈 수',
        data: [
          stats.byPriority.critical,
          stats.byPriority.high,
          stats.byPriority.medium,
          stats.byPriority.low,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)', // critical - red
          'rgba(251, 146, 60, 0.8)', // high - orange
          'rgba(251, 191, 36, 0.8)', // medium - yellow
          'rgba(34, 197, 94, 0.8)', // low - green
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">전체 이슈</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">진행중</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">해결됨</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">지연</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">상태별 분포</h3>
          <div className="h-64">
            <Bar data={statusChartData} options={getChartConfig('bar', '상태별 이슈 분포')} />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">우선순위별 분포</h3>
          <div className="h-64">
            <Bar data={priorityChartData} options={getChartConfig('bar', '우선순위별 이슈 분포')} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QualityIssueStats;

