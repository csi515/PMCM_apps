# 🏭 Core Tools 품질 관리 시스템 (CQT-MES)

## 🎯 프로젝트 개요

CQT-MES (Core Tools Quality Management System)는 APQP(Advanced Product Quality Planning) 프로세스를 기반으로 품질 핵심 도구(Core Tools: FMEA, CP, SPC, MSA, PPAP)를 통합하여 관리하는 웹 애플리케이션입니다.

본 시스템은 MES(제조 실행 시스템)와의 데이터 연동 및 Excel 업로드 기능을 통해 공정 데이터를 자동으로 수집하고, 실시간으로 품질 분석 및 리포팅을 수행하여 제품의 기획 단계부터 양산에 이르기까지 전 주기에 걸친 선제적 위험 관리 및 품질 개선을 목표로 합니다.

## ✨ 주요 기능 및 특징

### MES & Excel 데이터 통합
- MES의 API를 통한 공정 측정 데이터의 자동 수집 및 실시간 SPC 연동
- MES에서 내보낸 Excel 파일을 업로드하여 공정 데이터를 DB에 자동으로 적용하는 Excel 파서 기능 제공

### 외부 문서 링크 연동
- 시스템에 직접 파일을 업로드하는 대신, 회사 DB 또는 DMS(문서 관리 시스템)에 저장된 **원본 파일의 링크(URL/경로)**를 관리하여 데이터 무결성을 유지하고 최신 파일에 즉시 접근 가능
- 도면, 규격서, 최종 리포트 등의 링크를 FMEA 항목 또는 PPAP 제출물에 직접 연결

### APQP 단계별 품질 프로세스 통합
- APQP 5단계 흐름에 따라 Core Tools 활동을 체계적으로 관리하고, 다음 단계로의 이관 및 최종 PPAP 승인 관리를 지원

### 실시간 품질 대시보드
- 프로젝트별 APQP 진행률, 고위험 FMEA 항목, 주요 공정의 $C_{pk}$ 현황을 시각적으로 제공

### 협업 및 거버넌스 강화
- 기술위원회 및 변경점 관리(ECR) 워크플로우를 통한 다부서 승인 프로세스 자동화
- 모든 주요 데이터 변경에 대한 감사 이력(Audit Trail) 및 버전 관리 기능 제공
- 품질 이슈 추적 및 8D Report 연계를 통한 체계적인 문제 해결 프로세스
- 실시간 알림 시스템 (승인 요청, 댓글, 멘션, 할당 등)
- 댓글 및 피드백 시스템 (@멘션 기능 포함)

## 📝 Core Tools 모듈 및 APQP 연동

본 시스템은 APQP의 각 단계별 산출물을 관리하는 모듈로 구성됩니다.

| APQP 단계 | 모듈명 | 핵심 활동 및 기능 | 연동 Core Tool |
|-----------|--------|-------------------|----------------|
| **1단계** | 계획 및 정의 | 고객 VOC 반영, 제품/공정의 특별 특성(Critical Characteristics) 정의 및 DB 등록 | VOC |
| **2단계** | 제품 설계 및 개발 | DFMEA 작성 및 RPN 계산, 설계 변경 사항 추적 및 도면 링크 관리 | DFMEA |
| **3단계** | 공정 설계 및 개발 | 공정 흐름도 작성, PFMEA 분석 및 개선 대책 수립, 관리 계획서(CP) 작성 | PFMEA, CP |
| **4단계** | 제품 및 공정 유효성 확인 | MES 연동 및 Excel 업로드를 통한 공정 데이터 수집, MSA/SPC 분석 수행 | MSA, SPC |
| **PPAP 관리** | - | 4단계 산출물(FMEA, CP, SPC/MSA 결과)을 취합하여 PPAP 제출 패키지 구성 및 전자 승인 워크플로우 관리 (ECR 연동)<br/>- 표준 문서 타입 관리 (DFMEA, PFMEA, Control Plan, SPC/MSA Report 등)<br/>- 필수 문서 체크리스트 및 문서 링크 관리<br/>- 승인/반려 워크플로우 (반려 사유 관리 포함)<br/>- 프로젝트별 필터링 및 검색 기능 | PPAP |
| **5단계** | 피드백, 평가 및 수정 조치 | 양산 피드백 반영, FMEA/CP 업데이트, 시정 및 예방 조치(8D Report) 이력 추적 (감사 이력 기록) | FMEA (재검토) |
| **품질 이슈 관리** | - | 품질 문제 등록, 추적 및 해결<br/>- 카테고리별 분류 (불량, 공정, 설계, 측정, 협력사 등)<br/>- 우선순위 및 심각도 관리<br/>- 8D Report 연계 및 상태 추적<br/>- 담당자 할당 및 기한 관리 | Quality Issue |

## 📚 시스템 지원 모듈

