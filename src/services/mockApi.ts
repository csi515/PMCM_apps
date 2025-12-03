/**
 * Mock API 서비스
 * 백엔드가 없을 때 사용하는 Mock 데이터 반환
 * 실제 API와 동일한 인터페이스를 제공하여 나중에 쉽게 교체 가능
 */

import { ApiResponse } from './api';
import { User, FMEAItem, ECR, PPAP, Project, Notification, Comment } from '../types';

// Mock 데이터 저장소
// Context의 상태를 참조하도록 설정
let getMockData: () => any = () => ({});

export const setMockDataGetter = (getter: () => any) => {
  getMockData = getter;
};

class MockApiService {
  private getData() {
    return getMockData();
  }

  // 인증
  async login(username: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const data = this.getData();
    const user = data.users?.find((u: any) => u.username === username && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const { password: _, ...userWithoutPassword } = user;
    const token = `mock-token-${user.id}`;
    localStorage.setItem('authToken', token);
    return {
      data: { user: userWithoutPassword as User, token },
    };
  }

  async logout(): Promise<ApiResponse<void>> {
    localStorage.removeItem('authToken');
    return { data: undefined };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const userId = parseInt(token.replace('mock-token-', ''));
    const data = this.getData();
    const user = data.users?.find((u: any) => u.id === userId);
    if (!user) throw new Error('User not found');
    const { password: _, ...userWithoutPassword } = user;
    return { data: userWithoutPassword as User };
  }

  // 사용자 관리
  async getUsers(): Promise<ApiResponse<User[]>> {
    const data = this.getData();
    return { 
      data: (data.users || []).map((u: any) => {
        const { password: _, ...user } = u;
        return user as User;
      }) 
    };
  }

  async createUser(userData: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    const newUser = { ...userData, id: Date.now() };
    // 실제로는 Context를 통해 업데이트
    return { data: newUser };
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    const data = this.getData();
    const user = data.users?.find((u: any) => u.id === userId);
    if (!user) throw new Error('User not found');
    const updatedUser = { ...user, ...userData };
    const { password: _, ...userWithoutPassword } = updatedUser;
    return { data: userWithoutPassword as User };
  }

  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    return { data: undefined };
  }

  // 프로젝트
  async getProjects(): Promise<ApiResponse<Project[]>> {
    const data = this.getData();
    // RLS 시뮬레이션: 현재는 모든 프로젝트 반환
    // 실제로는 currentUser 기반 필터링
    return { data: data.projects || [] };
  }

  // DFMEA
  async getDFMEA(projectId?: number): Promise<ApiResponse<FMEAItem[]>> {
    const data = this.getData();
    // RLS 시뮬레이션: 프로젝트 필터링
    let items = data.dfmea || [];
    if (projectId) {
      items = items.filter((item: any) => item.projectId === projectId);
    }
    return { data: items };
  }

  async getDFMEAById(id: number): Promise<ApiResponse<FMEAItem>> {
    const data = this.getData();
    const item = data.dfmea?.find((item: any) => item.id === id);
    if (!item) throw new Error('DFMEA item not found');
    return { data: item };
  }

  async createDFMEA(data: Omit<FMEAItem, 'id'>): Promise<ApiResponse<FMEAItem>> {
    const newItem = { ...data, id: Date.now() };
    return { data: newItem };
  }

  async updateDFMEA(id: number, data: Partial<FMEAItem>): Promise<ApiResponse<FMEAItem>> {
    const mockData = this.getData();
    const item = mockData.dfmea?.find((item: any) => item.id === id);
    if (!item) throw new Error('DFMEA item not found');
    const updatedItem = { ...item, ...data };
    return { data: updatedItem };
  }

  async deleteDFMEA(id: number): Promise<ApiResponse<void>> {
    return { data: undefined };
  }

  // ECR
  async getECR(projectId?: number): Promise<ApiResponse<ECR[]>> {
    const data = this.getData();
    let items = data.ecr || [];
    if (projectId) {
      items = items.filter((item: any) => item.projectId === projectId);
    }
    return { data: items };
  }

