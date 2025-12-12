import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import DataTable from '../Common/DataTable';
import PageHeader from '../Common/PageHeader';
import FormInput from '../Common/FormInput';

interface ControlPlanItem {
  id: number;
  process: string;
  characteristic: string;
  specification: string;
  method: string;
  frequency: string;
}

function ControlPlan() {
  const [controlPlans, setControlPlans] = useState<ControlPlanItem[]>([]);
  const [formData, setFormData] = useState({
    process: '',
    characteristic: '',
    specification: '',
    method: '',
    frequency: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setControlPlans([...controlPlans, { id: Date.now(), ...formData }]);
    setFormData({
      process: '',
      characteristic: '',
      specification: '',
      method: '',
      frequency: '',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="관리 계획서 (Control Plan)"
        description="공정별 관리 방법 및 기준 정의"
      />

      <DataTable
        columns={[
          { key: 'process', label: '공정' },
          { key: 'characteristic', label: '특성' },
          { key: 'specification', label: '규격' },
          { key: 'method', label: '관리 방법' },
          { key: 'frequency', label: '빈도' },
          {
            key: 'actions',
            label: '작업',
            align: 'right',
            render: (item) => (
              <button
                onClick={() => setControlPlans(controlPlans.filter(i => i.id !== item.id))}
                className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ),
          },
        ]}
        data={controlPlans}
        emptyMessage="등록된 관리 계획이 없습니다."
        className="min-w-[800px]"
      />

      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">새 관리 계획 추가</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <FormInput
              label="공정"
              value={formData.process}
              onChange={(e) => setFormData({ ...formData, process: e.target.value })}
              required
            />
            <FormInput
              label="특성"
              value={formData.characteristic}
              onChange={(e) => setFormData({ ...formData, characteristic: e.target.value })}
              required
            />
            <FormInput
              label="규격"
              value={formData.specification}
              onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
              required
            />
            <FormInput
              label="관리 방법"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              required
            />
            <FormInput
              label="빈도"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              placeholder="예: 매일, 매주"
              required
            />
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

export default ControlPlan;

