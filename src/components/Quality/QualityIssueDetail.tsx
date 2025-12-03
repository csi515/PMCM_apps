import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { QualityIssue } from '../../types';
import Modal from '../Common/Modal';
import Badge from '../Common/Badge';
import CommentSection from '../Common/CommentSection';
import FormSelect from '../Common/FormSelect';
import FormTextarea from '../Common/FormTextarea';
import { ChevronDown, ChevronUp, Edit, Trash2, User, Calendar, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface QualityIssueDetailProps {
  isOpen: boolean;
  onClose: () => void;
  issue: QualityIssue | null;
  onEdit: (issue: QualityIssue) => void;
  onDelete: (issueId: number) => void;
}

function QualityIssueDetail({ isOpen, onClose, issue, onEdit, onDelete }: QualityIssueDetailProps) {
  const { users, projects, dfmea, ecr, currentUser, changeQualityIssueStatus } = useApp();
  const [expandedEightD, setExpandedEightD] = useState<string[]>([]);
  const [statusChangeModal, setStatusChangeModal] = useState(false);
  const [newStatus, setNewStatus] = useState<QualityIssue['status']>('new');
  const [resolution, setResolution] = useState('');

  if (!issue) return null;

  const reporter = users.find(u => u.id === issue.reportedBy);
  const assignee = issue.assignedTo ? users.find(u => u.id === issue.assignedTo) : null;
  const resolver = issue.resolvedBy ? users.find(u => u.id === issue.resolvedBy) : null;
  const project = issue.projectId ? projects.find(p => p.id === issue.projectId) : null;
  const relatedFMEA = issue.relatedFMEAId ? dfmea.find(f => f.id === issue.relatedFMEAId) : null;
  const relatedECR = issue.relatedECRId ? ecr.find(e => e.id === issue.relatedECRId) : null;

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

  const toggleEightDSection = (section: string) => {
    setExpandedEightD(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleStatusChange = () => {
    changeQualityIssueStatus(issue.id, newStatus, resolution);
    setStatusChangeModal(false);
    setResolution('');
  };

  const canEdit = currentUser?.id === issue.reportedBy || currentUser?.role === 'ADMIN';
  const canDelete = currentUser?.id === issue.reportedBy || currentUser?.role === 'ADMIN';
  const canChangeStatus = currentUser?.id === issue.assignedTo || currentUser?.role === 'ADMIN' || currentUser?.role === 'APPROVER';

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`이슈 상세: ${issue.issueNumber}`} size="xl">
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{issue.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                    {issue.priority.toUpperCase()}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(issue.status)}>
                    {issue.status === 'new' ? '신규' :
                     issue.status === 'investigating' ? '조사중' :
                     issue.status === 'in_progress' ? '조치중' :
                     issue.status === 'verifying' ? '검증중' :
                     issue.status === 'resolved' ? '해결됨' : '종료'}
                  </Badge>
                  <Badge variant="neutral">{getCategoryLabel(issue.category)}</Badge>
                  <span className="text-sm text-neutral-600">심각도: {issue.severity}/10</span>
                </div>
              </div>
              <div className="flex gap-2">
                {canEdit && (
                  <button
                    onClick={() => onEdit(issue)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> 수정
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => {
                      if (confirm('정말 이 이슈를 삭제하시겠습니까?')) {
                        onDelete(issue.id);
                        onClose();
                      }
                    }}
                    className="btn-danger flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> 삭제
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-neutral-700 whitespace-pre-wrap">{issue.description}</p>
            </div>

            {/* 메타 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-500" />
                <span className="text-neutral-600">등록자:</span>
                <span className="font-medium">{reporter?.name || '알 수 없음'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <span className="text-neutral-600">등록일:</span>
                <span className="font-medium">
                  {format(new Date(issue.reportedAt), 'yyyy-MM-dd HH:mm', { locale: ko })}
                </span>
              </div>
              {assignee && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-600">담당자:</span>
                  <span className="font-medium">{assignee.name}</span>
                </div>
              )}
              {issue.dueDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-600">마감일:</span>
                  <span className={`font-medium ${new Date(issue.dueDate) < new Date() && issue.status !== 'resolved' && issue.status !== 'closed' ? 'text-red-600' : ''}`}>
                    {format(new Date(issue.dueDate), 'yyyy-MM-dd', { locale: ko })}
                  </span>
                </div>
              )}
              {project && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-600">프로젝트:</span>
                  <span className="font-medium">{project.name}</span>
                </div>
              )}
              {issue.resolvedAt && resolver && (
                <>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-500" />
                    <span className="text-neutral-600">해결자:</span>
                    <span className="font-medium">{resolver.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-500" />
                    <span className="text-neutral-600">해결일:</span>
                    <span className="font-medium">
                      {format(new Date(issue.resolvedAt), 'yyyy-MM-dd HH:mm', { locale: ko })}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* 관련 항목 */}
            {(relatedFMEA || relatedECR) && (
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">관련 항목</h4>
                <div className="space-y-1 text-sm">
                  {relatedFMEA && (
                    <div>
                      <span className="text-neutral-600">FMEA:</span>{' '}
                      <span className="font-medium">{relatedFMEA.failureMode}</span>
                    </div>
                  )}
                  {relatedECR && (
                    <div>
                      <span className="text-neutral-600">ECR:</span>{' '}
                      <span className="font-medium">{relatedECR.title}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 파일 링크 */}
            {issue.fileLinks && issue.fileLinks.length > 0 && (
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">파일 링크</h4>
                <div className="space-y-1">
                  {issue.fileLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary-600 hover:underline"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 태그 */}
            {issue.tags && issue.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">태그</h4>
                <div className="flex flex-wrap gap-2">
                  {issue.tags.map((tag, index) => (
                    <Badge key={index} variant="neutral">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 해결 내용 */}
            {issue.resolution && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">해결 내용</h4>
                <p className="text-sm text-green-800 whitespace-pre-wrap">{issue.resolution}</p>
              </div>
            )}
          </div>

          {/* 8D Report */}
          {issue.useEightD && issue.eightD && (
            <div className="border border-neutral-200 rounded-lg p-4 space-y-4">
              <h4 className="text-lg font-semibold text-neutral-900">8D Report</h4>
              
              {/* D1: 팀 구성 */}
              {issue.eightD.d1Team && issue.eightD.d1Team.length > 0 && (
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
                      <div className="space-y-1">
                        {issue.eightD.d1Team.map(userId => {
                          const user = users.find(u => u.id === userId);
                          return user ? (
                            <div key={userId} className="text-sm">
                              {user.name} ({user.dept})
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* D2~D8 */}
              {[
                { key: 'd2Problem', label: 'D2: 문제 설명' },
                { key: 'd3Containment', label: 'D3: 임시조치' },
                { key: 'd4RootCause', label: 'D4: 근본원인 분석' },
                { key: 'd5CorrectiveAction', label: 'D5: 영구조치' },
                { key: 'd6Implementation', label: 'D6: 조치 실행' },
                { key: 'd7Prevention', label: 'D7: 재발방지' },
                { key: 'd8Closure', label: 'D8: 팀 축하 및 종료' },
              ].map(({ key, label }) => {
                const value = issue.eightD?.[key as keyof typeof issue.eightD];
                if (!value) return null;

                return (
                  <div key={key}>
                    <button
                      type="button"
                      onClick={() => toggleEightDSection(key)}
                      className="flex items-center justify-between w-full p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100"
                    >
                      <span className="font-medium">{label}</span>
                      {expandedEightD.includes(key) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    {expandedEightD.includes(key) && (
                      <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-700 whitespace-pre-wrap">{value}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 상태 변경 */}
          {canChangeStatus && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setNewStatus(issue.status);
                  setStatusChangeModal(true);
                }}
                className="btn-primary flex-1"
              >
                상태 변경
              </button>
            </div>
          )}

          {/* 댓글 섹션 */}
          <div className="border-t border-neutral-200 pt-6">
            <CommentSection entityType="QUALITY_ISSUE" entityId={issue.id} />
          </div>
        </div>
      </Modal>

      {/* 상태 변경 모달 */}
      <Modal
        isOpen={statusChangeModal}
        onClose={() => {
          setStatusChangeModal(false);
          setResolution('');
        }}
        title="상태 변경"
        size="md"
      >
        <div className="space-y-4">
          <FormSelect
            label="새 상태"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as QualityIssue['status'])}
            options={[
              { value: 'new', label: '신규' },
              { value: 'investigating', label: '조사중' },
              { value: 'in_progress', label: '조치중' },
              { value: 'verifying', label: '검증중' },
              { value: 'resolved', label: '해결됨' },
              { value: 'closed', label: '종료' },
            ]}
            required
          />
          {(newStatus === 'resolved' || newStatus === 'closed') && (
            <FormTextarea
              label="해결 내용"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
              placeholder="이슈 해결 내용을 입력하세요"
            />
          )}
          <div className="flex gap-3 pt-4">
            <button onClick={handleStatusChange} className="btn-primary flex-1">
              변경
            </button>
            <button
              onClick={() => {
                setStatusChangeModal(false);
                setResolution('');
              }}
              className="btn-secondary flex-1"
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default QualityIssueDetail;

