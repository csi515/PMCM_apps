import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { PPAP } from '../../types';
import Modal from '../Common/Modal';
import Badge from '../Common/Badge';
import CommentSection from '../Common/CommentSection';
import DocumentManager from '../Common/DocumentManager';
import ConfirmModal from '../Common/ConfirmModal';
import FormTextarea from '../Common/FormTextarea';
import { CheckCircle, XCircle, Clock, Edit, Trash2, User, Calendar, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PPAPDetailProps {
  isOpen: boolean;
  onClose: () => void;
  ppap: PPAP | null;
  onEdit: (ppap: PPAP) => void;
  onDelete: (ppapId: number) => void;
}

function PPAPDetail({ isOpen, onClose, ppap, onEdit, onDelete }: PPAPDetailProps) {
  const { users, projects, currentUser, approvePPAP, rejectPPAP, updatePPAP } = useApp();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!ppap) return null;

  const project = projects.find(p => p.id === ppap.projectId);
  const submitter = ppap.submittedBy ? users.find(u => u.id === ppap.submittedBy) : null;
  const approver = ppap.approvedBy ? users.find(u => u.id === ppap.approvedBy) : null;
  const rejecter = ppap.rejectedBy ? users.find(u => u.id === ppap.rejectedBy) : null;

  const getStatusBadge = (status: PPAP['status']) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 inline mr-1" />
            승인
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="danger">
            <XCircle className="w-3 h-3 inline mr-1" />
            반려
          </Badge>
        );
      default:
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3 inline mr-1" />
            대기
          </Badge>
        );
    }
  };

  const canApprove = (currentUser?.role === 'APPROVER' || currentUser?.role === 'ADMIN') && ppap.status === 'pending';
  const canEdit = ppap.status === 'pending' && 
    (ppap.submittedBy === currentUser?.id || currentUser?.role === 'ADMIN');
  const canDelete = ppap.status === 'pending' && 
    (ppap.submittedBy === currentUser?.id || currentUser?.role === 'ADMIN');

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    rejectPPAP(ppap.id, rejectReason);
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  const handleDocumentAdd = (doc: Omit<import('../../types').PPAPDocument, 'uploadedAt' | 'uploadedBy'>) => {
    updatePPAP({
      id: ppap.id,
      documents: [
        ...ppap.documents,
        {
          ...doc,
          uploadedAt: new Date().toISOString(),
          uploadedBy: currentUser?.id,
        },
      ],
    });
  };

  const handleDocumentUpdate = (index: number, doc: Partial<import('../../types').PPAPDocument>) => {
    const updated = [...ppap.documents];
    updated[index] = { ...updated[index], ...doc };
    updatePPAP({
      id: ppap.id,
      documents: updated,
    });
  };

  const handleDocumentDelete = (index: number) => {
    updatePPAP({
      id: ppap.id,
      documents: ppap.documents.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`PPAP 상세: #${ppap.id}`} size="xl">
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-neutral-900">PPAP 제출 패키지 #{ppap.id}</h3>
                  {getStatusBadge(ppap.status)}
                </div>
                {project && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                    <LinkIcon className="w-4 h-4" />
                    <span className="font-medium">프로젝트:</span>
                    <span>{project.name}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {canEdit && (
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(ppap);
                    }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> 수정
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="btn-danger flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> 삭제
                  </button>
                )}
              </div>
            </div>

            {/* 메타 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {submitter && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-600">제출자:</span>
                  <span className="font-medium">{submitter.name}</span>
                </div>
              )}
              {ppap.submittedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-600">제출일:</span>
                  <span className="font-medium">
                    {format(new Date(ppap.submittedAt), 'yyyy-MM-dd HH:mm', { locale: ko })}
                  </span>
                </div>
              )}
              {approver && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-600">승인자:</span>
                  <span className="font-medium">{approver.name}</span>
                </div>
              )}
              {ppap.approvedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-600">승인일:</span>
                  <span className="font-medium">
                    {format(new Date(ppap.approvedAt), 'yyyy-MM-dd HH:mm', { locale: ko })}
                  </span>
                </div>
              )}
              {rejecter && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-600">반려자:</span>
                  <span className="font-medium">{rejecter.name}</span>
                </div>
              )}
              {ppap.rejectedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-600">반려일:</span>
                  <span className="font-medium">
                    {format(new Date(ppap.rejectedAt), 'yyyy-MM-dd HH:mm', { locale: ko })}
                  </span>
                </div>
              )}
            </div>

            {/* 반려 사유 */}
            {ppap.rejectReason && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm font-medium text-red-800 mb-1">반려 사유</div>
                <div className="text-sm text-red-700">{ppap.rejectReason}</div>
              </div>
            )}
          </div>

          {/* 문서 목록 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-neutral-900">제출 문서</h4>
            <DocumentManager
              documents={ppap.documents}
              onAdd={canEdit ? handleDocumentAdd : undefined}
              onUpdate={canEdit ? handleDocumentUpdate : undefined}
              onDelete={canEdit ? handleDocumentDelete : undefined}
              readOnly={!canEdit}
              canEdit={canEdit}
              showRequiredChecklist={true}
            />
          </div>

          {/* 승인/반려 버튼 */}
          {canApprove && (
            <div className="flex gap-2 pt-4 border-t border-neutral-200">
              <button
                onClick={() => approvePPAP(ppap.id)}
                className="btn-primary flex items-center gap-2 flex-1"
              >
                <CheckCircle className="w-4 h-4" />
                승인
              </button>
              <button
                onClick={() => setIsRejectModalOpen(true)}
                className="btn-danger flex items-center gap-2 flex-1"
              >
                <XCircle className="w-4 h-4" />
                반려
              </button>
            </div>
          )}

          {/* 댓글 섹션 */}
          <div className="border-t border-neutral-200 pt-6">
            <CommentSection entityType="PPAP" entityId={ppap.id} />
          </div>
        </div>
      </Modal>

      {/* 반려 모달 */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectReason('');
        }}
        title="PPAP 반려"
        size="md"
      >
        <form onSubmit={handleReject} className="space-y-4">
          <FormTextarea
            label="반려 사유"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={5}
            placeholder="반려 사유를 입력하세요..."
            required
          />
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-danger flex-1">반려</button>
            <button
              type="button"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectReason('');
              }}
              className="btn-secondary flex-1"
            >
              취소
            </button>
          </div>
        </form>
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          onDelete(ppap.id);
          setIsDeleteConfirmOpen(false);
          onClose();
        }}
        title="PPAP 삭제 확인"
        message="정말 이 PPAP를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        variant="danger"
      />
    </>
  );
}

export default PPAPDetail;

