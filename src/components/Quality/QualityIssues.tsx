import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { QualityIssue } from '../../types';
import { Plus, Search, Filter } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import DataTable from '../Common/DataTable';
import Badge from '../Common/Badge';
import EmptyState from '../Common/EmptyState';
import QualityIssueModal from './QualityIssueModal';
import QualityIssueDetail from './QualityIssueDetail';
import QualityIssueStats from './QualityIssueStats';
import FormInput from '../Common/FormInput';
import FormSelect from '../Common/FormSelect';
import { filterQualityIssues, sortQualityIssues, isIssueOverdue, SortField, SortOrder } from '../../utils/qualityIssues';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

function QualityIssues() {
  const { qualityIssues, users, projects, deleteQualityIssue } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<QualityIssue | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<QualityIssue | null>(null);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    status: [] as QualityIssue['status'][],
    priority: [] as QualityIssue['priority'][],
    category: [] as QualityIssue['category'][],
    assignedTo: undefined as number | undefined,
    projectId: undefined as number | undefined,
    searchText: '',
  });
  
  const [sortBy, setSortBy] = useState<SortField>('reportedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // 필터링 및 정렬
  const filteredIssues = sortQualityIssues(
    filterQualityIssues(qualityIssues, filters),
    sortBy,
    sortOrder
  );

  const handleOpenModal = (issue?: QualityIssue) => {
    setEditingIssue(issue || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIssue(null);
  };

  const handleOpenDetail = (issue: QualityIssue) => {
    setSelectedIssue(issue);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedIssue(null);
  };

  const handleEdit = (issue: QualityIssue) => {
    setIsDetailModalOpen(false);
    handleOpenModal(issue);
  };

  const handleDelete = (issueId: number) => {
    deleteQualityIssue(issueId);
  };

  const getPriorityBadgeVariant = (priority: QualityIssue['priority']) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'neutral';
      default: return 'neutral';
    }
  };

  const getStatusBadgeVariant = (status: QualityIssue['status']) => {
    switch (status) {
      case 'new': return 'info';
      case 'investigating': return 'warning';
      case 'in_progress': return 'warning';
      case 'verifying': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'neutral';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status: QualityIssue['status']) => {
    const labels: Record<QualityIssue['status'], string> = {
      new: '신규',
      investigating: '조사중',
      in_progress: '조치중',
      verifying: '검증중',
      resolved: '해결됨',
      closed: '종료',
    };
    return labels[status];
  };

  const getCategoryLabel = (category: QualityIssue['category']) => {
    const labels: Record<QualityIssue['category'], string> = {
      defect: '불량',
      process: '공정',
      design: '설계',
      measurement: '측정',
      supplier: '공급사',
      other: '기타',
    };
    return labels[category];
  };

  const columns = [
    {
      header: '이슈 번호',
      accessor: (row: QualityIssue) => (
        <button
          onClick={() => handleOpenDetail(row)}
          className="text-primary-600 hover:underline font-medium"
        >
          {row.issueNumber}
        </button>
      ),
    },
    {
      header: '제목',
      accessor: (row: QualityIssue) => (
        <div className="max-w-md">
          <div className="font-medium text-neutral-900 truncate">{row.title}</div>
        </div>
      ),
    },
    {
      header: '카테고리',
      accessor: (row: QualityIssue) => (
        <Badge variant="neutral">{getCategoryLabel(row.category)}</Badge>
      ),
    },
    {
      header: '우선순위',
      accessor: (row: QualityIssue) => (
        <Badge variant={getPriorityBadgeVariant(row.priority)}>
          {row.priority.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: '상태',
      accessor: (row: QualityIssue) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {getStatusLabel(row.status)}
        </Badge>
      ),
    },
    {
      header: '담당자',
      accessor: (row: QualityIssue) => {
        const user = row.assignedTo ? users.find(u => u.id === row.assignedTo) : null;
        return user ? user.name : '-';
      },
    },
    {
      header: '등록일',
      accessor: (row: QualityIssue) =>
        format(new Date(row.reportedAt), 'yyyy-MM-dd', { locale: ko }),
    },
    {
      header: '마감일',
      accessor: (row: QualityIssue) => {
        if (!row.dueDate) return '-';
        const isOverdue = isIssueOverdue(row);
        return (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {format(new Date(row.dueDate), 'yyyy-MM-dd', { locale: ko })}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="품질 이슈"
        description="품질 이슈 등록, 추적 및 관리"
        actions={
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> 이슈 등록
          </button>
        }
      />

      {/* 통계 */}
      <QualityIssueStats />

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput
              label="검색"
              value={filters.searchText}
              onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
              placeholder="제목, 설명, 이슈 번호 검색"
            />
            
            <FormSelect
              label="상태"
              value=""
              onChange={(e) => {
                const value = e.target.value as QualityIssue['status'];
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
                { value: 'new', label: '신규' },
                { value: 'investigating', label: '조사중' },
                { value: 'in_progress', label: '조치중' },
                { value: 'verifying', label: '검증중' },
                { value: 'resolved', label: '해결됨' },
                { value: 'closed', label: '종료' },
              ]}
            />
            
            <FormSelect
              label="우선순위"
              value=""
              onChange={(e) => {
                const value = e.target.value as QualityIssue['priority'];
                if (value) {
                  setFilters({
                    ...filters,
                    priority: filters.priority.includes(value)
                      ? filters.priority.filter(p => p !== value)
                      : [...filters.priority, value],
                  });
                }
              }}
              options={[
                { value: '', label: '전체' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
            
            <FormSelect
              label="담당자"
              value={filters.assignedTo || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  assignedTo: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              options={[
                { value: '', label: '전체' },
                ...users.map(u => ({ value: u.id.toString(), label: `${u.name} (${u.dept})` })),
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
        {(filters.status.length > 0 || filters.priority.length > 0 || filters.category.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.status.map(status => (
              <Badge
                key={status}
                variant="info"
                className="cursor-pointer"
                onClick={() =>
                  setFilters({
                    ...filters,
                    status: filters.status.filter(s => s !== status),
                  })
                }
              >
                상태: {getStatusLabel(status)} ×
              </Badge>
            ))}
            {filters.priority.map(priority => (
              <Badge
                key={priority}
                variant="info"
                className="cursor-pointer"
                onClick={() =>
                  setFilters({
                    ...filters,
                    priority: filters.priority.filter(p => p !== priority),
                  })
                }
              >
                우선순위: {priority.toUpperCase()} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* 이슈 목록 */}
      <DataTable<QualityIssue>
        columns={columns}
        data={filteredIssues}
        emptyMessage="등록된 품질 이슈가 없습니다."
      />

      {/* 모달 */}
      <QualityIssueModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingIssue={editingIssue}
      />

      <QualityIssueDetail
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        issue={selectedIssue}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default QualityIssues;

