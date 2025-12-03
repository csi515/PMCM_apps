import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { LogOut, Lock } from 'lucide-react';
import NotificationBell from '../Common/NotificationBell';
import PasswordChange from '../Auth/PasswordChange';

function Header() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role?: string) => {
    const badges: Record<string, string> = {
      ADMIN: 'badge-danger',
      APPROVER: 'badge-warning',
      USER: 'badge-info',
    };
    return badges[role || ''] || 'badge-info';
  };

  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">품질 관리 시스템</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationBell />
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-neutral-900">
                {currentUser?.name}
              </div>
              <div className="text-xs text-neutral-500">
                {currentUser?.department || currentUser?.dept} · {currentUser?.position}
              </div>
            </div>
            <div className={`badge ${getRoleBadge(currentUser?.role)}`}>
              {currentUser?.role}
            </div>
          </div>
          
          <button
            onClick={() => setIsPasswordChangeOpen(true)}
            className="btn-secondary flex items-center gap-2"
            title="비밀번호 변경"
          >
            <Lock className="w-4 h-4" />
            비밀번호 변경
          </button>
          
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </div>
      
      <PasswordChange
        isOpen={isPasswordChangeOpen}
        onClose={() => setIsPasswordChangeOpen(false)}
      />
    </header>
  );
}

export default Header;