  async createECR(data: Omit<ECR, 'id' | 'projectId' | 'status' | 'requestedBy' | 'requestedAt' | 'approvedBy' | 'approvedAt' | 'rejectedBy' | 'rejectedAt' | 'rejectReason'>): Promise<ApiResponse<ECR>> {
    const token = localStorage.getItem('authToken');
    const userId = token ? parseInt(token.replace('mock-token-', '')) : 0;
    const newECR: ECR = {
      ...data,
      id: Date.now(),
      projectId: 1,
      status: 'pending',
      requestedBy: userId,
      requestedAt: new Date().toISOString(),
      approvedBy: null,
      approvedAt: null,
    };
    return { data: newECR };
  }

  async approveECR(id: number): Promise<ApiResponse<ECR>> {
    const data = this.getData();
    const item = data.ecr?.find((item: any) => item.id === id);
    if (!item) throw new Error('ECR not found');
    const token = localStorage.getItem('authToken');
    const userId = token ? parseInt(token.replace('mock-token-', '')) : 0;
    const updatedECR = {
      ...item,
      status: 'approved' as const,
      approvedBy: userId,
      approvedAt: new Date().toISOString(),
    };
    return { data: updatedECR };
  }

  async rejectECR(id: number, reason: string): Promise<ApiResponse<ECR>> {
    const data = this.getData();
    const item = data.ecr?.find((item: any) => item.id === id);
    if (!item) throw new Error('ECR not found');
    const token = localStorage.getItem('authToken');
    const userId = token ? parseInt(token.replace('mock-token-', '')) : 0;
    const updatedECR = {
      ...item,
      status: 'rejected' as const,
      rejectedBy: userId,
      rejectedAt: new Date().toISOString(),
      rejectReason: reason,
    };
    return { data: updatedECR };
  }

  // PPAP
  async getPPAP(projectId?: number): Promise<ApiResponse<PPAP[]>> {
    const data = this.getData();
    let items = data.ppap || [];
    if (projectId) {
      items = items.filter((item: any) => item.projectId === projectId);
    }
    return { data: items };
  }

  async approvePPAP(id: number): Promise<ApiResponse<PPAP>> {
    const data = this.getData();
    const item = data.ppap?.find((item: any) => item.id === id);
    if (!item) throw new Error('PPAP not found');
    const token = localStorage.getItem('authToken');
    const userId = token ? parseInt(token.replace('mock-token-', '')) : 0;
    const updatedPPAP = {
      ...item,
      status: 'approved' as const,
      approvedBy: userId,
      approvedAt: new Date().toISOString(),
    };
    return { data: updatedPPAP };
  }

  // 알림
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    const data = this.getData();
    const token = localStorage.getItem('authToken');
    const userId = token ? parseInt(token.replace('mock-token-', '')) : 0;
    const notifications = (data.notifications || []).filter((n: any) => n.userId === userId);
    return { data: notifications };
  }

  async markNotificationAsRead(id: number): Promise<ApiResponse<void>> {
    return { data: undefined };
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return { data: undefined };
  }

  // 댓글
  async getComments(entityType: string, entityId: number): Promise<ApiResponse<Comment[]>> {
    const data = this.getData();
    const comments = (data.comments || []).filter(
      (c: any) => c.entityType === entityType && c.entityId === entityId
    );
    return { data: comments };
  }

  async createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Comment>> {
    const token = localStorage.getItem('authToken');
    const userId = token ? parseInt(token.replace('mock-token-', '')) : 0;
    const newComment: Comment = {
      ...comment,
      id: Date.now(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { data: newComment };
  }

  async updateComment(id: number, content: string): Promise<ApiResponse<Comment>> {
    const data = this.getData();
    const comment = data.comments?.find((c: any) => c.id === id);
    if (!comment) throw new Error('Comment not found');
    const updatedComment = {
      ...comment,
      content,
      updatedAt: new Date().toISOString(),
    };
    return { data: updatedComment };
  }

  async deleteComment(id: number): Promise<ApiResponse<void>> {
    return { data: undefined };
  }

  // 감사 이력
  async getAuditTrail(entityType?: string, entityId?: number): Promise<ApiResponse<any[]>> {
    const data = this.getData();
    let items = data.auditTrail || [];
    if (entityType) {
      items = items.filter((item: any) => item.type.includes(entityType));
    }
    if (entityId) {
      items = items.filter((item: any) => item.entityId === entityId);
    }
    return { data: items };
  }
}

export const mockApiService = new MockApiService();