| 모듈명 | 핵심 기능 |
|--------|-----------|
| **사용자 및 권한 관리** | 시스템 관리자가 부서별 사용자(팀원) 및 **결재권자(부서장)**를 지정하고 변경할 수 있도록 지원. 부서/직무별 기능 접근 권한 제어 |
| **표준 라이브러리** | 표준 고장 모드/원인, 표준 측정/검사 방법 목록을 구축 및 관리 |
| **감사 이력/버전 관리** | FMEA, CP, PPAP 등 주요 문서의 모든 변경 이력을 기록하고 버전별 비교 기능 제공 |
| **기술위원회/ECR** | 부서 간 변경 요청 및 승인 워크플로우 관리 (승인/반려 기능 포함) |
| **품질 이슈 관리** | 품질 문제 등록, 추적, 해결 및 8D Report 연계 |
| **알림 및 협업** | 실시간 알림 시스템, 댓글/피드백, @멘션 기능, 작업 할당 및 상태 관리 |
| **공통 컴포넌트** | 재사용 가능한 UI 컴포넌트 (DocumentManager, Modal, DataTable, Form 컴포넌트 등) |

## 📊 핵심 데이터 분석 기능

### 3.1. SPC (통계적 공정 관리)
- **데이터 소스**: MES 자동 수집 또는 Excel 업로드
- **분석 항목**: 실시간 관리도(Xbar-R, Xbar-s), 공정 능력 지수($C_p, C_{pk}, P_p, P_{pk}$) 자동 계산 및 추이 관리

### 3.2. MSA (측정 시스템 분석)
- **분석 항목**: 게이지 R&R 실험 데이터 분석 (ANOVA 기반), %GRR, NDC 계산 및 측정 시스템 합격/불합격 판정

## 💻 기술 스택

### 프론트엔드
- **React 18+** (Functional Components, Hooks)
- **TypeScript** (타입 안정성 및 개발 생산성 향상)
- **Tailwind CSS** (유틸리티 기반 스타일링, Figma 디자인 시스템 적용)
- **React Router** (라우팅 및 보호된 라우트)
- **React Context API** (전역 상태 관리)
- **Chart.js / react-chartjs-2** (SPC 차트 및 통계 시각화)
- **Lucide React** (아이콘 라이브러리)
- **date-fns** (날짜 포맷팅)
- **xlsx** (Excel 파일 파싱)
- **jspdf / jspdf-autotable** (PDF 리포트 생성)

### 백엔드 (준비 중)
- Node.js (Express) 또는 Python (Flask/Django)
- RESTful API 서비스 레이어 준비 완료

### 데이터베이스
- SQL (MySQL, PostgreSQL) 또는 NoSQL (MongoDB, Firestore)
- 현재는 Mock 데이터로 동작하며, 백엔드 연동 준비 완료

### 데이터 연동
- RESTful API (MES 연동 준비 완료)
- XLSX 파서 라이브러리 (Excel 업로드 시뮬레이션)

## 🚀 시작하기

### 필수 요구사항
- Node.js (v18 이상 권장)
- npm 또는 yarn
- MES 시스템 API 접근 권한 (선택사항, 현재는 Mock 데이터로 동작)

### 설치 방법
```bash
# 저장소 클론
git clone https://github.com/csi515/core_tools.git
cd core_tools

# 의존성 설치
npm install
```

### 환경 설정
환경 변수 파일을 생성하고 필요한 설정을 추가하세요:
```bash
cp .env.example .env
```

필요한 환경 변수:
- `VITE_API_BASE_URL`: 백엔드 API 기본 URL (선택사항, Mock 모드 사용 시 불필요)
- `VITE_USE_MOCK_API`: Mock API 사용 여부 (기본값: true)

### 실행
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## 📖 문서

- [API 문서](./docs/API.md)
- [사용자 가이드](./docs/USER_GUIDE.md)
- [개발 가이드](./docs/DEVELOPMENT.md)
- [백엔드 연동 가이드](./docs/BACKEND_INTEGRATION.md)

## 🎨 주요 UI/UX 특징

### 공통 컴포넌트 시스템
- **재사용 가능한 컴포넌트**: Modal, DataTable, Form 컴포넌트, Badge, EmptyState 등
- **DocumentManager**: 문서 관리 공통 컴포넌트 (PPAP, FMEA 등에서 재사용)
- **일관된 디자인 시스템**: Figma 스타일 가이드 적용

### 사용자 경험
- **반응형 디자인**: 데스크톱 우선, 모바일 지원
- **실시간 알림**: 승인 요청, 댓글, 할당 등에 대한 즉시 알림
- **고급 필터링**: 다중 조건 필터링 및 검색 기능
- **상태 관리**: 직관적인 상태 뱃지 및 색상 코딩

## 🔐 인증 및 권한 관리

### 로그인
- 사번(Employee ID) + 주민등록번호 앞자리 기반 인증
- 비밀번호 변경 및 재설정 기능

### 권한 레벨
- **ADMIN**: 시스템 관리자 (모든 기능 접근, 사용자 관리)
- **APPROVER**: 결재권자 (PPAP, ECR 승인/반려 권한)
- **USER**: 일반 사용자 (데이터 조회 및 등록)

### 데이터 가시성
- **Personal**: 개인 전용
- **Department**: 부서 공유
- **Project**: 프로젝트 공유
- **Public**: 전체 공개

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면 이슈를 등록하거나 Pull Request를 보내주세요.

## 📄 라이선스

[라이선스 정보]

## 📧 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.


