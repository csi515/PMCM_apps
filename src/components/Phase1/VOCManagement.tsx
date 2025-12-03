import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../Common/Modal';
import DataTable from '../Common/DataTable';
import Badge from '../Common/Badge';
import PageHeader from '../Common/PageHeader';
import FormInput from '../Common/FormInput';
import FormTextarea from '../Common/FormTextarea';
import FormSelect from '../Common/FormSelect';

interface VOCItem {
  id: number;
  source: string;
  content: string;
  priority: 'High' | 'Medium' | 'Low';
}

function VOCManagement() {
  const [vocList, setVocList] = useState<VOCItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    content: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVocList([...vocList, { id: Date.now(), ...formData }]);
    setFormData({ source: '', content: '', priority: 'Medium' });
    setIsModalOpen(false);
  };

  const getPriorityVariant = (priority: 'High' | 'Medium' | 'Low'): 'danger' | 'warning' | 'info' => {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="VOC 관리"
        description="고객의 목소리(Voice of Customer) 관리"
        action={
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            VOC 추가
          </button>
        }
      />

      <DataTable
        columns={[
          {
            key: 'source',
            label: '출처',
          },
          {
            key: 'content',
            label: '내용',
          },
          {
            key: 'priority',
            label: '우선순위',
            render: (voc) => (
              <Badge variant={getPriorityVariant(voc.priority)}>
                {voc.priority}
              </Badge>
            ),
          },
        ]}
        data={vocList}
        emptyMessage="등록된 VOC가 없습니다."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="VOC 추가"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="출처"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            required
          />
          <FormTextarea
            label="내용"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            required
          />
          <FormSelect
            label="우선순위"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
            options={[
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' },
            ]}
            required
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

export default VOCManagement;

