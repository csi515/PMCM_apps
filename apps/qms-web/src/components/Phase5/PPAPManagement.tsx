import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { PPAP } from '../../types';
import { Plus, Filter, Eye, CheckCircle, XCircle, Clock, Link as LinkIcon } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import Badge from '../Common/Badge';
import EmptyState from '../Common/EmptyState';
import FormInput from '../Common/FormInput';
import FormSelect from '../Common/FormSelect';
import PPAPModal from './PPAPModal';
import PPAPDetail from './PPAPDetail';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getPPAPDocumentTypeLabel } from '../../utils/ppapStandards';

function PPAPManagement() {
  const { ppap, deletePPAP, users, projects } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingPPAP, setEditingPPAP] = useState<PPAP | null>(null);
  const [selectedPPAP, setSelectedPPAP] = useState<PPAP | null>(null);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    status: [] as PPAP['status'][],
    projectId: undefined as number | undefined,
    searchText: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // 필터링
  const filteredPPAP = ppap.filter(item => {
    if (filters.status.length > 0 && !filters.status.includes(item.status)) return false;
    if (filters.projectId && item.projectId !== filters.projectId) return false;
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const projectName = projects.find(p => p.id === item.projectId)?.name.toLowerCase() || '';
      if (!projectName.includes(searchLower) && !item.id.toString().includes(searchLower)) {
        return false;
      }
    }
    return true;
  });

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user?.name || '알 수 없음';
  };

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

  const handleOpenModal = (ppap?: PPAP) => {
    setEditingPPAP(ppap || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPPAP(null);
  };

  const handleOpenDetail = (ppap: PPAP) => {
    setSelectedPPAP(ppap);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedPPAP(null);
  };

  const handleEdit = (ppap: PPAP) => {
    setIsDetailModalOpen(false);
    handleOpenModal(ppap);
  };

  const handleDelete = (ppapId: number) => {
    deletePPAP(ppapId);
  };

  // 통계
  const stats = {
    total: ppap.length,
    pending: ppap.filter(p => p.status === 'pending').length,
    approved: ppap.filter(p => p.status === 'approved').length,
    rejected: ppap.filter(p => p.status === 'rejected').length,
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="PPAP 관리"
        description="제품 승인 및 프로세스 승인 패키지 관리"
        action={
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> PPAP 등록
          </button>
        }
      />

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">전체</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">대기</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">승인</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">반려</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">필터</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? '필터 숨기기' : '필터 보기'}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="검색"
              value={filters.searchText}
              onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
              placeholder="프로젝트명, ID 검색"
            />
            
            <FormSelect
              label="상태"
              value=""
              onChange={(e) => {
                const value = e.target.value as PPAP['status'];
                if (value) {
                  setFilters({
                    ...filters,
                    status: filters.status.includes(value)
                      ? filters.status.filter(s => s !== value)
                      : [...filters.status, value],
                  });
                }
              }}
              options={[
                { value: '', label: '전체' },
                { value: 'pending', label: '대기' },
                { value: 'approved', label: '승인' },
                { value: 'rejected', label: '반려' },
              ]}
            />
            
            <FormSelect
              label="프로젝트"
              value={filters.projectId || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  projectId: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              options={[
                { value: '', label: '전체' },
                ...projects.map(p => ({ value: p.id.toString(), label: p.name })),
              ]}
            />
          </div>
        )}

        {/* 선택된 필터 표시 */}
        {(filters.status.length > 0 || filters.projectId) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.status.map(status => (
              <button
                key={status}
                onClick={() =>
                  setFilters({
                    ...filters,
                    status: filters.status.filter(s => s !== status),
                  })
                }
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm hover:bg-primary-200"
              >
                <span>상태: {status === 'pending' ? '대기' : status === 'approved' ? '승인' : '반려'}</span>
                <span>×</span>
              </button>
            ))}
            {filters.projectId && (
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    projectId: undefined,
                  })
                }
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm hover:bg-primary-200"
              >
                <span>프로젝트: {projects.find(p => p.id === filters.projectId)?.name}</span>
                <span>×</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* PPAP 목록 - 카드 뷰 */}
      <div className="space-y-4">
        {filteredPPAP.map((item) => {
          const project = projects.find(p => p.id === item.projectId);
          return (
            <div key={item.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      PPAP 제출 패키지 #{item.id}
                    </h3>
                    {getStatusBadge(item.status)}
                  </div>
                  {project && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                      <LinkIcon className="w-4 h-4" />
                      <span className="font-medium">프로젝트:</span>
                      <span>{project.name}</span>
                      {project.customer && (
                        <>
                          <span className="text-neutral-400">•</span>
                          <span>{project.customer}</span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    {item.submittedBy && (
                      <span>제출자: {getUserName(item.submittedBy)}</span>
                    )}
                    {item.submittedAt && (
                      <span>
                        제출일: {format(new Date(item.submittedAt), 'yyyy-MM-dd', { locale: ko })}
                      </span>
                    )}
                    <span>문서 수: {item.documents.length}개</span>
                  </div>
                  {item.rejectReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm font-medium text-red-800 mb-1">반려 사유</div>
                      <div className="text-sm text-red-700">{item.rejectReason}</div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleOpenDetail(item)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> 상세 보기
                </button>
              </div>

              {/* 문서 미리보기 */}
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <h4 className="font-medium text-neutral-900 mb-2">제출 문서</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.documents.slice(0, 4).map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-neutral-50 rounded text-sm"
                    >
                      <span className="font-medium text-neutral-700">
                        {getPPAPDocumentTypeLabel(doc.type)}
                      </span>
                    </div>
                  ))}
                  {item.documents.length > 4 && (
                    <div className="flex items-center p-2 text-sm text-neutral-500">
                      외 {item.documents.length - 4}개 더...
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPPAP.length === 0 && (
        <EmptyState message="조건에 맞는 PPAP가 없습니다." />
      )}

      {/* 모달 */}
      <PPAPModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingPPAP={editingPPAP}
      />

      <PPAPDetail
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        ppap={selectedPPAP}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default PPAPManagement;

