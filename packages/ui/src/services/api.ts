/// <reference types="vite/client" />

/**
 * API 서비스 레이어
 * 백엔드 연동 시 RLS(Row Level Security)를 적용하기 위한 추상화 계층
 */

import { User, FMEAItem, ECR, PPAP, Project, Notification, Comment } from '../types';

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// API 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * 인증 토큰 가져오기
   * localStorage 또는 쿠키에서 토큰을 가져옵니다.
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken') || localStorage.getItem('accessToken');
  }

  /**
   * API 요청 헤더 생성
   * 인증 토큰과 사용자 정보를 포함합니다.
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 현재 사용자 ID를 헤더에 포함 (백엔드 RLS에서 사용)
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        headers['X-User-Id'] = user.id?.toString() || '';
        headers['X-User-Role'] = user.role || '';
        headers['X-User-Department'] = user.department || '';
      } catch (e) {
        console.error('Failed to parse currentUser:', e);
      }
    }

    return headers;
  }

  /**
   * 공통 API 요청 처리
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // ==================== 인증 ====================

  async login(employeeId: string, ssnPrefix: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ employeeId, ssnPrefix }),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // ==================== 사용자 관리 ====================

  async getUsers(): Promise<ApiResponse<User[]>> {
    // 백엔드에서 Admin만 접근 가능하도록 RLS 적용
    return this.request<User[]>('/users');
  }

  async createUser(userData: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // ==================== 프로젝트 ====================

  async getProjects(): Promise<ApiResponse<Project[]>> {
    // 백엔드에서 사용자가 접근 가능한 프로젝트만 반환 (RLS)
    return this.request<Project[]>('/projects');
  }

  async getProject(projectId: number): Promise<ApiResponse<Project>> {
    // 프로젝트 접근 권한 확인 (RLS)
    return this.request<Project>(`/projects/${projectId}`);
  }

  // ==================== DFMEA ====================

  async getDFMEA(projectId?: number): Promise<ApiResponse<FMEAItem[]>> {
    // 백엔드에서 다음 조건으로 필터링 (RLS):
    // - 프로젝트 접근 권한
    // - 부서별 접근 권한
    // - 담당자/검토자 권한
    const params = projectId ? `?projectId=${projectId}` : '';
    return this.request<FMEAItem[]>(`/dfmea${params}`);
  }

  async getDFMEAById(id: number): Promise<ApiResponse<FMEAItem>> {
    // 개별 항목 접근 권한 확인 (RLS)
    return this.request<FMEAItem>(`/dfmea/${id}`);
  }

  async createDFMEA(data: Omit<FMEAItem, 'id'>): Promise<ApiResponse<FMEAItem>> {
    // 생성 시 자동으로 현재 사용자 정보 포함
    return this.request<FMEAItem>('/dfmea', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDFMEA(id: number, data: Partial<FMEAItem>): Promise<ApiResponse<FMEAItem>> {
    // 수정 권한 확인 (RLS: 소유자, 담당자, Admin만)
    return this.request<FMEAItem>(`/dfmea/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDFMEA(id: number): Promise<ApiResponse<void>> {
    // 삭제 권한 확인 (RLS: 소유자, Admin만)
    return this.request<void>(`/dfmea/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== ECR ====================

  async getECR(projectId?: number): Promise<ApiResponse<ECR[]>> {
    // 프로젝트/부서별 접근 권한 확인 (RLS)
    const params = projectId ? `?projectId=${projectId}` : '';
    return this.request<ECR[]>(`/ecr${params}`);
  }

  async createECR(data: Omit<ECR, 'id' | 'projectId' | 'status' | 'requestedBy' | 'requestedAt' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectReason'>): Promise<ApiResponse<ECR>> {
    return this.request<ECR>('/ecr', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async approveECR(id: number): Promise<ApiResponse<ECR>> {
    // Manager 권한 확인 (RLS)
    return this.request<ECR>(`/ecr/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectECR(id: number, reason: string): Promise<ApiResponse<ECR>> {
    // Manager 권한 확인 (RLS)
    return this.request<ECR>(`/ecr/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // ==================== PPAP ====================

  async getPPAP(projectId?: number): Promise<ApiResponse<PPAP[]>> {
    // 프로젝트 접근 권한 확인 (RLS)
    const params = projectId ? `?projectId=${projectId}` : '';
    return this.request<PPAP[]>(`/ppap${params}`);
  }

  async approvePPAP(id: number): Promise<ApiResponse<PPAP>> {
    // Manager 권한 확인 (RLS)
    return this.request<PPAP>(`/ppap/${id}/approve`, {
      method: 'POST',
    });
  }

  // ==================== 알림 ====================

  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    // 현재 사용자의 알림만 반환 (RLS)
    return this.request<Notification[]>('/notifications');
  }

  async markNotificationAsRead(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return this.request<void>('/notifications/read-all', {
      method: 'POST',
    });
  }

  // ==================== 댓글 ====================

  async getComments(entityType: string, entityId: number): Promise<ApiResponse<Comment[]>> {
    // 엔티티 접근 권한 확인 후 댓글 반환 (RLS)
    return this.request<Comment[]>(`/comments?entityType=${entityType}&entityId=${entityId}`);
  }

  async createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Comment>> {
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  async updateComment(id: number, content: string): Promise<ApiResponse<Comment>> {
    // 소유자만 수정 가능 (RLS)
    return this.request<Comment>(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(id: number): Promise<ApiResponse<void>> {
    // 소유자만 삭제 가능 (RLS)
    return this.request<void>(`/comments/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== 감사 이력 ====================

  async getAuditTrail(entityType?: string, entityId?: number): Promise<ApiResponse<any[]>> {
    // 접근 권한이 있는 엔티티의 감사 이력만 반환 (RLS)
    const params = new URLSearchParams();
    if (entityType) params.append('entityType', entityType);
    if (entityId) params.append('entityId', entityId.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/audit-trail${query}`);
  }
}

// 싱글톤 인스턴스
export const apiService = new ApiService();

// Mock 모드 지원 (백엔드가 없을 때)
export const isMockMode = () => {
  return !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK === 'true';
};

// API 서비스 선택 (Mock 모드일 때는 mockApiService 사용)
import { mockApiService } from './mockApi';

// 실제 사용할 API 서비스 (환경에 따라 자동 전환)
export const getApiService = () => {
  return isMockMode() ? mockApiService : apiService;
};

