import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ClipboardList,
  BarChart3,
  CheckCircle,
  FileCheck,
  GitBranch,
  History,
  AlertTriangle,
} from 'lucide-react';

interface MenuItem {
  title: string;
  path?: string;
  icon?: typeof LayoutDashboard;
  role?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: '대시보드',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: '시스템 관리',
    children: [
      {
        title: '사용자 관리',
        path: '/admin/users',
        icon: Users,
        role: 'Admin',
      },
    ],
  },
  {
    title: 'Phase 1: 기획 및 정의',
    children: [
      {
        title: 'VOC 관리',
        path: '/phase1/voc',
        icon: FileText,
      },
      {
        title: '특별 특성',
        path: '/phase1/characteristics',
        icon: Settings,
      },
    ],
  },
  {
    title: 'Phase 2: 제품 설계',
    children: [
      {
        title: 'DFMEA',
        path: '/phase2/dfmea',
        icon: ClipboardList,
      },
    ],
  },
  {
    title: 'Phase 3: 공정 설계',
    children: [
      {
        title: '공정 흐름도',
        path: '/phase3/process-flow',
        icon: GitBranch,
      },
      {
        title: 'PFMEA',
        path: '/phase3/pfmea',
        icon: ClipboardList,
      },
      {
        title: '관리 계획서',
        path: '/phase3/control-plan',
        icon: FileCheck,
      },
    ],
  },
  {
    title: 'Phase 4: 유효성 확인',
    children: [
      {
        title: 'SPC 분석',
        path: '/phase4/spc',
        icon: BarChart3,
      },
      {
        title: 'MSA 분석',
        path: '/phase4/msa',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Phase 5: PPAP',
    children: [
      {
        title: 'PPAP 관리',
        path: '/phase5/ppap',
        icon: CheckCircle,
      },
    ],
  },
  {
    title: '협업',
    children: [
      {
        title: 'ECR 관리',
        path: '/collaboration/ecr',
        icon: FileText,
      },
      {
        title: '감사 이력',
        path: '/collaboration/audit-trail',
        icon: History,
      },
    ],
  },
  {
    title: '품질 관리',
    children: [
      {
        title: '품질 이슈',
        path: '/quality/issues',
        icon: AlertTriangle,
      },
    ],
  },
  {
    title: '분석 및 보고서',
    children: [
      {
        title: '통계 분석',
        path: '/analytics',
        icon: BarChart3,
      },
      {
        title: '보고서 생성',
        path: '/reports',
        icon: FileText,
      },
      {
        title: '데이터 가져오기/내보내기',
        path: '/data/import-export',
        icon: FileText,
      },
    ],
  },
  {
    title: '고급 기능',
    children: [
      {
        title: 'FMEA 템플릿',
        path: '/templates/fmea',
        icon: FileText,
      },
      {
        title: '워크플로우 규칙',
        path: '/workflow/rules',
        icon: Settings,
      },
      {
        title: '알림 설정',
        path: '/settings/notifications',
        icon: Settings,
      },
    ],
  },
];

function Sidebar() {
  const location = useLocation();
  const { currentUser } = useApp();

  const isActive = (path?: string) => path && location.pathname === path;

  const renderMenuItem = (item: MenuItem): React.ReactNode => {
    if (item.children) {
      return (
        <div key={item.title} className="mb-6">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 mb-2">
            {item.title}
          </h3>
          <div className="space-y-1">
            {item.children
              .filter((child) => !child.role || currentUser?.role === child.role)
              .map((child) => renderMenuItem(child))}
          </div>
        </div>
      );
    }

    if (!item.path) return null;

    const Icon = item.icon;
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
          isActive(item.path)
            ? 'bg-primary-50 text-primary-700'
            : 'text-neutral-700 hover:bg-neutral-100'
        }`}
      >
        {Icon && <Icon className="w-5 h-5 mr-3" />}
        {item.title}
      </Link>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-neutral-200 flex flex-col">
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900">CQT-MES</h2>
        <p className="text-xs text-neutral-500 mt-1">품질 관리 시스템</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>
    </div>
  );
}

export default Sidebar;

