import { PPAPDocumentType } from '../types';
import {
  FileText,
  ClipboardList,
  BarChart3,
  Ruler,
  GitBranch,
  FileImage,
  FileCheck,
  TestTube,
  Award,
  File,
  LucideIcon,
} from 'lucide-react';

/**
 * PPAP 문서 타입 한글 라벨 반환
 */
export function getPPAPDocumentTypeLabel(type: PPAPDocumentType): string {
  const labels: Record<PPAPDocumentType, string> = {
    DFMEA: '제품 FMEA',
    PFMEA: '공정 FMEA',
    CONTROL_PLAN: '관리 계획서',
    SPC_REPORT: 'SPC 분석 보고서',
    MSA_REPORT: 'MSA 분석 보고서',
    PROCESS_FLOW: '공정 흐름도',
    DRAWING: '도면',
    SPECIFICATION: '규격서',
    TEST_REPORT: '시험 보고서',
    CERTIFICATE: '인증서',
    OTHER: '기타',
  };
  return labels[type] || type;
}

/**
 * PPAP 문서 타입별 아이콘 반환
 */
export function getPPAPDocumentTypeIcon(type: PPAPDocumentType): LucideIcon {
  const icons: Record<PPAPDocumentType, LucideIcon> = {
    DFMEA: ClipboardList,
    PFMEA: ClipboardList,
    CONTROL_PLAN: FileCheck,
    SPC_REPORT: BarChart3,
    MSA_REPORT: BarChart3,
    PROCESS_FLOW: GitBranch,
    DRAWING: FileImage,
    SPECIFICATION: FileText,
    TEST_REPORT: TestTube,
    CERTIFICATE: Award,
    OTHER: File,
  };
  return icons[type] || File;
}

/**
 * 필수 문서 타입 목록 반환
 */
export function getRequiredDocuments(): PPAPDocumentType[] {
  return [
    'DFMEA',
    'PFMEA',
    'CONTROL_PLAN',
    'SPC_REPORT',
    'MSA_REPORT',
  ];
}

/**
 * 문서 타입이 필수 문서인지 확인
 */
export function isDocumentRequired(type: PPAPDocumentType): boolean {
  return getRequiredDocuments().includes(type);
}

/**
 * FormSelect용 문서 타입 옵션 배열 반환
 */
export function getDocumentTypeOptions(): Array<{ value: PPAPDocumentType; label: string }> {
  const types: PPAPDocumentType[] = [
    'DFMEA',
    'PFMEA',
    'CONTROL_PLAN',
    'SPC_REPORT',
    'MSA_REPORT',
    'PROCESS_FLOW',
    'DRAWING',
    'SPECIFICATION',
    'TEST_REPORT',
    'CERTIFICATE',
    'OTHER',
  ];
  
  return types.map(type => ({
    value: type,
    label: getPPAPDocumentTypeLabel(type),
  }));
}

/**
 * 필수 문서 체크리스트 생성
 * @param documents 현재 등록된 문서 목록
 * @returns 누락된 필수 문서 목록
 */
export function getMissingRequiredDocuments(
  documents: Array<{ type: PPAPDocumentType }>
): PPAPDocumentType[] {
  const required = getRequiredDocuments();
  const existingTypes = documents.map(doc => doc.type);
  return required.filter(type => !existingTypes.includes(type));
}

/**
 * 필수 문서 체크리스트 상태 반환
 * @param documents 현재 등록된 문서 목록
 * @returns 각 필수 문서의 등록 여부
 */
export function getRequiredDocumentsChecklist(
  documents: Array<{ type: PPAPDocumentType }>
): Record<PPAPDocumentType, boolean> {
  const required = getRequiredDocuments();
  const existingTypes = documents.map(doc => doc.type);
  
  const checklist: Partial<Record<PPAPDocumentType, boolean>> = {};
  required.forEach(type => {
    checklist[type] = existingTypes.includes(type);
  });
  
  return checklist as Record<PPAPDocumentType, boolean>;
}

