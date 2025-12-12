import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { PPAP, PPAPDocument, DataVisibility } from '../../types';
import Modal from '../Common/Modal';
import FormSelect from '../Common/FormSelect';
import DocumentManager from '../Common/DocumentManager';
import { getMissingRequiredDocuments } from '../../utils/ppapStandards';

interface PPAPModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPPAP?: PPAP | null;
}

function PPAPModal({ isOpen, onClose, editingPPAP }: PPAPModalProps) {
  const { addPPAP, updatePPAP, projects, currentUser } = useApp();
  const [formData, setFormData] = useState({
    projectId: undefined as number | undefined,
    visibility: 'project' as DataVisibility,
    documents: [] as PPAPDocument[],
  });

  useEffect(() => {
    if (editingPPAP) {
      setFormData({
        projectId: editingPPAP.projectId,
        visibility: editingPPAP.visibility || 'project',
        documents: editingPPAP.documents || [],
      });
    } else {
      setFormData({
        projectId: undefined,
        visibility: 'project',
        documents: [],
      });
    }
  }, [editingPPAP, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectId) {
      alert('프로젝트를 선택해주세요.');
      return;
    }

    const missingRequired = getMissingRequiredDocuments(formData.documents);
    if (missingRequired.length > 0) {
      const confirmSubmit = window.confirm(
        `필수 문서가 누락되었습니다: ${missingRequired.map(type => type).join(', ')}\n그래도 제출하시겠습니까?`
      );
      if (!confirmSubmit) return;
    }

    if (editingPPAP) {
      updatePPAP({
        id: editingPPAP.id,
        ...formData,
      });
    } else {
      addPPAP({
        projectId: formData.projectId,
        visibility: formData.visibility,
        documents: formData.documents,
      });
    }
    
    onClose();
  };

  const handleAddDocument = (doc: Omit<PPAPDocument, 'uploadedAt' | 'uploadedBy'>) => {
    setFormData({
      ...formData,
      documents: [
        ...formData.documents,
        {
          ...doc,
          uploadedAt: new Date().toISOString(),
          uploadedBy: currentUser?.id,
        },
      ],
    });
  };

  const handleUpdateDocument = (index: number, doc: Partial<PPAPDocument>) => {
    const updated = [...formData.documents];
    updated[index] = { ...updated[index], ...doc };
    setFormData({
      ...formData,
      documents: updated,
    });
  };

  const handleDeleteDocument = (index: number) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index),
    });
  };

  const canEdit = !editingPPAP || 
    (editingPPAP.status === 'pending' && 
     (editingPPAP.submittedBy === currentUser?.id || currentUser?.role === 'ADMIN'));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPPAP ? 'PPAP 수정' : 'PPAP 등록'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-neutral-900">기본 정보</h4>
          
          <FormSelect
            label="프로젝트"
            value={formData.projectId || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectId: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            options={[
              { value: '', label: '프로젝트 선택' },
              ...projects.map(p => ({ value: p.id.toString(), label: p.name })),
            ]}
            required
            disabled={!!editingPPAP || !canEdit}
          />
          
          <FormSelect
            label="가시성"
            value={formData.visibility}
            onChange={(e) =>
              setFormData({
                ...formData,
                visibility: e.target.value as DataVisibility,
              })
            }
            options={[
              { value: 'personal', label: '개인' },
              { value: 'department', label: '부서' },
              { value: 'project', label: '프로젝트' },
              { value: 'public', label: '전체' },
            ]}
            disabled={!canEdit}
          />
        </div>

        {/* 문서 관리 */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-neutral-900">제출 문서</h4>
          <DocumentManager
            documents={formData.documents}
            onAdd={canEdit ? handleAddDocument : undefined}
            onUpdate={canEdit ? handleUpdateDocument : undefined}
            onDelete={canEdit ? handleDeleteDocument : undefined}
            readOnly={!canEdit}
            canEdit={canEdit}
            showRequiredChecklist={true}
          />
        </div>

        {/* 버튼 */}
        {canEdit && (
          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <button type="submit" className="btn-primary flex-1">
              {editingPPAP ? '수정' : '등록'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              취소
            </button>
          </div>
        )}
        {!canEdit && (
          <div className="pt-4 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 text-center">
              {editingPPAP?.status === 'approved' || editingPPAP?.status === 'rejected'
                ? '승인되거나 반려된 PPAP는 수정할 수 없습니다.'
                : '수정 권한이 없습니다.'}
            </p>
            <button type="button" onClick={onClose} className="btn-secondary w-full mt-4">
              닫기
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
}

export default PPAPModal;

