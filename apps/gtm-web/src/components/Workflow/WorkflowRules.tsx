import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Trash2, ToggleLeft, ToggleRight, Settings } from 'lucide-react';

function WorkflowRules() {
  const { workflowRules, users } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    entityType: 'DFMEA' as 'DFMEA' | 'PFMEA' | 'PPAP' | 'ECR',
    triggerField: 'rpn',
    triggerOperator: 'greaterThan' as 'equals' | 'greaterThan' | 'lessThan' | 'contains',
    triggerValue: '',
    actionType: 'statusChange' as 'statusChange' | 'assign' | 'notify',
    actionParams: '',
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 워크플로우 규칙 추가 로직
    alert('워크플로우 규칙 추가 기능은 구현 중입니다.');
    setIsModalOpen(false);
  };

  const toggleRule = (ruleId: number) => {
    // 규칙 활성화/비활성화 로직
    alert('규칙 토글 기능은 구현 중입니다.');
  };

  const deleteRule = (ruleId: number) => {
    if (window.confirm('이 워크플로우 규칙을 삭제하시겠습니까?')) {
      // 규칙 삭제 로직
      alert('규칙 삭제 기능은 구현 중입니다.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">워크플로우 규칙</h2>
          <p className="text-neutral-600">자동화된 작업 흐름 규칙 관리</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          규칙 추가
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {workflowRules.length === 0 ? (
          <div className="card text-center py-12">
            <Settings className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-500">등록된 워크플로우 규칙이 없습니다.</p>
          </div>
        ) : (
          workflowRules.map((rule) => (
            <div key={rule.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900">{rule.name}</h3>
                    <span className="badge badge-info">{rule.entityType}</span>
                    {rule.isActive ? (
                      <span className="badge badge-success">활성</span>
                    ) : (
                      <span className="badge badge-secondary">비활성</span>
                    )}
                  </div>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <div>
                      <span className="font-medium">조건:</span>{' '}
                      {rule.triggerCondition.field} {rule.triggerCondition.operator}{' '}
                      {rule.triggerCondition.value}
                    </div>
                    <div>
                      <span className="font-medium">동작:</span>{' '}
                      {rule.actions.map((action, idx) => (
                        <span key={idx}>
                          {action.type}
                          {idx < rule.actions.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="p-2 text-neutral-600 hover:text-primary-600"
                  >
                    {rule.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 text-neutral-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 규칙 추가 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-medium w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-neutral-900 mb-6">워크플로우 규칙 추가</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">규칙 이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">대상 엔티티 *</label>
                <select
                  value={formData.entityType}
                  onChange={(e) => setFormData({ ...formData, entityType: e.target.value as any })}
                  className="input-field"
                >
                  <option value="DFMEA">DFMEA</option>
                  <option value="PFMEA">PFMEA</option>
                  <option value="PPAP">PPAP</option>
                  <option value="ECR">ECR</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">조건 필드</label>
                  <select
                    value={formData.triggerField}
                    onChange={(e) => setFormData({ ...formData, triggerField: e.target.value })}
                    className="input-field"
                  >
                    <option value="rpn">RPN</option>
                    <option value="status">상태</option>
                    <option value="severity">심각도</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">연산자</label>
                  <select
                    value={formData.triggerOperator}
                    onChange={(e) => setFormData({ ...formData, triggerOperator: e.target.value as any })}
                    className="input-field"
                  >
                    <option value="equals">같음</option>
                    <option value="greaterThan">보다 큼</option>
                    <option value="lessThan">보다 작음</option>
                    <option value="contains">포함</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">값</label>
                  <input
                    type="text"
                    value={formData.triggerValue}
                    onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">동작 유형</label>
                <select
                  value={formData.actionType}
                  onChange={(e) => setFormData({ ...formData, actionType: e.target.value as any })}
                  className="input-field"
                >
                  <option value="statusChange">상태 변경</option>
                  <option value="assign">할당</option>
                  <option value="notify">알림 전송</option>
                </select>
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

export default WorkflowRules;

