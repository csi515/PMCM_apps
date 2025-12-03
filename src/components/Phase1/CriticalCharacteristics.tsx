import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../Common/Modal';
import DataTable from '../Common/DataTable';
import PageHeader from '../Common/PageHeader';
import FormInput from '../Common/FormInput';
import FormSelect from '../Common/FormSelect';
import FormTextarea from '../Common/FormTextarea';

interface Characteristic {
  id: number;
  name: string;
  type: 'Product' | 'Process';
  description: string;
}

function CriticalCharacteristics() {
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Product' as 'Product' | 'Process',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCharacteristics([...characteristics, { id: Date.now(), ...formData }]);
    setFormData({ name: '', type: 'Product', description: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="특별 특성 관리"
        description="제품/공정의 특별 특성(Critical Characteristics) 정의"
        action={
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            특성 추가
          </button>
        }
      />

      <DataTable
        columns={[
          { key: 'name', label: '특성명' },
          { key: 'type', label: '유형' },
          { key: 'description', label: '설명' },
        ]}
        data={characteristics}
        emptyMessage="등록된 특별 특성이 없습니다."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="특별 특성 추가"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="특성명"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormSelect
            label="유형"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Product' | 'Process' })}
            options={[
              { value: 'Product', label: '제품 특성' },
              { value: 'Process', label: '공정 특성' },
            ]}
            required
          />
          <FormTextarea
            label="설명"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">추가</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">취소</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CriticalCharacteristics;

