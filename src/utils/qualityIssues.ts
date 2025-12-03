import { QualityIssue } from '../types';

/**
 * 이슈 번호 생성 (QI-YYYY-NNN 형식)
 */
export function generateIssueNumber(existingIssues: QualityIssue[]): string {
  const year = new Date().getFullYear();
  const existingIssuesThisYear = existingIssues.filter(
    issue => issue.issueNumber.startsWith(`QI-${year}`)
  );
  const nextNumber = existingIssuesThisYear.length + 1;
  return `QI-${year}-${String(nextNumber).padStart(3, '0')}`;
}

/**
 * 품질 이슈 필터링
 */
export interface QualityIssueFilters {
  status?: QualityIssue['status'][];
  priority?: QualityIssue['priority'][];
  category?: QualityIssue['category'][];
  assignedTo?: number;
  projectId?: number;
  searchText?: string;
  tags?: string[];
}

export function filterQualityIssues(
  issues: QualityIssue[],
  filters: QualityIssueFilters
): QualityIssue[] {
  return issues.filter(issue => {
    // 상태 필터
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(issue.status)) return false;
    }

    // 우선순위 필터
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(issue.priority)) return false;
    }

    // 카테고리 필터
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(issue.category)) return false;
    }

    // 담당자 필터
    if (filters.assignedTo !== undefined) {
      if (issue.assignedTo !== filters.assignedTo) return false;
    }

    // 프로젝트 필터
    if (filters.projectId !== undefined) {
      if (issue.projectId !== filters.projectId) return false;
    }

    // 검색어 필터
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const matchesTitle = issue.title.toLowerCase().includes(searchLower);
      const matchesDescription = issue.description.toLowerCase().includes(searchLower);
      const matchesIssueNumber = issue.issueNumber.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDescription && !matchesIssueNumber) return false;
    }

    // 태그 필터
    if (filters.tags && filters.tags.length > 0) {
      if (!issue.tags || !filters.tags.some(tag => issue.tags!.includes(tag))) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 품질 이슈 정렬
 */
export type SortField = 'reportedAt' | 'dueDate' | 'priority' | 'status' | 'severity';
export type SortOrder = 'asc' | 'desc';

export function sortQualityIssues(
  issues: QualityIssue[],
  sortBy: SortField = 'reportedAt',
  sortOrder: SortOrder = 'desc'
): QualityIssue[] {
  const sorted = [...issues].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'reportedAt':
        comparison = new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority':
        const priorityOrder: Record<QualityIssue['priority'], number> = {
          critical: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'status':
        const statusOrder: Record<QualityIssue['status'], number> = {
          new: 1,
          investigating: 2,
          in_progress: 3,
          verifying: 4,
          resolved: 5,
          closed: 6,
        };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case 'severity':
        comparison = a.severity - b.severity;
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * 지연된 이슈 확인 (마감일이 지났고 해결되지 않음)
 */
export function isIssueOverdue(issue: QualityIssue): boolean {
  if (!issue.dueDate) return false;
  if (issue.status === 'resolved' || issue.status === 'closed') return false;
  return new Date(issue.dueDate) < new Date();
}

/**
 * 이슈 통계 계산
 */
export interface QualityIssueStats {
  total: number;
  byStatus: Record<QualityIssue['status'], number>;
  byPriority: Record<QualityIssue['priority'], number>;
  byCategory: Record<QualityIssue['category'], number>;
  overdue: number;
  resolved: number;
  inProgress: number;
}

export function calculateQualityIssueStats(issues: QualityIssue[]): QualityIssueStats {
  const stats: QualityIssueStats = {
    total: issues.length,
    byStatus: {
      new: 0,
      investigating: 0,
      in_progress: 0,
      verifying: 0,
      resolved: 0,
      closed: 0,
    },
    byPriority: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    byCategory: {
      defect: 0,
      process: 0,
      design: 0,
      measurement: 0,
      supplier: 0,
      other: 0,
    },
    overdue: 0,
    resolved: 0,
    inProgress: 0,
  };

  issues.forEach(issue => {
    stats.byStatus[issue.status]++;
    stats.byPriority[issue.priority]++;
    stats.byCategory[issue.category]++;

    if (isIssueOverdue(issue)) {
      stats.overdue++;
    }

    if (issue.status === 'resolved' || issue.status === 'closed') {
      stats.resolved++;
    }

    if (issue.status === 'investigating' || issue.status === 'in_progress' || issue.status === 'verifying') {
      stats.inProgress++;
    }
  });

  return stats;
}

