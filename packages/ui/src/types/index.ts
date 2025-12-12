export type UserRole = 'ADMIN' | 'APPROVER' | 'USER';
export type DataVisibility = 'personal' | 'department' | 'project' | 'public';

export interface User {
  id: number;
  employeeId: string; // 사번
  username?: string; // 기존 호환성을 위해 유지 (선택적)
  password?: string; // 비밀번호
  name: string;
  department: string; // 기존 필드 유지
  dept: string; // 부서명 (새 필드)
  position: string;
  role: UserRole;
  isDepartmentHead: boolean;
  ssnPrefix?: string; // 주민등록번호 앞자리 (로그인 인증용)
  ssnSuffix?: string; // 주민등록번호 뒷자리 (비밀번호 재설정 인증용)
}

export interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  customer?: string; // 고객사
  currentPhase?: number; // APQP 현재 단계 (1-5)
  coreToolsLinks?: Record<string, string>; // Core Tools 문서 링크
}

export interface FMEAItem {
  id: number;
  projectId: number;
  failureMode: string;
  effect: string;
  cause: string;
  severity: number;
  occurrence: number;
  detection: number;
  rpn: number;
  fileLink?: string;
  assignedTo?: number; // 담당자 ID
  reviewer?: number; // 검토자 ID
  dueDate?: string; // 마감일
  status: 'draft' | 'in_review' | 'approved' | 'rejected';
  visibility?: DataVisibility; // 데이터 가시성: personal(개인), department(부서), project(프로젝트), public(전체)
  createdBy?: number; // 생성자 ID
  isPersonal?: boolean; // 개인 작업 여부 (빠른 필터링용)
}

export type PPAPDocumentType =
  | 'DFMEA'
  | 'PFMEA'
  | 'CONTROL_PLAN'
  | 'SPC_REPORT'
  | 'MSA_REPORT'
  | 'PROCESS_FLOW'
  | 'DRAWING'
  | 'SPECIFICATION'
  | 'TEST_REPORT'
  | 'CERTIFICATE'
  | 'OTHER';

export interface PPAPDocument {
  type: PPAPDocumentType;
  link: string;
  isRequired?: boolean; // 필수 문서 여부
  description?: string; // 문서 설명
  uploadedAt?: string; // 업로드/등록 시간
  uploadedBy?: number; // 등록자 ID
}

export interface PPAP {
  id: number;
  projectId: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy: number | null;
  approvedAt: string | null;
  rejectedBy?: number | null; // 반려자 ID
  rejectedAt?: string | null; // 반려 시간
  rejectReason?: string; // 반려 사유
  submittedAt?: string; // 제출 시간
  submittedBy?: number; // 제출자 ID
  documents: PPAPDocument[];
  visibility?: DataVisibility; // 데이터 가시성
  createdBy?: number; // 생성자 ID
}

export interface ECR {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: number;
  requestedAt: string;
  approvedBy: number | null;
  approvedAt: string | null;
  rejectedBy?: number | null;
  rejectedAt?: string | null;
  rejectReason?: string;
  visibility?: DataVisibility; // 데이터 가시성
}

export interface AuditTrailItem {
  id: number;
  type: string;
  entityId: number;
  userId: number;
  action: string;
  timestamp: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: 'approval_request' | 'approval_result' | 'comment' | 'mention' | 'data_change' | 'assignment' | 'issue_assigned';
  title: string;
  message: string;
  relatedEntityType: 'PPAP' | 'ECR' | 'DFMEA' | 'PFMEA' | 'QUALITY_ISSUE';
  relatedEntityId: number;
  isRead: boolean;
  createdAt: string;
}

export interface Comment {
  id: number;
  entityType: 'DFMEA' | 'PFMEA' | 'PPAP' | 'ECR' | 'QUALITY_ISSUE';
  entityId: number;
  userId: number;
  content: string;
  parentId?: number; // 답글 기능
  mentions?: number[]; // @멘션 기능
  createdAt: string;
  updatedAt: string;
}

export interface VersionHistory {
  id: number;
  entityType: 'DFMEA' | 'PFMEA' | 'PPAP' | 'ECR' | 'QUALITY_ISSUE';
  entityId: number;
  version: number;
  data: any; // 변경된 데이터 스냅샷
  changedBy: number;
  changedAt: string;
  changeDescription?: string;
}

export interface WorkflowRule {
  id: number;
  name: string;
  entityType: 'DFMEA' | 'PFMEA' | 'PPAP' | 'ECR' | 'QUALITY_ISSUE';
  triggerCondition: {
    field: string;
    operator: 'equals' | 'greaterThan' | 'lessThan' | 'contains';
    value: any;
  };
  actions: Array<{
    type: 'statusChange' | 'assign' | 'notify' | 'createTask';
    params: any;
  }>;
  isActive: boolean;
}

export interface NotificationSettings {
  userId: number;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: {
    approval_request: boolean;
    approval_result: boolean;
    comment: boolean;
    mention: boolean;
    data_change: boolean;
    assignment: boolean;
  };
}

