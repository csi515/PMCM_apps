import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface MSAMeasurement {
  id: number;
  part: string;
  operator1: string;
  operator2: string;
  operator3: string;
  trial1: string;
  trial2: string;
  trial3: string;
}

function MSAAnalysis() {
  const [measurements, setMeasurements] = useState<MSAMeasurement[]>([]);
  const [formData, setFormData] = useState({
    part: '',
    operator1: '',
    operator2: '',
    operator3: '',
    trial1: '',
    trial2: '',
    trial3: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMeasurements([...measurements, { id: Date.now(), ...formData }]);
    setFormData({
      part: '',
      operator1: '',
      operator2: '',
      operator3: '',
      trial1: '',
      trial2: '',
      trial3: '',
    });
  };

  // 간단한 %GRR 계산 (예시)
  const calculateGRR = (): { grr: number; ndc: number; status: string } => {
    if (measurements.length === 0) return { grr: 0, ndc: 0, status: '-' };
    
    // 실제로는 ANOVA 기반 계산이 필요하지만, 여기서는 간단한 예시
    const grr = 15.5; // 예시 값
    const ndc = 5; // 예시 값
    const status = grr < 10 ? '합격' : grr < 30 ? '조건부 합격' : '불합격';
    
    return { grr, ndc, status };
  };

  const { grr, ndc, status } = calculateGRR();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">MSA 분석</h2>
        <p className="text-neutral-600">측정 시스템 분석 (Gauge R&R)</p>
      </div>

      {/* 결과 표시 */}
      {measurements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-sm font-medium text-neutral-700 mb-2">%GRR</div>
            <div className={`text-3xl font-bold ${
              grr < 10 ? 'text-green-600' :
              grr < 30 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {grr.toFixed(2)}%
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-neutral-700 mb-2">NDC</div>
            <div className="text-3xl font-bold text-primary-600">{ndc}</div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-neutral-700 mb-2">판정</div>
            <div className={`text-3xl font-bold ${
              status === '합격' ? 'text-green-600' :
              status === '조건부 합격' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {status}
            </div>
          </div>
        </div>
      )}

      {/* 측정 데이터 테이블 */}
      {measurements.length > 0 && (
        <div className="table-container overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="table-header">
              <tr>
                <th className="text-left text-sm font-semibold text-neutral-700">부품</th>
                <th className="text-center text-sm font-semibold text-neutral-700">작업자1</th>
                <th className="text-center text-sm font-semibold text-neutral-700">작업자2</th>
                <th className="text-center text-sm font-semibold text-neutral-700">작업자3</th>
                <th className="text-center text-sm font-semibold text-neutral-700">시행1</th>
                <th className="text-center text-sm font-semibold text-neutral-700">시행2</th>
                <th className="text-center text-sm font-semibold text-neutral-700">시행3</th>
                <th className="text-right text-sm font-semibold text-neutral-700">작업</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((item) => (
                <tr key={item.id} className="table-row">
                  <td className="px-6 py-4 text-sm text-neutral-900">{item.part}</td>
                  <td className="px-6 py-4 text-sm text-center">{item.operator1}</td>
                  <td className="px-6 py-4 text-sm text-center">{item.operator2}</td>
                  <td className="px-6 py-4 text-sm text-center">{item.operator3}</td>
                  <td className="px-6 py-4 text-sm text-center">{item.trial1}</td>
                  <td className="px-6 py-4 text-sm text-center">{item.trial2}</td>
                  <td className="px-6 py-4 text-sm text-center">{item.trial3}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setMeasurements(measurements.filter(i => i.id !== item.id))}
                      className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 입력 폼 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">측정 데이터 입력</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">부품 *</label>
              <input
                type="text"
                value={formData.part}
                onChange={(e) => setFormData({ ...formData, part: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">작업자1</label>
              <input
                type="number"
                step="0.01"
                value={formData.operator1}
                onChange={(e) => setFormData({ ...formData, operator1: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">작업자2</label>
              <input
                type="number"
                step="0.01"
                value={formData.operator2}
                onChange={(e) => setFormData({ ...formData, operator2: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">작업자3</label>
              <input
                type="number"
                step="0.01"
                value={formData.operator3}
                onChange={(e) => setFormData({ ...formData, operator3: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">시행1</label>
              <input
                type="number"
                step="0.01"
                value={formData.trial1}
                onChange={(e) => setFormData({ ...formData, trial1: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">시행2</label>
              <input
                type="number"
                step="0.01"
                value={formData.trial2}
                onChange={(e) => setFormData({ ...formData, trial2: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">시행3</label>
              <input
                type="number"
                step="0.01"
                value={formData.trial3}
                onChange={(e) => setFormData({ ...formData, trial3: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MSAAnalysis;

