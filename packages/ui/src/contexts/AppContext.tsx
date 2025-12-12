import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { AppState, AppContextType, User, FMEAItem, ECR, Notification, Comment, SPCData, QualityIssue, PPAP } from '../types';
import { getApiService, isMockMode } from '../services/api';
import { AuthUtils } from '../utils/auth';

type AppAction =
  | { type: 'LOGIN'; payload: { employeeId: string; ssnPrefix: string } }
  | { type: 'LOGOUT' }
  | { type: 'ADD_USER'; payload: Omit<User, 'id'> }
  | { type: 'UPDATE_USER'; payload: Partial<User> & { id: number } }
  | { type: 'DELETE_USER'; payload: number }
  | { type: 'ADD_DFMEA'; payload: Omit<FMEAItem, 'id'> & { id?: number } }
  | { type: 'UPDATE_DFMEA'; payload: Partial<FMEAItem> & { id: number } }
  | { type: 'DELETE_DFMEA'; payload: number }
  | { type: 'APPROVE_PPAP'; payload: { id: number; userId: number } }
  | { type: 'ADD_ECR'; payload: Omit<ECR, 'id' | 'projectId' | 'status' | 'requestedBy' | 'requestedAt' | 'approvedBy' | 'approvedAt'> & { id?: number; projectId?: number; status?: 'pending' | 'approved' | 'rejected'; requestedBy?: number; requestedAt?: string; approvedBy?: number | null; approvedAt?: string | null } }
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
  | { type: 'REJECT_PPAP'; payload: { id: number; userId: number; reason: string } }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'createdAt'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: number }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'ADD_COMMENT'; payload: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_COMMENT'; payload: { id: number; content: string } }
  | { type: 'DELETE_COMMENT'; payload: number };

const AppContext = createContext<AppContextType | undefined>(undefined);

