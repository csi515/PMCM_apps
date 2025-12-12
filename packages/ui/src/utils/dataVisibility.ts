/**
 * 데이터 가시성 및 접근 권한 유틸리티
 * 부서 공통 데이터와 개인 데이터를 구분하는 로직
 */

import { User, DataVisibility } from '../types';

/**
 * 개인 데이터인지 판별
 */
export const isPersonalData = <T extends { visibility?: DataVisibility; assignedTo?: number; createdBy?: number; status?: string }>(
  item: T,
  currentUserId: number
): boolean => {
  // 1. 명시적으로 personal로 설정된 경우
  if (item.visibility === 'personal') return true;

  // 2. 개인에게 할당되고 초안/검토중인 경우
  if (item.assignedTo === currentUserId) {
    const status = (item as any).status;
    if (status === 'draft' || status === 'in_review') {
      return true;
    }
  }

  // 3. 본인이 생성하고 visibility가 설정되지 않은 경우 (기본값은 department이지만, 생성 직후는 personal로 간주)
  if (item.createdBy === currentUserId && !item.visibility) {
    return true;
  }

  return false;
};

/**
 * 부서 공통 데이터인지 판별
 */
export const isDepartmentShared = <T extends { visibility?: DataVisibility; assignedTo?: number; status?: string; projectId?: number }>(
  item: T,
  currentUser: User
): boolean => {
  // 1. 명시적으로 department로 설정
  if (item.visibility === 'department') return true;

  // 2. 승인된 데이터는 자동으로 부서 공유
  const status = (item as any).status;
  if (status === 'approved') return true;

  // 3. 담당자가 없고 프로젝트에 속한 경우 (부서 공유 작업)
  if (!item.assignedTo && item.projectId) {
    return true;
  }

  // 4. visibility가 설정되지 않았고, 담당자가 없는 경우 (기본값: department)
  if (!item.visibility && !item.assignedTo) {
    return true;
  }

  return false;
};

/**
 * 프로젝트 공유 데이터인지 판별
 */
export const isProjectShared = <T extends { visibility?: DataVisibility; projectId?: number }>(
  item: T
): boolean => {
  return item.visibility === 'project' || (item.visibility === undefined && item.projectId !== undefined);
};

/**
 * 전체 공개 데이터인지 판별
 */
export const isPublicData = <T extends { visibility?: DataVisibility }>(
  item: T
): boolean => {
  return item.visibility === 'public';
};

/**
 * 현재 사용자가 접근 가능한 데이터인지 판별
 */
export const canUserAccess = <T extends { visibility?: DataVisibility; assignedTo?: number; createdBy?: number; projectId?: number }>(
  item: T,
  currentUser: User
): boolean => {
  // Admin은 모든 데이터 접근 가능
  if (currentUser.role === 'ADMIN') return true;

  // 개인 데이터: 본인이 생성했거나 할당받은 경우
  if (isPersonalData(item, currentUser.id)) {
    return item.createdBy === currentUser.id || item.assignedTo === currentUser.id;
  }

  // 부서 공유 데이터: 같은 부서인 경우
  if (isDepartmentShared(item, currentUser)) {
    // TODO: 프로젝트 멤버 확인 로직 추가 필요
    return true;
  }

  // 프로젝트 공유 데이터: 프로젝트 멤버인 경우
  if (isProjectShared(item)) {
    // TODO: 프로젝트 멤버 확인 로직 추가 필요
    return true;
  }

  // 전체 공개 데이터
  if (isPublicData(item)) {
    return true;
  }

  return false;
};

/**
 * 데이터 가시성 레이블 반환
 */
export const getVisibilityLabel = (visibility?: DataVisibility): string => {
  switch (visibility) {
    case 'personal':
      return '개인';
    case 'department':
      return '부서 공유';
    case 'project':
      return '프로젝트 공유';
    case 'public':
      return '전체 공개';
    default:
      return '부서 공유'; // 기본값
  }
};

/**
 * 데이터 가시성 아이콘 반환
 */
export const getVisibilityIcon = (visibility?: DataVisibility): string => {
  switch (visibility) {
    case 'personal':
      return '🔒';
    case 'department':
      return '👥';
    case 'project':
      return '📁';
    case 'public':
      return '🌐';
    default:
      return '👥';
  }
};

