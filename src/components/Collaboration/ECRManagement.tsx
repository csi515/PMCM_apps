import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import Modal from '../Common/Modal';
import PageHeader from '../Common/PageHeader';
import Badge from '../Common/Badge';
import FormInput from '../Common/FormInput';
import FormTextarea from '../Common/FormTextarea';
import EmptyState from '../Common/EmptyState';
import CommentSection from '../Common/CommentSection';

function ECRManagement() {
  const { ecr, approveECR, rejectECR, addECR, currentUser, users } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedECRId, setSelectedECRId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [rejectReason, setRejectReason] = useState('');

  const canApprove = currentUser?.role === 'APPROVER' || currentUser?.role === 'ADMIN';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addECR(formData);
    setIsModalOpen(false);
    setFormData({ title: '', description: '' });
  };

  const handleReject = (ecrId: number) => {
    setSelectedECRId(ecrId);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedECRId && rejectReason.trim()) {
      rejectECR(selectedECRId, rejectReason);
      setIsRejectModalOpen(false);
      setRejectReason('');
      setSelectedECRId(null);
    }
  };

  const getStatusBadge = (status: string) => {
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

  const getRequesterName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user?.name || '알 수 없음';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ECR 관리"
        description="엔지니어링 변경 요청 (Engineering Change Request)"
        action={
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            변경 요청 등록
          </button>
        }
      />

      <div className="space-y-4">
        {ecr.map((item) => (
          <div key={item.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900">{item.title}</h3>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-neutral-600 mb-4">{item.description}</p>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span>요청자: {getRequesterName(item.requestedBy)}</span>
                  <span>요청일: {new Date(item.requestedAt).toLocaleDateString('ko-KR')}</span>
                </div>
                {item.rejectReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-sm font-medium text-red-800 mb-1">반려 사유</div>
                    <div className="text-sm text-red-700">{item.rejectReason}</div>
                  </div>
                )}
              </div>
              {item.status === 'pending' && canApprove && (
                <div className="flex gap-2">
                  <button
                    onClick={() => approveECR(item.id)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    승인
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="btn-danger flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    반려
                  </button>
                </div>
              )}
            </div>
            {item.approvedBy && (
              <div className="pt-4 border-t border-neutral-200">
                <div className="text-sm text-neutral-600">
                  <span className="font-medium">승인자:</span> {getRequesterName(item.approvedBy)}
                </div>
                <div className="text-sm text-neutral-600 mt-1">
                  <span className="font-medium">승인 시간:</span>{' '}
                  {new Date(item.approvedAt!).toLocaleString('ko-KR')}
                </div>
              </div>
            )}
            {item.rejectedBy && (
              <div className="pt-4 border-t border-neutral-200">
                <div className="text-sm text-neutral-600">
                  <span className="font-medium">반려자:</span> {getRequesterName(item.rejectedBy)}
                </div>
                <div className="text-sm text-neutral-600 mt-1">
                  <span className="font-medium">반려 시간:</span>{' '}
                  {new Date(item.rejectedAt!).toLocaleString('ko-KR')}
                </div>
              </div>
            )}
            
            <CommentSection entityType="ECR" entityId={item.id} />
          </div>
        ))}
      </div>

      {ecr.length === 0 && (
        <EmptyState
          message="등록된 변경 요청이 없습니다."
        />
      )}

      {/* 등록 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="변경 요청 등록"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
            rows={5}
            required
          />
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">등록</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">취소</button>
          </div>
        </form>
      </Modal>

      {/* 반려 모달 */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectReason('');
          setSelectedECRId(null);
        }}
        title="ECR 반려"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
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
                setSelectedECRId(null);
              }} 
              className="btn-secondary flex-1"
            >
              취소
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ECRManagement;