// 초기 상태 (Mock 데이터 포함)
const initialState: AppState = {
  // 인증 상태
  currentUser: null,
  isAuthenticated: false,

  // 사용자 목록
  users: [
    {
      id: 1,
      employeeId: 'E001',
      username: 'admin',
      password: 'admin123',
      name: '시스템 관리자',
      department: 'IT',
      dept: 'IT',
      position: '관리자',
      role: 'ADMIN',
      isDepartmentHead: false,
      ssnPrefix: '900101',
      ssnSuffix: '1234567',
    },
    {
      id: 2,
      employeeId: 'E002',
      username: 'manager',
      password: 'manager123',
      name: '생산팀장',
      department: '생산',
      dept: '생산',
      position: '팀장',
      role: 'APPROVER',
      isDepartmentHead: true,
      ssnPrefix: '850215',
      ssnSuffix: '2345678',
    },
    {
      id: 3,
      employeeId: 'E003',
      username: 'user',
      password: 'user123',
      name: '품질팀원',
      department: '품질',
      dept: '품질',
      position: '사원',
      role: 'USER',
      isDepartmentHead: false,
      ssnPrefix: '920330',
      ssnSuffix: '3456789',
    },
  ],

  // 프로젝트
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

  // FMEA 데이터
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
      visibility: 'personal', // 개인 작업
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
      visibility: 'personal', // 개인 작업
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
      visibility: 'department', // 승인되어 부서 공유
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
      visibility: 'department', // 부서 공유 (담당자 없음)
      createdBy: 2,
      isPersonal: false,
    },
  ],

  pfmea: [],

  // Control Plan
  controlPlans: [],

  // SPC 데이터
  spcData: [],
  spcDataNew: [],

  // MSA 데이터
  msaData: [],

  // PPAP
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

  // ECR (Engineering Change Request)
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
      visibility: 'department', // 부서 공유
    },
  ],

  // VOC
  voc: [],

  // Critical Characteristics
  criticalCharacteristics: [],

  // Audit Trail
  auditTrail: [],

  // Notifications
  notifications: [],

  // Comments
  comments: [],

  // Version History
  versionHistory: [],

  // Workflow Rules
  workflowRules: [],

  // Notification Settings
  notificationSettings: [],

  // FMEA Templates
  fmeaTemplates: [],

  // Saved Searches
  savedSearches: [],

  // Quality Issues
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

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN': {
      const user = state.users.find(u =>
        u.employeeId === action.payload.employeeId &&
        u.ssnPrefix === action.payload.ssnPrefix
      );
      if (user) {
        const { password, ssnPrefix, ssnSuffix, ...userWithoutPassword } = user;
        return {
          ...state,
          currentUser: userWithoutPassword,
          isAuthenticated: true,
        };
      }
      return state;
    }

    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
      };

    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, { ...action.payload, id: Date.now() }],
      };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(u =>
          u.id === action.payload.id ? { ...u, ...action.payload } : u
        ),
      };

    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload),
      };

    case 'ADD_DFMEA': {
      const newId = action.payload.id || Date.now();
      const newItem = {
        ...action.payload,
        id: newId,
        status: action.payload.status || 'draft',
        // 기본값 설정
        visibility: action.payload.visibility || (action.payload.assignedTo ? 'personal' : 'department'),
        createdBy: action.payload.createdBy || state.currentUser?.id,
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
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            userId: ppap?.submittedBy || ppap?.createdBy || 0,
            type: 'approval_result',
            title: 'PPAP 승인 완료',
            message: `PPAP 제출 패키지 #${action.payload.id}이(가) 승인되었습니다.`,
            relatedEntityType: 'PPAP',
            relatedEntityId: action.payload.id,
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
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
        submittedBy: state.currentUser?.id,
        documents: action.payload.documents.map(doc => ({
          ...doc,
          uploadedAt: new Date().toISOString(),
          uploadedBy: state.currentUser?.id,
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
            userId: state.currentUser?.id || 0,
            action: 'created',
            timestamp: new Date().toISOString(),
          },
        ],
        notifications: [
          ...state.notifications,
          ...state.users
            .filter(u => (u.role === 'APPROVER' || u.role === 'ADMIN') && u.id !== state.currentUser?.id)
            .map(user => ({
              id: Date.now() + user.id,
              userId: user.id,
              type: 'approval_request' as const,
              title: 'PPAP 승인 요청',
              message: `${state.currentUser?.name}님이 새로운 PPAP 제출 패키지를 등록했습니다.`,
              relatedEntityType: 'PPAP' as const,
              relatedEntityId: newPPAP.id,
              isRead: false,
              createdAt: new Date().toISOString(),
            })),
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
                uploadedBy: doc.uploadedBy || state.currentUser?.id,
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
            userId: state.currentUser?.id || 0,
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
            userId: state.currentUser?.id || 0,
            action: 'deleted',
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    case 'REJECT_PPAP': {
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
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            userId: ppap?.submittedBy || ppap?.createdBy || 0,
            type: 'approval_result',
            title: 'PPAP 반려',
            message: `PPAP 제출 패키지 #${action.payload.id}이(가) 반려되었습니다. 사유: ${action.payload.reason}`,
            relatedEntityType: 'PPAP',
            relatedEntityId: action.payload.id,
            isRead: false,
            createdAt: new Date().toISOString(),
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
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            userId: ecr?.requestedBy || 0,
            type: 'approval_result',
            title: 'ECR 승인 완료',
            message: `ECR "${ecr?.title}"이(가) 승인되었습니다.`,
            relatedEntityType: 'ECR',
            relatedEntityId: action.payload.id,
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }

    case 'REJECT_ECR': {
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
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            userId: ecr?.requestedBy || 0,
            type: 'approval_result',
            title: 'ECR 반려',
            message: `ECR "${ecr?.title}"이(가) 반려되었습니다. 사유: ${action.payload.reason}`,
            relatedEntityType: 'ECR',
            relatedEntityId: action.payload.id,
            isRead: false,
            createdAt: new Date().toISOString(),
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

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            ...action.payload,
            createdAt: new Date().toISOString(),
          },
        ],
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      };

    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [
          ...state.comments,
          {
            id: Date.now(),
            ...action.payload,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };

    case 'UPDATE_COMMENT':
      return {
        ...state,
        comments: state.comments.map(c =>
          c.id === action.payload.id
            ? { ...c, content: action.payload.content, updatedAt: new Date().toISOString() }
            : c
        ),
      };

    case 'DELETE_COMMENT':
      return {
        ...state,
        comments: state.comments.filter(c => c.id !== action.payload),
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
        reportedBy: state.currentUser?.id || 0,
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
            userId: state.currentUser?.id || 0,
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
            userId: state.currentUser?.id || 0,
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
            userId: state.currentUser?.id || 0,
            action: 'deleted',
            timestamp: new Date().toISOString(),
          },
        ],
      };

    case 'ASSIGN_QUALITY_ISSUE': {
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
            userId: state.currentUser?.id || 0,
            action: `assigned to user ${action.payload.userId}`,
            timestamp: new Date().toISOString(),
          },
        ],
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            userId: action.payload.userId,
            type: 'issue_assigned',
            title: '품질 이슈 할당',
            message: `${state.currentUser?.name}님이 품질 이슈 "${issue?.title}"을(를) 당신에게 할당했습니다.`,
            relatedEntityType: 'QUALITY_ISSUE',
            relatedEntityId: action.payload.id,
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }

    case 'CHANGE_QUALITY_ISSUE_STATUS': {
      const issue = state.qualityIssues.find(i => i.id === action.payload.id);
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
                resolvedBy: state.currentUser?.id,
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
            userId: state.currentUser?.id || 0,
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

// Provider 컴포넌트
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const apiService = getApiService();

  // 초기 데이터 로드 및 로그인 상태 복원
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 저장된 인증 정보 확인
        if (AuthUtils.isAuthenticated()) {
          const currentUser = AuthUtils.getCurrentUser();
          if (currentUser) {
            // API에서 현재 사용자 정보 확인 (백엔드 연동 시)
            try {
              const response = await apiService.getCurrentUser();
              dispatch({
                type: 'LOGIN',
                payload: {
                  employeeId: response.data.employeeId,
                  ssnPrefix: response.data.ssnPrefix || '',
                },
              });
            } catch (error) {
              // Mock 모드이거나 API 실패 시 localStorage 사용
              const savedUser = AuthUtils.getCurrentUser();
              if (savedUser) {
                const fullUser = initialState.users.find(u => u.id === savedUser.id);
                if (fullUser) {
                  dispatch({
                    type: 'LOGIN',
                    payload: { employeeId: fullUser.employeeId, ssnPrefix: fullUser.ssnPrefix || '' },
                  });
                }
              }
            }
          }
        }

        // 초기 데이터 로드 (백엔드 연동 시)
        // await loadInitialData();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (state.isAuthenticated && state.currentUser) {
      AuthUtils.setCurrentUser(state.currentUser);
    } else {
      AuthUtils.removeCurrentUser();
    }
  }, [state.isAuthenticated, state.currentUser]);

  // Mock 데이터 동기화 (Mock 모드일 때만)
  useEffect(() => {
    if (isMockMode()) {
      // Mock API 서비스에 현재 상태 getter 설정
      import('../services/mockApi').then(({ setMockDataGetter }) => {
        setMockDataGetter(() => state);
      });
    }
  }, [state]);

  // 액션 함수들
  const login = async (employeeId: string, ssnPrefix: string) => {
    try {
      // API를 통한 로그인 (백엔드 연동 시)
      const response = await apiService.login(employeeId, ssnPrefix);

      // 토큰 저장
      AuthUtils.setToken(response.data.token);
      AuthUtils.setCurrentUser(response.data.user);

      // 상태 업데이트
      dispatch({
        type: 'LOGIN',
        payload: { employeeId, ssnPrefix },
      });
    } catch (error) {
      // Mock 모드 또는 API 실패 시 기존 로직 사용
      const user = state.users.find(u =>
        u.employeeId === employeeId && u.ssnPrefix === ssnPrefix
      );
      if (user) {
        const { password, ssnPrefix: _, ssnSuffix: __, ...userWithoutPassword } = user;
        AuthUtils.setToken(`mock-token-${user.id}`);
        AuthUtils.setCurrentUser(userWithoutPassword);
        dispatch({
          type: 'LOGIN',
          payload: { employeeId, ssnPrefix },
        });
      } else {
        throw new Error('Invalid credentials');
      }
    }
  };

  const logout = async () => {
    try {
      // API를 통한 로그아웃 (백엔드 연동 시)
      await apiService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // 항상 로컬 상태 정리
      AuthUtils.logout();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    dispatch({ type: 'ADD_USER', payload: userData });
  };

  const updateUser = (userData: Partial<User> & { id: number }) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const deleteUser = (userId: number) => {
    dispatch({ type: 'DELETE_USER', payload: userId });
  };

  const addDFMEA = (data: Omit<FMEAItem, 'id'>) => {
    const fmeaId = Date.now();
    dispatch({ type: 'ADD_DFMEA', payload: { ...data, id: fmeaId } });
    dispatch({
      type: 'ADD_AUDIT_TRAIL',
      payload: {
        type: 'DFMEA_CREATE',
        entityId: fmeaId,
        userId: state.currentUser?.id || 0,
        action: 'created',
      },
    });

    // 담당자에게 할당 알림
    if (data.assignedTo && data.assignedTo !== state.currentUser?.id) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          userId: data.assignedTo,
          type: 'assignment',
          title: '작업 할당',
          message: `${state.currentUser?.name}님이 FMEA 항목 "${data.failureMode}"을(를) 당신에게 할당했습니다.`,
          relatedEntityType: 'DFMEA',
          relatedEntityId: fmeaId,
          isRead: false,
        },
      });
    }

    // 검토자에게 검토 요청 알림
    if (data.reviewer && data.reviewer !== state.currentUser?.id) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          userId: data.reviewer,
          type: 'approval_request',
          title: '검토 요청',
          message: `${state.currentUser?.name}님이 FMEA 항목 "${data.failureMode}"의 검토를 요청했습니다.`,
          relatedEntityType: 'DFMEA',
          relatedEntityId: fmeaId,
          isRead: false,
        },
      });
    }
  };

  const updateDFMEA = (data: Partial<FMEAItem> & { id: number }) => {
    dispatch({ type: 'UPDATE_DFMEA', payload: data });
    dispatch({
      type: 'ADD_AUDIT_TRAIL',
      payload: {
        type: 'DFMEA_UPDATE',
        entityId: data.id,
        userId: state.currentUser?.id || 0,
        action: 'updated',
      },
    });
  };

  const deleteDFMEA = (id: number) => {
    dispatch({ type: 'DELETE_DFMEA', payload: id });
    dispatch({
      type: 'ADD_AUDIT_TRAIL',
      payload: {
        type: 'DFMEA_DELETE',
        entityId: id,
        userId: state.currentUser?.id || 0,
        action: 'deleted',
      },
    });
  };

  const approvePPAP = (ppapId: number) => {
    if (!state.currentUser?.id) return;
    dispatch({
      type: 'APPROVE_PPAP',
      payload: { id: ppapId, userId: state.currentUser.id },
    });
  };

  const addPPAP = (data: Omit<PPAP, 'id' | 'status' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectReason' | 'submittedAt' | 'submittedBy'>) => {
    if (!state.currentUser?.id) return;
    dispatch({
      type: 'ADD_PPAP',
      payload: data,
    });
  };

  const updatePPAP = (data: Partial<PPAP> & { id: number }) => {
    if (!state.currentUser?.id) return;
    dispatch({
      type: 'UPDATE_PPAP',
      payload: data,
    });
  };

  const deletePPAP = (id: number) => {
    if (!state.currentUser?.id) return;
    dispatch({
      type: 'DELETE_PPAP',
      payload: id,
    });
  };

  const rejectPPAP = (id: number, reason: string) => {
    if (!state.currentUser?.id) return;
    dispatch({
      type: 'REJECT_PPAP',
      payload: { id, userId: state.currentUser.id, reason },
    });
  };

  const addECR = (data: Omit<ECR, 'id' | 'projectId' | 'status' | 'requestedBy' | 'requestedAt' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectReason'>) => {
    if (!state.currentUser?.id) return;
    const ecrId = Date.now();
    dispatch({
      type: 'ADD_ECR',
      payload: {
        ...data,
        id: ecrId,
        projectId: 1,
        status: 'pending',
        requestedBy: state.currentUser.id,
        requestedAt: new Date().toISOString(),
        approvedBy: null,
        approvedAt: null,
        rejectedBy: null,
        rejectedAt: null,
        rejectReason: undefined,
      },
    });
    dispatch({
      type: 'ADD_AUDIT_TRAIL',
      payload: {
        type: 'ECR_CREATE',
        entityId: ecrId,
        userId: state.currentUser.id,
        action: 'created',
      },
    });
    // Manager에게 승인 요청 알림
    const managers = state.users.filter(u => u.role === 'APPROVER');
    managers.forEach(manager => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          userId: manager.id,
          type: 'approval_request',
          title: 'ECR 승인 요청',
          message: `${state.currentUser?.name}님이 새로운 ECR "${data.title}"을(를) 등록했습니다.`,
          relatedEntityType: 'ECR',
          relatedEntityId: ecrId,
          isRead: false,
        },
      });
    });
  };

  const approveECR = (ecrId: number) => {
    if (!state.currentUser?.id) return;
    dispatch({
      type: 'APPROVE_ECR',
      payload: { id: ecrId, userId: state.currentUser.id },
    });
  };

  const rejectECR = (ecrId: number, reason: string) => {
    if (!state.currentUser?.id) return;
    dispatch({
      type: 'REJECT_ECR',
      payload: { id: ecrId, userId: state.currentUser.id, reason },
    });
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!state.currentUser?.id) return;
    const commentId = Date.now();
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        ...comment,
        userId: state.currentUser.id,
      },
    });

    // 멘션된 사용자들에게 알림
    if (comment.mentions && comment.mentions.length > 0) {
      comment.mentions.forEach(mentionedUserId => {
        if (mentionedUserId !== state.currentUser?.id) {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              userId: mentionedUserId,
              type: 'mention',
              title: '멘션 알림',
              message: `${state.currentUser?.name}님이 댓글에서 당신을 멘션했습니다.`,
              relatedEntityType: comment.entityType,
              relatedEntityId: comment.entityId,
              isRead: false,
            },
          });
        }
      });
    }

    // 담당자나 검토자에게 알림 (FMEA의 경우)
    if (comment.entityType === 'DFMEA' || comment.entityType === 'PFMEA') {
      const fmeaItem = (comment.entityType === 'DFMEA' ? state.dfmea : state.pfmea)
        .find(item => item.id === comment.entityId);
      if (fmeaItem) {
        const notifyUsers = [fmeaItem.assignedTo, fmeaItem.reviewer]
          .filter((id): id is number => id !== undefined && id !== state.currentUser?.id);
        notifyUsers.forEach(userId => {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              userId,
              type: 'comment',
              title: '새 댓글',
              message: `${state.currentUser?.name}님이 ${comment.entityType} 항목에 댓글을 남겼습니다.`,
              relatedEntityType: comment.entityType,
              relatedEntityId: comment.entityId,
              isRead: false,
            },
          });
        });
      }
    }
  };

  const updateComment = (commentId: number, content: string) => {
    dispatch({
      type: 'UPDATE_COMMENT',
      payload: { id: commentId, content },
    });
  };

  const deleteComment = (commentId: number) => {
    dispatch({
      type: 'DELETE_COMMENT',
      payload: commentId,
    });
  };

  const markNotificationAsRead = (notificationId: number) => {
    dispatch({
      type: 'MARK_NOTIFICATION_READ',
      payload: notificationId,
    });
  };

  const markAllNotificationsAsRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  const getUnreadNotificationCount = (): number => {
    if (!state.currentUser?.id) return 0;
    return state.notifications.filter(
      n => n.userId === state.currentUser?.id && !n.isRead
    ).length;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!state.currentUser?.id) throw new Error('로그인이 필요합니다.');
    const user = state.users.find(u => u.id === state.currentUser?.id);
    if (!user || user.password !== currentPassword) {
      throw new Error('현재 비밀번호가 올바르지 않습니다.');
    }
    dispatch({
      type: 'UPDATE_USER',
      payload: { id: user.id, password: newPassword },
    });
  };

  const resetPassword = async (employeeId: string, ssnSuffix: string, newPassword: string) => {
    const user = state.users.find(u => u.employeeId === employeeId && u.ssnSuffix === ssnSuffix);
    if (!user) {
      throw new Error('사번 또는 주민등록번호 뒷자리가 올바르지 않습니다.');
    }
    dispatch({
      type: 'UPDATE_USER',
      payload: { id: user.id, password: newPassword },
    });
  };

  const forceResetPassword = (userId: number) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: { id: userId, password: '1234' },
    });
    dispatch({
      type: 'ADD_AUDIT_TRAIL',
      payload: {
        type: 'USER_PASSWORD_RESET',
        entityId: userId,
        userId: state.currentUser?.id || 0,
        action: 'password reset to 1234',
      },
    });
  };

  const addSPCData = (data: Omit<SPCData, 'id'>) => {
    dispatch({
      type: 'ADD_SPC_DATA',
      payload: data,
    });
  };

  const addQualityIssue = (data: Omit<QualityIssue, 'id' | 'issueNumber' | 'reportedBy' | 'reportedAt'>) => {
    if (!state.currentUser?.id) return;
    dispatch({
      type: 'ADD_QUALITY_ISSUE',
      payload: data,
    });

    // 담당자에게 할당 알림
    if (data.assignedTo && data.assignedTo !== state.currentUser.id) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          userId: data.assignedTo,
          type: 'issue_assigned',
          title: '품질 이슈 할당',
          message: `${state.currentUser.name}님이 품질 이슈 "${data.title}"을(를) 당신에게 할당했습니다.`,
          relatedEntityType: 'QUALITY_ISSUE',
          relatedEntityId: Date.now(), // 임시 ID, 실제로는 reducer에서 생성된 ID 사용
          isRead: false,
        },
      });
    }
  };

  const updateQualityIssue = (data: Partial<QualityIssue> & { id: number }) => {
    dispatch({
      type: 'UPDATE_QUALITY_ISSUE',
      payload: data,
    });
  };

  const deleteQualityIssue = (id: number) => {
    dispatch({
      type: 'DELETE_QUALITY_ISSUE',
      payload: id,
    });
  };

  const assignQualityIssue = (issueId: number, userId: number) => {
    if (!state.currentUser?.id) return;
    dispatch({
      type: 'ASSIGN_QUALITY_ISSUE',
      payload: { id: issueId, userId },
    });
  };

  const changeQualityIssueStatus = (issueId: number, status: QualityIssue['status'], resolution?: string) => {
    if (!state.currentUser?.id) return;
    dispatch({
      type: 'CHANGE_QUALITY_ISSUE_STATUS',
      payload: { id: issueId, status, resolution },
    });
  };

  // 개인 데이터 필터링
  const getPersonalDFMEA = (): FMEAItem[] => {
    if (!state.currentUser?.id) return [];
    return state.dfmea.filter(item => {
      if (item.visibility === 'personal') return true;
      if (item.assignedTo === state.currentUser?.id && (item.status === 'draft' || item.status === 'in_review')) {
        return true;
      }
      if (item.createdBy === state.currentUser?.id && !item.visibility) {
        return true;
      }
      return false;
    });
  };

  // 부서 공유 데이터 필터링
  const getDepartmentDFMEA = (): FMEAItem[] => {
    if (!state.currentUser) return [];
    return state.dfmea.filter(item => {
      if (item.visibility === 'department') return true;
      if (item.status === 'approved') return true;
      if (!item.assignedTo && item.projectId) return true;
      if (!item.visibility && !item.assignedTo) return true;
      return false;
    });
  };

  const value: AppContextType = {
    ...state,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    addDFMEA,
    updateDFMEA,
    deleteDFMEA,
    addECR,
    approvePPAP,
    approveECR,
    rejectECR,
    addComment,
    updateComment,
    deleteComment,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    getPersonalDFMEA,
    getDepartmentDFMEA,
    changePassword,
    resetPassword,
    forceResetPassword,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

