import { useApp } from '../../contexts/AppContext';
import { TrendingUp, AlertTriangle, CheckCircle, User, Calendar } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { defaultChartOptions, chartColors, getRPNColor } from '../../utils/chartConfig';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { projects, dfmea, currentUser } = useApp();

  // RPN Top 5 계산
  const topRPN = [...dfmea]
    .sort((a, b) => b.rpn - a.rpn)
    .slice(0, 5);

  // Cpk 데이터 (예시)
  const cpkData = [
    { process: '공정 A', cpk: 1.45 },
    { process: '공정 B', cpk: 1.32 },
    { process: '공정 C', cpk: 1.28 },
    { process: '공정 D', cpk: 1.15 },
  ];

  const project = projects[0];

  // 내 작업 (담당자로 지정된 FMEA 항목)
  const myTasks = dfmea.filter(item => item.assignedTo === currentUser?.id);
  const pendingReview = dfmea.filter(item => item.reviewer === currentUser?.id && item.status === 'in_review');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">대시보드</h2>
        <p className="text-neutral-600">프로젝트 현황 및 주요 지표</p>
      </div>

      {/* 프로젝트 진행률 */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">프로젝트 진행률</h3>
          <span className="text-sm text-neutral-500">{project?.name}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">전체 진행률</span>
            <span className="font-semibold text-primary-600">{project?.progress || 0}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${project?.progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 내 작업 */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-neutral-900">내 작업</h3>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-primary-50 rounded-lg">
              <div className="text-sm font-medium text-neutral-700">담당 항목</div>
              <div className="text-2xl font-bold text-primary-600 mt-1">{myTasks.length}개</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-sm font-medium text-neutral-700">검토 대기</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">{pendingReview.length}개</div>
            </div>
            {myTasks.length > 0 && (
              <div className="mt-4">
                <Link to="/phase2/dfmea" className="text-sm text-primary-600 hover:text-primary-700">
                  작업 보기 →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RPN Top 5 */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-neutral-900">RPN Top 5</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-3 text-sm font-medium text-neutral-700">고장모드</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-neutral-700">RPN</th>
                </tr>
              </thead>
              <tbody>
                {topRPN.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="py-2 px-3 text-sm text-neutral-900">{item.failureMode}</td>
                    <td className="py-2 px-3 text-sm text-right">
                      <span className="font-semibold text-red-600">{item.rpn}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cpk 현황 */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-neutral-900">주요 공정 Cpk 현황</h3>
        </div>
        
        <div style={{ height: '200px' }}>
          <Bar
            data={{
              labels: cpkData.map(item => item.process),
              datasets: [
                {
                  label: 'Cpk',
                  data: cpkData.map(item => item.cpk),
                  backgroundColor: cpkData.map(item => 
                    item.cpk >= 1.33 ? chartColors.success :
                    item.cpk >= 1.0 ? chartColors.warning :
                    chartColors.danger
                  ),
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              ...defaultChartOptions,
              plugins: {
                ...defaultChartOptions.plugins,
                legend: {
                  display: false,
                },
              },
              scales: {
                ...defaultChartOptions.scales,
                y: {
                  ...defaultChartOptions.scales?.y,
                  beginAtZero: true,
                  max: 2.0,
                  ticks: {
                    callback: function(value) {
                      return value.toFixed(2);
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* RPN 차트 */}
      {topRPN.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-neutral-900">RPN Top 5 (차트)</h3>
          </div>
          
          <div style={{ height: '200px' }}>
            <Bar
              data={{
                labels: topRPN.map(item => item.failureMode),
                datasets: [
                  {
                    label: 'RPN',
                    data: topRPN.map(item => item.rpn),
                    backgroundColor: topRPN.map(item => getRPNColor(item.rpn)),
                    borderRadius: 8,
                  },
                ],
              }}
              options={{
                ...defaultChartOptions,
                indexAxis: 'y' as const,
                plugins: {
                  ...defaultChartOptions.plugins,
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    ...defaultChartOptions.scales?.x,
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

