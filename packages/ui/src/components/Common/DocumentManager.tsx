import { useState } from 'react';
import { PPAPDocument, PPAPDocumentType } from '../../types';
import { Plus, Trash2, Edit2, Link as LinkIcon, CheckCircle, XCircle } from 'lucide-react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTextarea from './FormTextarea';
import ConfirmModal from './ConfirmModal';
import Badge from './Badge';
import {
  getPPAPDocumentTypeLabel,
  getPPAPDocumentTypeIcon,
  getRequiredDocuments,
  isDocumentRequired,
  getDocumentTypeOptions,
  getMissingRequiredDocuments,
} from '../../utils/ppapStandards';

interface DocumentManagerProps {
  documents: PPAPDocument[];
  onAdd?: (doc: Omit<PPAPDocument, 'uploadedAt' | 'uploadedBy'>) => void;
  onUpdate?: (index: number, doc: Partial<PPAPDocument>) => void;
  onDelete?: (index: number) => void;
  readOnly?: boolean;
  canEdit?: boolean;
  showRequiredChecklist?: boolean;
}

function DocumentManager({
  documents,
  onAdd,
  onUpdate,
  onDelete,
  readOnly = false,
  canEdit = true,
  showRequiredChecklist = true,
}: DocumentManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  
  const [newDocument, setNewDocument] = useState<Omit<PPAPDocument, 'uploadedAt' | 'uploadedBy'>>({
    type: 'DFMEA',
    link: '',
    description: '',
    isRequired: false,
  });

  const [editDocument, setEditDocument] = useState<Partial<PPAPDocument>>({});

  const documentTypeOptions = getDocumentTypeOptions();
  const requiredTypes = getRequiredDocuments();
  const missingRequired = getMissingRequiredDocuments(documents);

  const handleAdd = () => {
    if (!newDocument.link.trim()) {
      alert('문서 링크를 입력해주세요.');
      return;
    }
    if (onAdd) {
      onAdd({
        ...newDocument,
        isRequired: isDocumentRequired(newDocument.type),
      });
      setNewDocument({
        type: 'DFMEA',
        link: '',
        description: '',
        isRequired: false,
      });
      setIsAdding(false);
    }
  };

  const handleUpdate = (index: number) => {
    if (onUpdate) {
      onUpdate(index, editDocument);
      setEditingIndex(null);
      setEditDocument({});
    }
  };

  const handleDelete = (index: number) => {
    if (onDelete) {
      onDelete(index);
      setDeleteIndex(null);
    }
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditDocument({ ...documents[index] });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditDocument({});
  };

  return (
    <div className="space-y-4">
      {/* 필수 문서 체크리스트 */}
      {showRequiredChecklist && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h4 className="font-medium text-neutral-900 mb-3">필수 문서 체크리스트</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {requiredTypes.map(type => {
              const exists = documents.some(doc => doc.type === type);
              const Icon = getPPAPDocumentTypeIcon(type);
              return (
                <div
                  key={type}
                  className={`flex items-center gap-2 p-2 rounded ${
                    exists ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {exists ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <Icon className="w-4 h-4 text-neutral-600" />
                  <span className={`text-sm ${exists ? 'text-green-700' : 'text-red-700'}`}>
                    {getPPAPDocumentTypeLabel(type)}
                  </span>
                </div>
              );
            })}
          </div>
          {missingRequired.length > 0 && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
              경고: {missingRequired.map(type => getPPAPDocumentTypeLabel(type)).join(', ')} 문서가 누락되었습니다.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 문서 목록 */}
      <div className="space-y-2">
        {documents.map((doc, index) => {
          const Icon = getPPAPDocumentTypeIcon(doc.type);
          const isRequired = doc.isRequired || isDocumentRequired(doc.type);

          if (editingIndex === index && !readOnly && canEdit) {
            return (
              <div key={index} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="space-y-3">
                  <FormSelect
                    label="문서 타입"
                    value={editDocument.type || doc.type}
                    onChange={(e) =>
                      setEditDocument({ ...editDocument, type: e.target.value as PPAPDocumentType })
                    }
                    options={documentTypeOptions}
                    required
                  />
                  <FormInput
                    label="문서 링크 (URL)"
                    value={editDocument.link || doc.link}
                    onChange={(e) => setEditDocument({ ...editDocument, link: e.target.value })}
                    required
                  />
                  <FormTextarea
                    label="문서 설명 (선택)"
                    value={editDocument.description || doc.description || ''}
                    onChange={(e) =>
                      setEditDocument({ ...editDocument, description: e.target.value })
                    }
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(index)}
                      className="btn-primary flex-1"
                    >
                      저장
                    </button>
                    <button onClick={cancelEdit} className="btn-secondary flex-1">
                      취소
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="flex items-start justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-neutral-600" />
                  <span className="font-medium text-neutral-900">
                    {getPPAPDocumentTypeLabel(doc.type)}
                  </span>
                  {isRequired && (
                    <Badge variant="warning" className="text-xs">필수</Badge>
                  )}
                </div>
                {doc.link && (
                  <a
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-1"
                  >
                    <LinkIcon className="w-3 h-3" />
                    문서 링크
                  </a>
                )}
                {doc.description && (
                  <p className="text-sm text-neutral-600 mt-1">{doc.description}</p>
                )}
                {doc.uploadedAt && (
                  <p className="text-xs text-neutral-500 mt-1">
                    등록일: {new Date(doc.uploadedAt).toLocaleDateString('ko-KR')}
                  </p>
                )}
              </div>
              {!readOnly && canEdit && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(index)}
                    className="btn-icon"
                    title="수정"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteIndex(index)}
                    className="btn-icon text-red-600 hover:bg-red-50"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 문서 추가 폼 */}
      {!readOnly && canEdit && (
        <>
          {isAdding ? (
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="space-y-3">
                <FormSelect
                  label="문서 타입"
                  value={newDocument.type}
                  onChange={(e) =>
                    setNewDocument({
                      ...newDocument,
                      type: e.target.value as PPAPDocumentType,
                      isRequired: isDocumentRequired(e.target.value as PPAPDocumentType),
                    })
                  }
                  options={documentTypeOptions}
                  required
                />
                <FormInput
                  label="문서 링크 (URL)"
                  value={newDocument.link}
                  onChange={(e) => setNewDocument({ ...newDocument, link: e.target.value })}
                  placeholder="https://example.com/document.pdf"
                  required
                />
                <FormTextarea
                  label="문서 설명 (선택)"
                  value={newDocument.description || ''}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, description: e.target.value })
                  }
                  rows={2}
                />
                {isDocumentRequired(newDocument.type) && (
                  <p className="text-sm text-yellow-600">
                    * 필수 문서입니다.
                  </p>
                )}
                <div className="flex gap-2">
                  <button onClick={handleAdd} className="btn-primary flex-1">
                    추가
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewDocument({
                        type: 'DFMEA',
                        link: '',
                        description: '',
                        isRequired: false,
                      });
                    }}
                    className="btn-secondary flex-1"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              문서 추가
            </button>
          )}
        </>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={() => deleteIndex !== null && handleDelete(deleteIndex)}
        title="문서 삭제 확인"
        message="정말 이 문서를 삭제하시겠습니까?"
        confirmText="삭제"
        variant="danger"
      />
    </div>
  );
}

export default DocumentManager;