export interface FMEATemplate {
  id: number;
  name: string;
  description: string;
  failureMode: string;
  effect: string;
  cause: string;
  severity: number;
  occurrence: number;
  detection: number;
  category: string;
  createdBy: number;
  createdAt: string;
}

export interface SavedSearch {
  id: number;
  name: string;
  entityType: 'DFMEA' | 'PFMEA' | 'PPAP' | 'ECR' | 'QUALITY_ISSUE';
  filters: Record<string, any>;
  userId: number;
  createdAt: string;
}

export interface SPCMeasurement {
  id: number;
  process: string;
  value: number;
  timestamp: string;
}

export interface SPCData {
  id: number;
  process: string; // 공정 특성
  value: number; // 측정값
  timestamp: string; // 측정 시간
  lot?: string; // Lot 정보
  batch?: string; // Batch 정보
  projectId?: number;
}

export interface EightDReport {
  d1Team?: number[]; // 팀 구성원 ID 배열
  d2Problem?: string; // 문제 설명
  d3Containment?: string; // 임시조치
  d4RootCause?: string; // 근본원인 분석
  d5CorrectiveAction?: string; // 영구조치
  d6Implementation?: string; // 조치 실행
  d7Prevention?: string; // 재발방지
  d8Closure?: string; // 팀 축하 및 종료
}

export interface QualityIssue {
  id: number;
  issueNumber: string; // 자동 생성 (예: QI-2024-001)
  title: string;
  description: string;
  category: 'defect' | 'process' | 'design' | 'measurement' | 'supplier' | 'other';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'investigating' | 'in_progress' | 'verifying' | 'resolved' | 'closed';
  severity: number; // 1-10
  reportedBy: number;
  reportedAt: string;
  assignedTo?: number;
  dueDate?: string;
  resolvedAt?: string;
  resolvedBy?: number;
  resolution?: string;
  projectId?: number;
  relatedFMEAId?: number;
  relatedECRId?: number;
  fileLinks?: string[];
  visibility?: DataVisibility;
  tags?: string[];
  useEightD: boolean; // 8D Report 사용 여부
  eightD?: EightDReport;
}

export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  projects: Project[];
  dfmea: FMEAItem[];
  pfmea: FMEAItem[];
  controlPlans: any[];
  spcData: SPCMeasurement[]; // 기존 호환성 유지
  spcDataNew: SPCData[]; // 새로운 SPCData 타입
  msaData: any[];
  ppap: PPAP[];
  ecr: ECR[];
  voc: any[];
  criticalCharacteristics: any[];
  auditTrail: AuditTrailItem[];
  notifications: Notification[];
  comments: Comment[];
  versionHistory: VersionHistory[];
  workflowRules: WorkflowRule[];
  notificationSettings: NotificationSettings[];
  fmeaTemplates: FMEATemplate[];
  savedSearches: SavedSearch[];
  qualityIssues: QualityIssue[];
}

export interface AppContextType extends AppState {
  login: (employeeId: string, ssnPrefix: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (employeeId: string, ssnSuffix: string, newPassword: string) => Promise<void>;
  forceResetPassword: (userId: number) => void;
  addUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (userData: Partial<User> & { id: number }) => void;
  deleteUser: (userId: number) => void;
  addDFMEA: (data: Omit<FMEAItem, 'id'>) => void;
  updateDFMEA: (data: Partial<FMEAItem> & { id: number }) => void;
  deleteDFMEA: (id: number) => void;
  addECR: (data: Omit<ECR, 'id' | 'projectId' | 'status' | 'requestedBy' | 'requestedAt' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectReason'>) => void;
  approvePPAP: (ppapId: number) => void;
  approveECR: (ecrId: number) => void;
  rejectECR: (ecrId: number, reason: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateComment: (commentId: number, content: string) => void;
  deleteComment: (commentId: number) => void;
  markNotificationAsRead: (notificationId: number) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationCount: () => number;
  addSPCData: (data: Omit<SPCData, 'id'>) => void;
  addQualityIssue: (data: Omit<QualityIssue, 'id' | 'issueNumber' | 'reportedBy' | 'reportedAt'>) => void;
  updateQualityIssue: (data: Partial<QualityIssue> & { id: number }) => void;
  deleteQualityIssue: (id: number) => void;
  assignQualityIssue: (issueId: number, userId: number) => void;
  changeQualityIssueStatus: (issueId: number, status: QualityIssue['status'], resolution?: string) => void;
  addPPAP: (data: Omit<PPAP, 'id' | 'status' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectReason' | 'submittedAt' | 'submittedBy'>) => void;
  updatePPAP: (data: Partial<PPAP> & { id: number }) => void;
  deletePPAP: (id: number) => void;
  rejectPPAP: (id: number, reason: string) => void;
  getPersonalDFMEA: () => FMEAItem[];
  getDepartmentDFMEA: () => FMEAItem[];
}

