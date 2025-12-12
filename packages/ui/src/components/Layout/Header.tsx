import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { LogOut, Lock } from 'lucide-react';
import NotificationBell from '../Common/NotificationBell';
import PasswordChange from '../Auth/PasswordChange';

export interface HeaderProps {
  appName?: string;
}

export function Header({ appName }: HeaderProps) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = (path: string) => {
    // Basic title mapping logic (can be expanded)
    if (path === '/dashboard') return 'Dashboard';
    if (path.includes('/admin')) return 'System Administration';
    if (path.includes('/phase1')) return 'Phase 1: Planning';
    if (path.includes('/phase2')) return 'Phase 2: Product Design';
    if (path.includes('/phase3')) return 'Phase 3: Process Design';
    if (path.includes('/phase4')) return 'Phase 4: Validation';
    if (path.includes('/phase5')) return 'Phase 5: Production';
    if (path.includes('/collaboration')) return 'Collaboration';
    return 'CQT-MES';
  };

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-glass flex items-center justify-between px-8 z-30 sticky top-0 transition-all duration-300">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-neutral-900 font-display tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
            {appName || getPageTitle(location.pathname)}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <NotificationBell />

          <div className="h-8 w-px bg-neutral-200"></div>

          <div className="flex items-center gap-4 group">
            <div className="text-right hidden md:block">
              <div className="text-sm font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
                {currentUser?.name || 'Guest'}
              </div>
              <div className="text-xs font-medium text-neutral-500">
                {currentUser?.department || currentUser?.dept} · {currentUser?.position}
              </div>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-soft group-hover:scale-105 transition-all duration-200 cursor-pointer">
                {currentUser?.name?.[0] || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                <div className={`w-2.5 h-2.5 rounded-full ${currentUser?.role === 'ADMIN' ? 'bg-red-500' : 'bg-green-500'}`}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPasswordChangeOpen(true)}
              className="p-2.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
              title="비밀번호 변경"
            >
              <Lock className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              title="로그아웃"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <PasswordChange
        isOpen={isPasswordChangeOpen}
        onClose={() => setIsPasswordChangeOpen(false)}
      />
    </>
  );
}

