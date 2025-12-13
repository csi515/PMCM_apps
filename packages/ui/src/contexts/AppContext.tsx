import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { AppState, AppContextType, FMEAItem, ECR, SPCData, QualityIssue, PPAP } from '../types';
import { isMockMode } from '../services/api';
import { useAuth, AuthProvider } from './AuthContext';
import { useUI, UIProvider } from './UIContext';

// Keep only Data Actions
type AppAction =
  | { type: 'ADD_DFMEA'; payload: Omit<FMEAItem, 'id'> & { id?: number } }
  | { type: 'UPDATE_DFMEA'; payload: Partial<FMEAItem> & { id: number } }
  | { type: 'DELETE_DFMEA'; payload: number }
  | { type: 'APPROVE_PPAP'; payload: { id: number; userId: number } }
  | { type: 'ADD_ECR'; payload: Omit<ECR, 'id' | 'projectId' | 'status' | 'requestedBy' | 'requestedAt' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectReason'> & { id?: number; projectId?: number; status?: 'pending' | 'approved' | 'rejected'; requestedBy?: number; requestedAt?: string; approvedBy?: number | null; approvedAt?: string | null; rejectedBy?: number | null; rejectedAt?: string | null; rejectReason?: string } }
  | { type: 'APPROVE_ECR'; payload: { id: number; userId: number } }
  | { type: 'ADD_AUDIT_TRAIL'; payload: Omit<AppState['auditTrail'][0], 'id' | 'timestamp'> }
  | { type: 'ADD_SPC_DATA'; payload: Omit<SPCData, 'id'> & { id?: number } }
  | { type: 'ADD_QUALITY_ISSUE'; payload: Omit<QualityIssue, 'id' | 'issueNumber' | 'reportedBy' | 'reportedAt'> }
  | { type: 'UPDATE_QUALITY_ISSUE'; payload: Partial<QualityIssue> & { id: number } }
  | { type: 'DELETE_QUALITY_ISSUE'; payload: number }
  | { type: 'ASSIGN_QUALITY_ISSUE'; payload: { id: number; userId: number } }
  | { type: 'CHANGE_QUALITY_ISSUE_STATUS'; payload: { id: number; status: QualityIssue['status']; resolution?: string } }
  | { type: 'REJECT_ECR'; payload: { id: number; userId: number; reason: string } }
  | { type: 'ADD_PPAP'; payload: Omit<PPAP, 'id' | 'status' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectReason' | 'submittedAt' | 'submittedBy'> }
  | { type: 'UPDATE_PPAP'; payload: Partial<PPAP> & { id: number } }
  | { type: 'DELETE_PPAP'; payload: number }
  | { type: 'REJECT_PPAP'; payload: { id: number; userId: number; reason: string } };

// Remove Auth/UI methods from ContextType definition if they were there, 
// using Omit from the original AppContextType or redefining the data-only interface.
// For now, we will construct the monolithic AppContextType by composing hooks
// to maintain backward compatibility until components are updated.

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial State (Data Only)
const initialState: AppState = {
  // Auth & User State (managed by AuthContext, but placeholder here for type compatibility if needed, though we should strip it)
  currentUser: null,
  isAuthenticated: false,
  users: [], // AuthContext has this
  notifications: [], // UIContext has this
  comments: [], // UIContext has this

  // Data
  projects: [
    {
      id: 1,
      name: '신제품 A 개발',
      status: '진행중',
      progress: 65,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      customer: '고객사 A',
      currentPhase: 2,
      coreToolsLinks: {
        'DFMEA': 'https://example.com/dfmea.pdf',
        'PFMEA': 'https://example.com/pfmea.pdf',
        'ControlPlan': 'https://example.com/cp.pdf',
      },
    },
  ],
  dfmea: [
    {
      id: 1,
      projectId: 1,
      failureMode: '부품 파손',
      effect: '제품 기능 상실',
      cause: '재료 불량',
      severity: 8,
      occurrence: 6,
      detection: 4,
      rpn: 192,
      fileLink: 'https://example.com/drawing1.pdf',
      assignedTo: 3,
      reviewer: 2,
      status: 'in_review',
      visibility: 'personal',
      createdBy: 3,
      isPersonal: true,
    },
    {
      id: 2,
      projectId: 1,
      failureMode: '조립 불량',
      effect: '제품 불량',
      cause: '공정 오류',
      severity: 7,
      occurrence: 5,
      detection: 5,
      rpn: 175,
      fileLink: '',
      assignedTo: 3,
      status: 'draft',
      visibility: 'personal',
      createdBy: 3,
      isPersonal: true,
    },
    {
      id: 3,
      projectId: 1,
      failureMode: '표면 결함',
      effect: '외관 불량',
      cause: '도장 불량',
      severity: 6,
      occurrence: 4,
      detection: 6,
      rpn: 144,
      fileLink: '',
      assignedTo: 3,
      status: 'approved',
      visibility: 'department',
      createdBy: 3,
      isPersonal: false,
    },
    {
      id: 4,
      projectId: 1,
      failureMode: '부품 마모',
      effect: '수명 단축',
      cause: '마찰 증가',
      severity: 5,
      occurrence: 3,
      detection: 7,
      rpn: 105,
      fileLink: '',
      status: 'approved',
      visibility: 'department',
      createdBy: 2,
      isPersonal: false,
    },
  ],
  pfmea: [],
  controlPlans: [],
  spcData: [],
  spcDataNew: [],
  msaData: [],
  ppap: [
    {
      id: 1,
      projectId: 1,
      status: 'pending',
      approvedBy: null,
      approvedAt: null,
      rejectedBy: null,
      rejectedAt: null,
      rejectReason: undefined,
      submittedAt: '2024-03-10T09:00:00Z',
      submittedBy: 3,
      documents: [
        {
          type: 'DFMEA',
          link: 'https://example.com/dfmea.pdf',
          isRequired: true,
          description: '제품 FMEA 문서',
          uploadedAt: '2024-03-10T09:00:00Z',
          uploadedBy: 3,
        },
        {
          type: 'PFMEA',
          link: 'https://example.com/pfmea.pdf',
          isRequired: true,
          description: '공정 FMEA 문서',
          uploadedAt: '2024-03-10T09:00:00Z',
          uploadedBy: 3,
        },
        {
          type: 'CONTROL_PLAN',
          link: 'https://example.com/cp.pdf',
          isRequired: true,
          description: '관리 계획서',
          uploadedAt: '2024-03-10T09:00:00Z',
          uploadedBy: 3,
        },
        {
          type: 'SPC_REPORT',
          link: 'https://example.com/spc.pdf',
          isRequired: true,
          description: 'SPC 분석 보고서',
          uploadedAt: '2024-03-10T09:00:00Z',
          uploadedBy: 3,
        },
      ],
      visibility: 'project',
      createdBy: 3,
    },
  ],
  ecr: [
    {
      id: 1,
      projectId: 1,
      title: '재료 변경 요청',
      description: '비용 절감을 위한 재료 변경',
      status: 'pending',
      requestedBy: 3,
      requestedAt: '2024-03-15',
      approvedBy: null,
      approvedAt: null,
      visibility: 'department',
    },
  ],
  voc: [],
  criticalCharacteristics: [],
  auditTrail: [],
  versionHistory: [],
  workflowRules: [],
  notificationSettings: [],
  fmeaTemplates: [],
  savedSearches: [],
  qualityIssues: [
    {
      id: 1,
      issueNumber: 'QI-2024-001',
      title: '제품 표면 스크래치 발생',
      description: '양산 라인에서 제품 표면에 스크래치가 발생하는 문제가 지속적으로 보고되고 있습니다.',
      category: 'defect',
      priority: 'high',
      status: 'investigating',
      severity: 7,
      reportedBy: 3,
      reportedAt: '2024-03-10T09:00:00Z',
      assignedTo: 2,
      dueDate: '2024-03-25',
      projectId: 1,
      fileLinks: ['https://example.com/scratch_photo.jpg'],
      visibility: 'department',
      tags: ['표면처리', '양산'],
      useEightD: true,
      eightD: {
        d1Team: [2, 3],
        d2Problem: '제품 표면 스크래치 발생',
        d3Containment: '해당 Lot 전량 검사 실시',
      },
    },
    {
      id: 2,
      issueNumber: 'QI-2024-002',
      title: '공정 온도 편차 과다',
      description: '공정 A에서 설정 온도 대비 실제 온도 편차가 허용 범위를 초과하는 경우가 빈번히 발생합니다.',
      category: 'process',
      priority: 'critical',
      status: 'in_progress',
      severity: 9,
      reportedBy: 2,
      reportedAt: '2024-03-12T14:30:00Z',
      assignedTo: 2,
      dueDate: '2024-03-20',
      projectId: 1,
      relatedFMEAId: 1,
      visibility: 'project',
      tags: ['공정', '온도'],
      useEightD: false,
    },
    {
      id: 3,
      issueNumber: 'QI-2024-003',
      title: '측정 장비 교정 지연',
      description: '측정 장비의 정기 교정이 일정보다 지연되어 측정 데이터의 신뢰성에 문제가 있습니다.',
      category: 'measurement',
      priority: 'medium',
      status: 'resolved',
      severity: 5,
      reportedBy: 3,
      reportedAt: '2024-03-05T10:00:00Z',
      assignedTo: 1,
      resolvedAt: '2024-03-15T16:00:00Z',
      resolvedBy: 1,
      resolution: '측정 장비 교정 완료 및 교정 주기 단축 결정',
      visibility: 'department',
      tags: ['측정', '교정'],
      useEightD: false,
    },
  ],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Auth & UI ACTIONS REMOVED (Handled by AuthContext/UIContext)

    // DATA ACTIONS
    case 'ADD_DFMEA': {
      const newId = action.payload.id || Date.now();
      const newItem = {
        ...action.payload,
        id: newId,
        status: action.payload.status || 'draft',
        visibility: action.payload.visibility || (action.payload.assignedTo ? 'personal' : 'department'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createdBy: action.payload.createdBy || (state.currentUser as any)?.id, // Temporary fallback
        isPersonal: action.payload.visibility === 'personal' || (action.payload.assignedTo !== undefined && action.payload.status === 'draft'),
      };
      return {
        ...state,
        dfmea: [...state.dfmea, newItem],
      };
    }

    case 'UPDATE_DFMEA':
      return {
        ...state,
        dfmea: state.dfmea.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
      };

    case 'DELETE_DFMEA':
      return {
        ...state,
        dfmea: state.dfmea.filter(item => item.id !== action.payload),
      };

    case 'ADD_SPC_DATA': {
      const newId = action.payload.id || Date.now();
      return {
        ...state,
        spcDataNew: [...state.spcDataNew, { ...action.payload, id: newId }],
      };
    }

    case 'APPROVE_PPAP': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ppap = state.ppap.find(item => item.id === action.payload.id);
      return {
        ...state,
        ppap: state.ppap.map(item =>
          item.id === action.payload.id
            ? {
              ...item,
              status: 'approved',
              approvedBy: action.payload.userId,
              approvedAt: new Date().toISOString(),
            }
            : item
        ),
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'PPAP_APPROVAL',
            entityId: action.payload.id,
            userId: action.payload.userId,
            action: 'approved',
            timestamp: new Date().toISOString(),
          },
        ],
        // Notifications moved to UIContext (triggered by side effect in provider wrapper)
      };
    }

    case 'ADD_PPAP': {
      const newPPAP: PPAP = {
        ...action.payload,
        id: Date.now(),
        status: 'pending',
        approvedBy: null,
        approvedAt: null,
        rejectedBy: null,
        rejectedAt: null,
        rejectReason: undefined,
        submittedAt: new Date().toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        submittedBy: (state.currentUser as any)?.id,
        documents: action.payload.documents.map(doc => ({
          ...doc,
          uploadedAt: new Date().toISOString(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          uploadedBy: (state.currentUser as any)?.id,
        })),
      };
      return {
        ...state,
        ppap: [...state.ppap, newPPAP],
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'PPAP_CREATE',
            entityId: newPPAP.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId: (state.currentUser as any)?.id || 0,
            action: 'created',
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    case 'UPDATE_PPAP': {
      return {
        ...state,
        ppap: state.ppap.map(item =>
          item.id === action.payload.id
            ? {
              ...item,
              ...action.payload,
              documents: action.payload.documents?.map(doc => ({
                ...doc,
                uploadedAt: doc.uploadedAt || new Date().toISOString(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                uploadedBy: doc.uploadedBy || (state.currentUser as any)?.id,
              })) || item.documents,
            }
            : item
        ),
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'PPAP_UPDATE',
            entityId: action.payload.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId: (state.currentUser as any)?.id || 0,
            action: 'updated',
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    case 'DELETE_PPAP': {
      return {
        ...state,
        ppap: state.ppap.filter(item => item.id !== action.payload),
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'PPAP_DELETE',
            entityId: action.payload,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId: (state.currentUser as any)?.id || 0,
            action: 'deleted',
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    case 'REJECT_PPAP': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ppap = state.ppap.find(item => item.id === action.payload.id);
      return {
        ...state,
        ppap: state.ppap.map(item =>
          item.id === action.payload.id
            ? {
              ...item,
              status: 'rejected',
              rejectedBy: action.payload.userId,
              rejectedAt: new Date().toISOString(),
              rejectReason: action.payload.reason,
            }
            : item
        ),
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'PPAP_REJECTION',
            entityId: action.payload.id,
            userId: action.payload.userId,
            action: 'rejected',
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    case 'ADD_ECR': {
      const newECR: ECR = {
        id: action.payload.id || Date.now(),
        projectId: action.payload.projectId || 1,
        title: action.payload.title,
        description: action.payload.description,
        status: action.payload.status || 'pending',
        requestedBy: action.payload.requestedBy || 0,
        requestedAt: action.payload.requestedAt || new Date().toISOString(),
        approvedBy: action.payload.approvedBy || null,
        approvedAt: action.payload.approvedAt || null,
        rejectedBy: action.payload.rejectedBy || null,
        rejectedAt: action.payload.rejectedAt || null,
        rejectReason: action.payload.rejectReason,
      };
      return {
        ...state,
        ecr: [...state.ecr, newECR],
      };
    }

    case 'APPROVE_ECR': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ecr = state.ecr.find(item => item.id === action.payload.id);
      return {
        ...state,
        ecr: state.ecr.map(item =>
          item.id === action.payload.id
            ? {
              ...item,
              status: 'approved',
              approvedBy: action.payload.userId,
              approvedAt: new Date().toISOString(),
            }
            : item
        ),
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'ECR_APPROVAL',
            entityId: action.payload.id,
            userId: action.payload.userId,
            action: 'approved',
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    case 'REJECT_ECR': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ecr = state.ecr.find(item => item.id === action.payload.id);
      return {
        ...state,
        ecr: state.ecr.map(item =>
          item.id === action.payload.id
            ? {
              ...item,
              status: 'rejected',
              rejectedBy: action.payload.userId,
              rejectedAt: new Date().toISOString(),
              rejectReason: action.payload.reason,
            }
            : item
        ),
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'ECR_REJECTION',
            entityId: action.payload.id,
            userId: action.payload.userId,
            action: 'rejected',
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    case 'ADD_AUDIT_TRAIL':
      return {
        ...state,
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            ...action.payload,
            timestamp: new Date().toISOString(),
          },
        ],
      };

    case 'ADD_QUALITY_ISSUE': {
      // 이슈 번호 생성 (QI-YYYY-NNN 형식)
      const year = new Date().getFullYear();
      const existingIssuesThisYear = state.qualityIssues.filter(
        issue => issue.issueNumber.startsWith(`QI-${year}`)
      );
      const nextNumber = existingIssuesThisYear.length + 1;
      const issueNumber = `QI-${year}-${String(nextNumber).padStart(3, '0')}`;

      const newIssue: QualityIssue = {
        ...action.payload,
        id: Date.now(),
        issueNumber,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reportedBy: (state.currentUser as any)?.id || 0,
        reportedAt: new Date().toISOString(),
        useEightD: action.payload.useEightD || false,
      };

      return {
        ...state,
        qualityIssues: [...state.qualityIssues, newIssue],
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'QUALITY_ISSUE_CREATE',
            entityId: newIssue.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId: (state.currentUser as any)?.id || 0,
            action: 'created',
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    case 'UPDATE_QUALITY_ISSUE':
      return {
        ...state,
        qualityIssues: state.qualityIssues.map(issue =>
          issue.id === action.payload.id ? { ...issue, ...action.payload } : issue
        ),
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'QUALITY_ISSUE_UPDATE',
            entityId: action.payload.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId: (state.currentUser as any)?.id || 0,
            action: 'updated',
            timestamp: new Date().toISOString(),
          },
        ],
      };

    case 'DELETE_QUALITY_ISSUE':
      return {
        ...state,
        qualityIssues: state.qualityIssues.filter(issue => issue.id !== action.payload),
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'QUALITY_ISSUE_DELETE',
            entityId: action.payload,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId: (state.currentUser as any)?.id || 0,
            action: 'deleted',
            timestamp: new Date().toISOString(),
          },
        ],
      };

    case 'ASSIGN_QUALITY_ISSUE': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const issue = state.qualityIssues.find(i => i.id === action.payload.id);
      return {
        ...state,
        qualityIssues: state.qualityIssues.map(issue =>
          issue.id === action.payload.id
            ? { ...issue, assignedTo: action.payload.userId }
            : issue
        ),
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'QUALITY_ISSUE_ASSIGN',
            entityId: action.payload.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId: (state.currentUser as any)?.id || 0,
            action: `assigned to user ${action.payload.userId}`,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    case 'CHANGE_QUALITY_ISSUE_STATUS': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _issue = state.qualityIssues.find(i => i.id === action.payload.id);
      const isResolved = action.payload.status === 'resolved' || action.payload.status === 'closed';
      return {
        ...state,
        qualityIssues: state.qualityIssues.map(issue =>
          issue.id === action.payload.id
            ? {
              ...issue,
              status: action.payload.status,
              ...(isResolved && {
                resolvedAt: new Date().toISOString(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                resolvedBy: (state.currentUser as any)?.id,
                resolution: action.payload.resolution,
              }),
            }
            : issue
        ),
        auditTrail: [
          ...state.auditTrail,
          {
            id: Date.now(),
            type: 'QUALITY_ISSUE_STATUS_CHANGE',
            entityId: action.payload.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId: (state.currentUser as any)?.id || 0,
            action: `status changed to ${action.payload.status}`,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    default:
      return state;
  }
}

interface AppProviderProps {
  children: ReactNode;
}

// Wrapped internal provider
function AppProviderInner({ children }: AppProviderProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [_isLoading, setIsLoading] = useState(true);

  // Connect to new Contexts
  const { currentUser, isAuthenticated, login, logout, addUser, updateUser, deleteUser, changePassword, resetPassword, forceResetPassword } = useAuth();
  const { notifications, addNotification, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationCount, addComment, updateComment, deleteComment } = useUI();

  // Sync Auth State to local state (for legacy components that might peek at state.currentUser directly)
  // Ideally we remove this but preserving for compatibility
  state.currentUser = currentUser;
  state.isAuthenticated = isAuthenticated;

  // Mock Mode Sync
  useEffect(() => {
    if (isMockMode()) {
      import('../services/mockApi').then(({ setMockDataGetter }) => {
        setMockDataGetter(() => state);
      });
    }
  }, [state]);

  useEffect(() => {
    // Only handle data loading here
    setIsLoading(false);
  }, []);

  // DATA ACTION HANDLERS (Wrappers that also trigger notifications via UIContext)

  const addDFMEA = (data: Omit<FMEAItem, 'id'>) => {
    const fmeaId = Date.now();
    dispatch({ type: 'ADD_DFMEA', payload: { ...data, id: fmeaId } });

    // Notifications moved to UIContext hooks calls
    if (data.assignedTo && data.assignedTo !== currentUser?.id) {
      addNotification({
        userId: data.assignedTo,
        type: 'assignment',
        title: '작업 할당',
        message: `${currentUser?.name}님이 FMEA 항목 "${data.failureMode}"을(를) 당신에게 할당했습니다.`,
        relatedEntityType: 'DFMEA',
        relatedEntityId: fmeaId,
        isRead: false,
      });
    }
    if (data.reviewer && data.reviewer !== currentUser?.id) {
      addNotification({
        userId: data.reviewer,
        type: 'approval_request',
        title: '검토 요청',
        message: `${currentUser?.name}님이 FMEA 항목 "${data.failureMode}"의 검토를 요청했습니다.`,
        relatedEntityType: 'DFMEA',
        relatedEntityId: fmeaId,
        isRead: false,
      });
    }
  };

  const updateDFMEA = (data: Partial<FMEAItem> & { id: number }) => {
    dispatch({ type: 'UPDATE_DFMEA', payload: data });
  };

  const deleteDFMEA = (id: number) => {
    dispatch({ type: 'DELETE_DFMEA', payload: id });
  };

  const approvePPAP = (ppapId: number) => {
    if (!currentUser?.id) return;
    dispatch({
      type: 'APPROVE_PPAP',
      payload: { id: ppapId, userId: currentUser.id },
    });
    // Notification logic would go here
  };

  const addPPAP = (data: Omit<PPAP, 'id' | 'status' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectReason' | 'submittedAt' | 'submittedBy'>) => {
    if (!currentUser?.id) return;
    dispatch({ type: 'ADD_PPAP', payload: data });
  };

  const updatePPAP = (data: Partial<PPAP> & { id: number }) => {
    if (!currentUser?.id) return;
    dispatch({ type: 'UPDATE_PPAP', payload: data });
  };

  const deletePPAP = (id: number) => {
    if (!currentUser?.id) return;
    dispatch({ type: 'DELETE_PPAP', payload: id });
  };

  const rejectPPAP = (id: number, reason: string) => {
    if (!currentUser?.id) return;
    dispatch({
      type: 'REJECT_PPAP',
      payload: { id, userId: currentUser.id, reason },
    });
  };

  const addECR = (data: Omit<ECR, 'id' | 'projectId' | 'status' | 'requestedBy' | 'requestedAt' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectReason'>) => {
    if (!currentUser?.id) return;
    dispatch({
      type: 'ADD_ECR',
      payload: data
    });
  };

  const approveECR = (ecrId: number) => {
    if (!currentUser?.id) return;
    dispatch({
      type: 'APPROVE_ECR',
      payload: { id: ecrId, userId: currentUser.id },
    });
  };

  const rejectECR = (ecrId: number, reason: string) => {
    if (!currentUser?.id) return;
    dispatch({
      type: 'REJECT_ECR',
      payload: { id: ecrId, userId: currentUser.id, reason },
    });
  };

  const addSPCData = (data: Omit<SPCData, 'id'>) => {
    dispatch({ type: 'ADD_SPC_DATA', payload: data });
  };

  const addQualityIssue = (data: Omit<QualityIssue, 'id' | 'issueNumber' | 'reportedBy' | 'reportedAt'>) => {
    if (!currentUser?.id) return;
    dispatch({ type: 'ADD_QUALITY_ISSUE', payload: data });
  };

  const updateQualityIssue = (data: Partial<QualityIssue> & { id: number }) => {
    dispatch({ type: 'UPDATE_QUALITY_ISSUE', payload: data });
  };

  const deleteQualityIssue = (id: number) => {
    dispatch({ type: 'DELETE_QUALITY_ISSUE', payload: id });
  };

  const assignQualityIssue = (issueId: number, userId: number) => {
    if (!currentUser?.id) return;
    dispatch({
      type: 'ASSIGN_QUALITY_ISSUE',
      payload: { id: issueId, userId },
    });
  };

  const changeQualityIssueStatus = (issueId: number, status: QualityIssue['status'], resolution?: string) => {
    if (!currentUser?.id) return;
    dispatch({
      type: 'CHANGE_QUALITY_ISSUE_STATUS',
      payload: { id: issueId, status, resolution },
    });
  };

  // Deprecated/Proxy Methods
  const getPersonalDFMEA = (): FMEAItem[] => {
    if (!currentUser?.id) return [];
    return state.dfmea.filter(item => {
      if (item.visibility === 'personal') return true;
      if (item.assignedTo === currentUser?.id && (item.status === 'draft' || item.status === 'in_review')) {
        return true;
      }
      if (item.createdBy === currentUser?.id && !item.visibility) {
        return true;
      }
      return false;
    });
  };

  const getDepartmentDFMEA = (): FMEAItem[] => {
    if (!currentUser) return [];
    return state.dfmea.filter(item => {
      if (item.visibility === 'department') return true;
      if (item.status === 'approved') return true;
      if (!item.assignedTo && item.projectId) return true;
      if (!item.visibility && !item.assignedTo) return true;
      return false;
    });
  };

  // Provide combined context
  const value: AppContextType = {
    ...state,
    notifications, // Override local empty state with UIContext state
    // AuthProxies
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    changePassword,
    resetPassword,
    forceResetPassword,
    // UI Proxies
    addComment,
    updateComment,
    deleteComment,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    // Data Methods
    addDFMEA,
    updateDFMEA,
    deleteDFMEA,
    addECR,
    approvePPAP,
    approveECR,
    rejectECR,
    addSPCData,
    addQualityIssue,
    updateQualityIssue,
    deleteQualityIssue,
    assignQualityIssue,
    changeQualityIssueStatus,
    addPPAP,
    updatePPAP,
    deletePPAP,
    rejectPPAP,
    // Selectors
    getPersonalDFMEA,
    getDepartmentDFMEA,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Wrapper Component that provides Auth and UI Contexts
// Wrapper Component that provides Auth and UI Contexts
export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <UIProvider>
        <AppProviderInner>
          {children}
        </AppProviderInner>
      </UIProvider>
    </AuthProvider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
