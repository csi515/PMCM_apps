import { useApp } from '../../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

function Statistics() {
  const { dfmea, ecr, ppap } = useApp();

  // RPN 분포 데이터
  const rpnDistribution = [
    { range: '0-50', count: dfmea.filter(item => item.rpn <= 50).length },
    { range: '51-100', count: dfmea.filter(item => item.rpn > 50 && item.rpn <= 100).length },
    { range: '101-150', count: dfmea.filter(item => item.rpn > 100 && item.rpn <= 150).length },
    { range: '151-200', count: dfmea.filter(item => item.rpn > 150 && item.rpn <= 200).length },
    { range: '200+', count: dfmea.filter(item => item.rpn > 200).length },
  ];

  // 상태별 분포
  const statusData = [
    { name: '초안', value: dfmea.filter(item => item.status === 'draft').length },
    { name: '검토중', value: dfmea.filter(item => item.status === 'in_review').length },
    { name: '승인', value: dfmea.filter(item => item.status === 'approved').length },
    { name: '반려', value: dfmea.filter(item => item.status === 'rejected').length },
  ];

  const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#ef4444'];

  // 심각도별 분포
  const severityData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => ({
    level,
    count: dfmea.filter(item => item.severity === level).length,
  }));

  // ECR 상태별 분포
  const ecrStatusData = [
    { name: '대기', value: ecr.filter(item => item.status === 'pending').length },
    { name: '승인', value: ecr.filter(item => item.status === 'approved').length },
    { name: '반려', value: ecr.filter(item => item.status === 'rejected').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">통계 분석</h2>
        <p className="text-neutral-600">데이터 분석 및 시각화</p>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <div className="text-sm text-neutral-600">전체 FMEA 항목</div>
          </div>
          <div className="text-3xl font-bold text-neutral-900">{dfmea.length}</div>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div className="text-sm text-neutral-600">고위험 항목</div>
          </div>
          <div className="text-3xl font-bold text-yellow-600">
            {dfmea.filter(item => item.rpn > 100).length}
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="text-sm text-neutral-600">승인 완료</div>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {dfmea.filter(item => item.status === 'approved').length}
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-neutral-600">평균 RPN</div>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {dfmea.length > 0
              ? (dfmea.reduce((sum, item) => sum + item.rpn, 0) / dfmea.length).toFixed(1)
              : '0'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RPN 분포 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">RPN 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rpnDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 상태별 분포 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">상태별 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 심각도별 분포 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">심각도별 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="level" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ECR 상태 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">ECR 상태 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ecrStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {ecrStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Statistics;

