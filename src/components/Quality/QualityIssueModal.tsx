import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { QualityIssue } from '../../types';
import Modal from '../Common/Modal';
import FormInput from '../Common/FormInput';
import FormTextarea from '../Common/FormTextarea';
import FormSelect from '../Common/FormSelect';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

interface QualityIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingIssue?: QualityIssue | null;
}

function QualityIssueModal({ isOpen, onClose, editingIssue }: QualityIssueModalProps) {
  const { addQualityIssue, updateQualityIssue, projects, users, dfmea, ecr, currentUser } = useApp();
  const [expandedEightD, setExpandedEightD] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'defect' as QualityIssue['category'],
    priority: 'medium' as QualityIssue['priority'],
    severity: 5,
    assignedTo: undefined as number | undefined,
    projectId: undefined as number | undefined,
    relatedFMEAId: undefined as number | undefined,
    relatedECRId: undefined as number | undefined,
    dueDate: '',
    fileLinks: [] as string[],
    tags: '',
    visibility: 'department' as QualityIssue['visibility'],
    useEightD: false,
    eightD: {
      d1Team: [] as number[],
      d2Problem: '',
      d3Containment: '',
      d4RootCause: '',
      d5CorrectiveAction: '',
      d6Implementation: '',
      d7Prevention: '',
      d8Closure: '',
    },
  });

  const [newFileLink, setNewFileLink] = useState('');

  useEffect(() => {
    if (editingIssue) {
      setFormData({
        title: editingIssue.title,
        description: editingIssue.description,
        category: editingIssue.category,
        priority: editingIssue.priority,
        severity: editingIssue.severity,
        assignedTo: editingIssue.assignedTo,
        projectId: editingIssue.projectId,
        relatedFMEAId: editingIssue.relatedFMEAId,
        relatedECRId: editingIssue.relatedECRId,
        dueDate: editingIssue.dueDate || '',
        fileLinks: editingIssue.fileLinks || [],
        tags: editingIssue.tags?.join(', ') || '',
        visibility: editingIssue.visibility || 'department',
        useEightD: editingIssue.useEightD,
        eightD: editingIssue.eightD || {
          d1Team: [],
          d2Problem: '',
          d3Containment: '',
          d4RootCause: '',
          d5CorrectiveAction: '',
          d6Implementation: '',
          d7Prevention: '',
          d8Closure: '',
        },
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'defect',
        priority: 'medium',
        severity: 5,
        assignedTo: undefined,
        projectId: undefined,
        relatedFMEAId: undefined,
        relatedECRId: undefined,
        dueDate: '',
        fileLinks: [],
        tags: '',
        visibility: 'department',
        useEightD: false,
        eightD: {
          d1Team: [],
          d2Problem: '',
          d3Containment: '',
          d4RootCause: '',
          d5CorrectiveAction: '',
          d6Implementation: '',
          d7Prevention: '',
          d8Closure: '',
        },
      });
    }
  }, [editingIssue, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const issueData = {
      ...formData,
      tags: tagsArray,
      eightD: formData.useEightD ? formData.eightD : undefined,
    };

    if (editingIssue) {
      updateQualityIssue({
        id: editingIssue.id,
        ...issueData,
      });
    } else {
      addQualityIssue(issueData);
    }
    
    onClose();
  };

  const toggleEightDSection = (section: string) => {
    setExpandedEightD(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const addFileLink = () => {
    if (newFileLink.trim()) {
      setFormData({
        ...formData,
        fileLinks: [...formData.fileLinks, newFileLink.trim()],
      });
      setNewFileLink('');
    }
  };

  const removeFileLink = (index: number) => {
    setFormData({
      ...formData,
      fileLinks: formData.fileLinks.filter((_, i) => i !== index),
    });
  };

  const toggleTeamMember = (userId: number) => {
    setFormData({
      ...formData,
      eightD: {
        ...formData.eightD,
        d1Team: formData.eightD.d1Team.includes(userId)
          ? formData.eightD.d1Team.filter(id => id !== userId)
          : [...formData.eightD.d1Team, userId],
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingIssue ? '이슈 수정' : '이슈 등록'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-neutral-900">기본 정보</h4>
          
          <FormInput
            label="제목"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <FormTextarea
            label="설명"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              label="카테고리"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as QualityIssue['category'] })}
              options={[
                { value: 'defect', label: '불량' },
                { value: 'process', label: '공정' },
                { value: 'design', label: '설계' },
                { value: 'measurement', label: '측정' },
                { value: 'supplier', label: '공급사' },
                { value: 'other', label: '기타' },
              ]}
              required
            />
            
            <FormSelect
              label="우선순위"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as QualityIssue['priority'] })}
              options={[
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              required
            />
            
            <FormInput
              label="심각도 (1-10)"
              type="number"
              min="1"
              max="10"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) || 5 })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="담당자"
              value={formData.assignedTo || ''}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value ? parseInt(e.target.value) : undefined })}
              options={[
                { value: '', label: '선택 안함' },
                ...users.map(u => ({ value: u.id.toString(), label: `${u.name} (${u.dept})` })),
              ]}
            />
            
            <FormSelect
              label="프로젝트"
              value={formData.projectId || ''}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value ? parseInt(e.target.value) : undefined })}
              options={[
                { value: '', label: '선택 안함' },
                ...projects.map(p => ({ value: p.id.toString(), label: p.name })),
              ]}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="관련 FMEA"
              value={formData.relatedFMEAId || ''}
              onChange={(e) => setFormData({ ...formData, relatedFMEAId: e.target.value ? parseInt(e.target.value) : undefined })}
              options={[
                { value: '', label: '선택 안함' },
                ...dfmea.map(f => ({ value: f.id.toString(), label: f.failureMode })),
              ]}
            />
            
            <FormSelect
              label="관련 ECR"
              value={formData.relatedECRId || ''}
              onChange={(e) => setFormData({ ...formData, relatedECRId: e.target.value ? parseInt(e.target.value) : undefined })}
              options={[
                { value: '', label: '선택 안함' },
                ...ecr.map(e => ({ value: e.id.toString(), label: e.title })),
              ]}
            />
          </div>
          
          <FormInput
            label="마감일"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          
          <FormInput
            label="태그 (쉼표로 구분)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="예: 표면처리, 양산"
            hint="여러 태그는 쉼표로 구분하세요"
          />
          
          <FormSelect
            label="가시성"
            value={formData.visibility || 'department'}
            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as QualityIssue['visibility'] })}
            options={[
              { value: 'personal', label: '개인' },
              { value: 'department', label: '부서' },
              { value: 'project', label: '프로젝트' },
              { value: 'public', label: '전체' },
            ]}
          />
        </div>

        {/* 파일 링크 */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-neutral-900">파일 링크</h4>
          <div className="flex gap-2">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="파일 URL 입력"
              value={newFileLink}
              onChange={(e) => setNewFileLink(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFileLink();
                }
              }}
            />
            <button
              type="button"
              onClick={addFileLink}
              className="btn-secondary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> 추가
            </button>
          </div>
          {formData.fileLinks.length > 0 && (
            <div className="space-y-1">
              {formData.fileLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-neutral-50 rounded">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm text-primary-600 hover:underline truncate"
                  >
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeFileLink(index)}
                    className="p-1 hover:bg-neutral-200 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 8D Report */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useEightD"
              checked={formData.useEightD}
              onChange={(e) => setFormData({ ...formData, useEightD: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="useEightD" className="text-sm font-medium text-neutral-900">
              8D Report 사용
            </label>
          </div>

          {formData.useEightD && (
            <div className="border border-neutral-200 rounded-lg p-4 space-y-4">
              <h4 className="text-lg font-semibold text-neutral-900">8D Report</h4>
              
              {/* D1: 팀 구성 */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleEightDSection('d1')}
                  className="flex items-center justify-between w-full p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100"
                >
                  <span className="font-medium">D1: 팀 구성</span>
                  {expandedEightD.includes('d1') ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {expandedEightD.includes('d1') && (
                  <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                    <div className="space-y-2">
                      {users.map(user => (
                        <label key={user.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.eightD.d1Team.includes(user.id)}
                            onChange={() => toggleTeamMember(user.id)}
                            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm">{user.name} ({user.dept})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* D2: 문제 설명 */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleEightDSection('d2')}
                  className="flex items-center justify-between w-full p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100"
                >
                  <span className="font-medium">D2: 문제 설명</span>
                  {expandedEightD.includes('d2') ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {expandedEightD.includes('d2') && (
                  <div className="mt-2">
                    <FormTextarea
                      label=""
                      value={formData.eightD.d2Problem}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          eightD: { ...formData.eightD, d2Problem: e.target.value },
                        })
                      }
                      rows={3}
                      placeholder="문제를 상세히 설명하세요"
                    />
                  </div>
                )}
              </div>

              {/* D3~D8도 동일한 패턴으로 구현 */}
              {['d3', 'd4', 'd5', 'd6', 'd7', 'd8'].map((step, index) => {
                const stepLabels = [
                  'D3: 임시조치',
                  'D4: 근본원인 분석',
                  'D5: 영구조치',
                  'D6: 조치 실행',
                  'D7: 재발방지',
                  'D8: 팀 축하 및 종료',
                ];
                const stepKeys: (keyof typeof formData.eightD)[] = [
                  'd3Containment',
                  'd4RootCause',
                  'd5CorrectiveAction',
                  'd6Implementation',
                  'd7Prevention',
                  'd8Closure',
                ];
                const stepKey = stepKeys[index];

                return (
                  <div key={step}>
                    <button
                      type="button"
                      onClick={() => toggleEightDSection(step)}
                      className="flex items-center justify-between w-full p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100"
                    >
                      <span className="font-medium">{stepLabels[index]}</span>
                      {expandedEightD.includes(step) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    {expandedEightD.includes(step) && (
                      <div className="mt-2">
                        <FormTextarea
                          label=""
                          value={formData.eightD[stepKey] || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              eightD: { ...formData.eightD, [stepKey]: e.target.value },
                            })
                          }
                          rows={3}
                          placeholder={`${stepLabels[index]} 내용을 입력하세요`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          <button type="submit" className="btn-primary flex-1">
            {editingIssue ? '수정' : '등록'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            취소
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default QualityIssueModal;

