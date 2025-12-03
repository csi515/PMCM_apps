import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Trash2, FileText, Copy } from 'lucide-react';

function FMEATemplates() {
  const { fmeaTemplates, addDFMEA, currentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    failureMode: '',
    effect: '',
    cause: '',
    severity: 1,
    occurrence: 1,
    detection: 1,
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 템플릿 추가 로직
    alert('템플릿 추가 기능은 구현 중입니다.');
    setIsModalOpen(false);
  };

  const handleUseTemplate = (template: typeof fmeaTemplates[0]) => {
    const rpn = template.severity * template.occurrence * template.detection;
    addDFMEA({
      ...template,
      rpn,
      projectId: 1,
      status: 'draft',
    });
    alert('템플릿이 적용되었습니다.');
  };

  const deleteTemplate = (templateId: number) => {
    if (window.confirm('이 템플릿을 삭제하시겠습니까?')) {
      // 템플릿 삭제 로직
      alert('템플릿 삭제 기능은 구현 중입니다.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">FMEA 템플릿</h2>
          <p className="text-neutral-600">자주 사용하는 FMEA 항목을 템플릿으로 저장</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          템플릿 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fmeaTemplates.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-500">등록된 템플릿이 없습니다.</p>
          </div>
        ) : (
          fmeaTemplates.map((template) => (
            <div key={template.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-neutral-600 mb-2">{template.description}</p>
                  {template.category && (
                    <span className="badge badge-info text-xs">{template.category}</span>
                  )}
                </div>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1 text-neutral-600 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div>
                  <span className="text-neutral-500">고장모드:</span>{' '}
                  <span className="text-neutral-900">{template.failureMode}</span>
                </div>
                <div>
                  <span className="text-neutral-500">영향:</span>{' '}
                  <span className="text-neutral-900">{template.effect}</span>
                </div>
                <div>
                  <span className="text-neutral-500">원인:</span>{' '}
                  <span className="text-neutral-900">{template.cause}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-neutral-500">
                    S: <span className="text-neutral-900">{template.severity}</span>
                  </span>
                  <span className="text-neutral-500">
                    O: <span className="text-neutral-900">{template.occurrence}</span>
                  </span>
                  <span className="text-neutral-500">
                    D: <span className="text-neutral-900">{template.detection}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleUseTemplate(template)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                템플릿 사용
              </button>
            </div>
          ))
        )}
      </div>

      {/* 템플릿 추가 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-medium w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-neutral-900 mb-6">템플릿 추가</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">템플릿 이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">카테고리</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  placeholder="예: 부품, 조립, 표면처리"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">고장모드 *</label>
                  <input
                    type="text"
                    value={formData.failureMode}
                    onChange={(e) => setFormData({ ...formData, failureMode: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">영향 *</label>
                  <input
                    type="text"
                    value={formData.effect}
                    onChange={(e) => setFormData({ ...formData, effect: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">원인 *</label>
                  <input
                    type="text"
                    value={formData.cause}
                    onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">심각도 (S)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">발생도 (O)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.occurrence}
                    onChange={(e) => setFormData({ ...formData, occurrence: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">탐지도 (D)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.detection}
                    onChange={(e) => setFormData({ ...formData, detection: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">추가</button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FMEATemplates;

