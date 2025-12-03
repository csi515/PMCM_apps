import { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Trash2, Link as LinkIcon, User, Calendar, CheckCircle, XCircle, Clock, Search, Download, History } from 'lucide-react';
import CommentSection from '../Common/CommentSection';
import AdvancedFilter from '../Common/AdvancedFilter';
import { exportToExcel } from '../../utils/reportGenerator';
import VersionHistoryViewer from '../VersionHistory/VersionHistoryViewer';
import DataVisibilityFilter from '../Common/DataVisibilityFilter';
import { isPersonalData, isDepartmentShared, getVisibilityLabel, getVisibilityIcon } from '../../utils/dataVisibility';
import { DataVisibility } from '../../types';

function DFMEA() {
  const { dfmea, addDFMEA, updateDFMEA, deleteDFMEA, users, currentUser, projects } = useApp();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | DataVisibility>('all');
  const [formData, setFormData] = useState({
    failureMode: '',
    effect: '',
    cause: '',
    severity: 1,
    occurrence: 1,
    detection: 1,
    fileLink: '',
    assignedTo: undefined as number | undefined,
    reviewer: undefined as number | undefined,
    dueDate: '',
    status: 'draft' as 'draft' | 'in_review' | 'approved' | 'rejected',
    visibility: 'department' as DataVisibility,
  });

  const calculateRPN = (s: number, o: number, d: number) => s * o * d;

  // 필터 옵션
  const filterOptions = [
    {
      key: 'status',
      label: '상태',
      type: 'select' as const,
      options: [
        { value: 'draft', label: '초안' },
        { value: 'in_review', label: '검토중' },
        { value: 'approved', label: '승인' },
        { value: 'rejected', label: '반려' },
      ],
    },
    {
      key: 'rpn_min',
      label: 'RPN 최소값',
      type: 'number' as const,
    },
    {
      key: 'rpn_max',
      label: 'RPN 최대값',
      type: 'number' as const,
    },
    {
      key: 'assignedTo',
      label: '담당자',
      type: 'select' as const,
      options: users.map(u => ({ value: u.id.toString(), label: u.name })),
    },
  ];

  // 필터링 및 검색
  const filteredDFMEA = useMemo(() => {
    let filtered = [...dfmea];

    // 가시성 필터 (부서 공통 vs 개인)
    if (visibilityFilter !== 'all' && currentUser) {
      if (visibilityFilter === 'personal') {
        filtered = filtered.filter(item => isPersonalData(item, currentUser.id));
      } else if (visibilityFilter === 'department') {
        filtered = filtered.filter(item => isDepartmentShared(item, currentUser));
      } else {
        filtered = filtered.filter(item => item.visibility === visibilityFilter);
      }
    }

    // 검색어 필터
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.failureMode.toLowerCase().includes(term) ||
        item.effect.toLowerCase().includes(term) ||
        item.cause.toLowerCase().includes(term)
      );
    }

    // 고급 필터
    if (filterValues.status) {
      filtered = filtered.filter(item => item.status === filterValues.status);
    }
    if (filterValues.rpn_min) {
      filtered = filtered.filter(item => item.rpn >= parseInt(filterValues.rpn_min));
    }
    if (filterValues.rpn_max) {
      filtered = filtered.filter(item => item.rpn <= parseInt(filterValues.rpn_max));
    }
    if (filterValues.assignedTo) {
      filtered = filtered.filter(item => item.assignedTo === parseInt(filterValues.assignedTo));
    }

    return filtered;
  }, [dfmea, searchTerm, filterValues, visibilityFilter, currentUser]);

  const handleExport = () => {
    exportToExcel(filteredDFMEA, 'DFMEA', [
      { header: '고장모드', key: 'failureMode' },
      { header: '영향', key: 'effect' },
      { header: '원인', key: 'cause' },
      { header: 'S', key: 'severity' },
      { header: 'O', key: 'occurrence' },
      { header: 'D', key: 'detection' },
      { header: 'RPN', key: 'rpn' },
      { header: '상태', key: 'status' },
      { header: '가시성', key: 'visibility' },
    ]);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      failureMode: '',
      effect: '',
      cause: '',
      severity: 1,
      occurrence: 1,
      detection: 1,
      fileLink: '',
      assignedTo: undefined,
      reviewer: undefined,
      dueDate: '',
      status: 'draft',
      visibility: 'department',
    });
  };

  const handleEdit = (item: typeof dfmea[0]) => {
    setEditingId(item.id);
    setFormData({
      failureMode: item.failureMode,
      effect: item.effect,
      cause: item.cause,
      severity: item.severity,
      occurrence: item.occurrence,
      detection: item.detection,
      fileLink: item.fileLink || '',
      assignedTo: item.assignedTo,
      reviewer: item.reviewer,
      dueDate: item.dueDate || '',
      status: item.status,
      visibility: item.visibility || 'department',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rpn = calculateRPN(formData.severity, formData.occurrence, formData.detection);
    
    // 담당자가 있으면 자동으로 personal로 설정 (초안인 경우)
    const visibility = formData.assignedTo && formData.status === 'draft' 
      ? 'personal' 
      : formData.visibility;
    
    if (editingId) {
      updateDFMEA({
        id: editingId,
        ...formData,
        rpn,
        projectId: 1,
        visibility,
      });
    } else {
      addDFMEA({
        ...formData,
        rpn,
        projectId: 1,
        visibility,
        createdBy: currentUser?.id,
      });
    }
    
    handleAdd();
  };

  const getUserName = (userId?: number) => {
    if (!userId) return '-';
    const user = users.find(u => u.id === userId);
    return user?.name || '알 수 없음';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" />승인</span>;
      case 'rejected':
        return <span className="badge badge-danger flex items-center gap-1"><XCircle className="w-3 h-3" />반려</span>;
      case 'in_review':
        return <span className="badge badge-warning flex items-center gap-1"><Clock className="w-3 h-3" />검토중</span>;
      default:
        return <span className="badge badge-info">초안</span>;
    }
  };

  const getVisibilityBadge = (visibility?: DataVisibility) => {
    const label = getVisibilityLabel(visibility);
    const icon = getVisibilityIcon(visibility);
    const colorClass = 
      visibility === 'personal' ? 'badge-info' :
      visibility === 'department' ? 'badge-primary' :
      visibility === 'project' ? 'badge-warning' :
      'badge-secondary';
    
    return (
      <span className={`badge ${colorClass} flex items-center gap-1`}>
        <span>{icon}</span>
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">DFMEA (제품 설계 FMEA)</h2>
          <p className="text-neutral-600">제품 설계 단계의 잠재적 고장 모드 분석</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            내보내기
          </button>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            항목 추가
          </button>
        </div>
      </div>

      {/* 가시성 필터 */}
      <div className="card">
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">데이터 범위</label>
          <DataVisibilityFilter
            value={visibilityFilter}
            onChange={setVisibilityFilter}
            showAll={true}
          />
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="고장모드, 영향, 원인으로 검색..."
              className="input-field pl-10"
            />
          </div>
          <AdvancedFilter
            filters={filterOptions}
            onApply={setFilterValues}
            onReset={() => setFilterValues({})}
          />
        </div>
        <div className="mt-2 text-sm text-neutral-500">
          검색 결과: {filteredDFMEA.length}개 항목
        </div>
      </div>

      <div className="table-container overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="table-header">
            <tr>
              <th className="text-left text-sm font-semibold text-neutral-700">고장모드</th>
              <th className="text-left text-sm font-semibold text-neutral-700">영향</th>
              <th className="text-left text-sm font-semibold text-neutral-700">원인</th>
              <th className="text-center text-sm font-semibold text-neutral-700">S</th>
              <th className="text-center text-sm font-semibold text-neutral-700">O</th>
              <th className="text-center text-sm font-semibold text-neutral-700">D</th>
              <th className="text-center text-sm font-semibold text-neutral-700">RPN</th>
              <th className="text-left text-sm font-semibold text-neutral-700">담당자</th>
              <th className="text-left text-sm font-semibold text-neutral-700">상태</th>
              <th className="text-left text-sm font-semibold text-neutral-700">가시성</th>
              <th className="text-left text-sm font-semibold text-neutral-700">파일 링크</th>
              <th className="text-right text-sm font-semibold text-neutral-700">작업</th>
            </tr>
          </thead>
          <tbody>
            {filteredDFMEA.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-6 py-8 text-center text-neutral-500">
                  {searchTerm || Object.keys(filterValues).length > 0 || visibilityFilter !== 'all'
                    ? '검색 결과가 없습니다.'
                    : '등록된 FMEA 항목이 없습니다.'}
                </td>
              </tr>
            ) : (
              filteredDFMEA.map((item) => (
                <tr key={item.id} className="table-row">
                  <td className="px-6 py-4 text-sm text-neutral-900">{item.failureMode}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{item.effect}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{item.cause}</td>
                  <td className="px-6 py-4 text-sm text-center">{item.severity}</td>
                  <td className="px-6 py-4 text-sm text-center">{item.occurrence}</td>
                  <td className="px-6 py-4 text-sm text-center">{item.detection}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className="font-semibold text-red-600">{item.rpn}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {getUserName(item.assignedTo)}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4">{getVisibilityBadge(item.visibility)}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.fileLink ? (
                      <a
                        href={item.fileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        <LinkIcon className="w-4 h-4" />
                        링크
                      </a>
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteDFMEA(item.id)}
                        className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 입력 폼 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          {editingId ? '항목 수정' : '새 항목 추가'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">심각도 (S) *</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">발생도 (O) *</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.occurrence}
                onChange={(e) => setFormData({ ...formData, occurrence: parseInt(e.target.value) })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">탐지도 (D) *</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.detection}
                onChange={(e) => setFormData({ ...formData, detection: parseInt(e.target.value) })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">RPN (자동계산)</label>
              <div className="input-field bg-neutral-50 font-semibold text-primary-600">
                {calculateRPN(formData.severity, formData.occurrence, formData.detection)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">담당자</label>
              <select
                value={formData.assignedTo || ''}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value ? parseInt(e.target.value) : undefined })}
                className="input-field"
              >
                <option value="">선택 안함</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.department})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">검토자</label>
              <select
                value={formData.reviewer || ''}
                onChange={(e) => setFormData({ ...formData, reviewer: e.target.value ? parseInt(e.target.value) : undefined })}
                className="input-field"
              >
                <option value="">선택 안함</option>
                {users.filter(u => u.role === 'Manager').map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.department})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">마감일</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">상태</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="input-field"
              >
                <option value="draft">초안</option>
                <option value="in_review">검토중</option>
                <option value="approved">승인</option>
                <option value="rejected">반려</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">가시성</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as DataVisibility })}
                className="input-field"
              >
                <option value="personal">개인</option>
                <option value="department">부서 공유</option>
                <option value="project">프로젝트 공유</option>
                <option value="public">전체 공개</option>
              </select>
              <p className="text-xs text-neutral-500 mt-1">
                {formData.visibility === 'personal' && '본인만 볼 수 있습니다'}
                {formData.visibility === 'department' && '같은 부서 구성원이 볼 수 있습니다'}
                {formData.visibility === 'project' && '프로젝트 참여자가 볼 수 있습니다'}
                {formData.visibility === 'public' && '모든 사용자가 볼 수 있습니다'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">파일 링크 (URL)</label>
            <input
              type="url"
              value={formData.fileLink}
              onChange={(e) => setFormData({ ...formData, fileLink: e.target.value })}
              className="input-field"
              placeholder="https://example.com/drawing.pdf"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary">
              {editingId ? '수정' : '추가'}
            </button>
            {editingId && (
              <button type="button" onClick={handleAdd} className="btn-secondary">
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 댓글 및 버전 이력 섹션 */}
      {filteredDFMEA.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">상세 정보</h3>
          {filteredDFMEA.map((item) => (
            <div key={item.id} className="space-y-4">
              <div className="card">
                <h4 className="font-semibold text-neutral-900 mb-4">
                  {item.failureMode}
                </h4>
                <CommentSection entityType="DFMEA" entityId={item.id} />
              </div>
              <VersionHistoryViewer entityType="DFMEA" entityId={item.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DFMEA;

