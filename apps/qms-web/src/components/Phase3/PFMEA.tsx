import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import DataTable from '../Common/DataTable';
import PageHeader from '../Common/PageHeader';
import FormInput from '../Common/FormInput';
import Badge from '../Common/Badge';

interface PFMEAItem {
  id: number;
  process: string;
  failureMode: string;
  effect: string;
  cause: string;
  severity: number;
  occurrence: number;
  detection: number;
  rpn: number;
}

function PFMEA() {
  const [pfmeaList, setPfmeaList] = useState<PFMEAItem[]>([]);
  const [formData, setFormData] = useState({
    process: '',
    failureMode: '',
    effect: '',
    cause: '',
    severity: 1,
    occurrence: 1,
    detection: 1,
  });

  const calculateRPN = (s: number, o: number, d: number): number => s * o * d;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rpn = calculateRPN(formData.severity, formData.occurrence, formData.detection);
    setPfmeaList([...pfmeaList, { id: Date.now(), ...formData, rpn }]);
    setFormData({
      process: '',
      failureMode: '',
      effect: '',
      cause: '',
      severity: 1,
      occurrence: 1,
      detection: 1,
    });
  };

  const getRPNVariant = (rpn: number): 'danger' | 'warning' | 'info' => {
    if (rpn >= 200) return 'danger';
    if (rpn >= 150) return 'warning';
    return 'info';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="PFMEA (공정 FMEA)"
        description="공정 설계 단계의 잠재적 고장 모드 분석"
      />

      <DataTable
        columns={[
          { key: 'process', label: '공정' },
          { key: 'failureMode', label: '고장모드' },
          { key: 'effect', label: '영향' },
          { key: 'cause', label: '원인' },
          { key: 'severity', label: 'S', align: 'center' },
          { key: 'occurrence', label: 'O', align: 'center' },
          { key: 'detection', label: 'D', align: 'center' },
          {
            key: 'rpn',
            label: 'RPN',
            align: 'center',
            render: (item) => (
              <Badge variant={getRPNVariant(item.rpn)}>
                {item.rpn}
              </Badge>
            ),
          },
          {
            key: 'actions',
            label: '작업',
            align: 'right',
            render: (item) => (
              <button
                onClick={() => setPfmeaList(pfmeaList.filter(i => i.id !== item.id))}
                className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ),
          },
        ]}
        data={pfmeaList}
        emptyMessage="등록된 PFMEA 항목이 없습니다."
        className="min-w-[1000px]"
      />

      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">새 항목 추가</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormInput
              label="공정"
              value={formData.process}
              onChange={(e) => setFormData({ ...formData, process: e.target.value })}
              required
            />
            <FormInput
              label="고장모드"
              value={formData.failureMode}
              onChange={(e) => setFormData({ ...formData, failureMode: e.target.value })}
              required
            />
            <FormInput
              label="영향"
              value={formData.effect}
              onChange={(e) => setFormData({ ...formData, effect: e.target.value })}
              required
            />
            <FormInput
              label="원인"
              value={formData.cause}
              onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormInput
              label="심각도 (S)"
              type="number"
              min="1"
              max="10"
              value={formData.severity.toString()}
              onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) || 1 })}
              required
            />
            <FormInput
              label="발생도 (O)"
              type="number"
              min="1"
              max="10"
              value={formData.occurrence.toString()}
              onChange={(e) => setFormData({ ...formData, occurrence: parseInt(e.target.value) || 1 })}
              required
            />
            <FormInput
              label="탐지도 (D)"
              type="number"
              min="1"
              max="10"
              value={formData.detection.toString()}
              onChange={(e) => setFormData({ ...formData, detection: parseInt(e.target.value) || 1 })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">RPN (자동계산)</label>
              <div className="input-field bg-neutral-50 font-semibold text-primary-600">
                {calculateRPN(formData.severity, formData.occurrence, formData.detection)}
              </div>
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

export default PFMEA;

