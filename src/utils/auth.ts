/**
 * 인증 유틸리티
 * 토큰 관리 및 사용자 정보 관리
 */

import { User } from '../types';

export const AuthUtils = {
  /**
   * 인증 토큰 저장
   */
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  /**
   * 인증 토큰 가져오기
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  /**
   * 인증 토큰 제거
   */
  removeToken(): void {
    localStorage.removeItem('authToken');
  },

  /**
   * 현재 사용자 정보 저장
   */
  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  /**
   * 현재 사용자 정보 가져오기
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * 현재 사용자 정보 제거
   */
  removeCurrentUser(): void {
    localStorage.removeItem('currentUser');
  },

  /**
   * 로그아웃 (토큰과 사용자 정보 모두 제거)
   */
  logout(): void {
    this.removeToken();
    this.removeCurrentUser();
  },

  /**
   * 인증 상태 확인
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  },
};

