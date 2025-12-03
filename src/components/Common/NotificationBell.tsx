import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Bell, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function NotificationBell() {
  const { notifications, currentUser, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationCount } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const userNotifications = notifications
    .filter(n => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = getUnreadNotificationCount();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markNotificationAsRead(notification.id);
    
    // 관련 페이지로 이동
    const routes: Record<string, string> = {
      'PPAP': '/phase5/ppap',
      'ECR': '/collaboration/ecr',
      'DFMEA': '/phase2/dfmea',
      'PFMEA': '/phase3/pfmea',
    };
    
    const route = routes[notification.relatedEntityType];
    if (route) {
      navigate(route);
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval_request':
        return '🔔';
      case 'approval_result':
        return '✅';
      case 'comment':
        return '💬';
      case 'mention':
        return '📢';
      case 'assignment':
        return '📋';
      default:
        return '📌';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-medium border border-neutral-200 z-50 max-h-[500px] flex flex-col">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900">알림</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  모두 읽음
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-neutral-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {userNotifications.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                알림이 없습니다.
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {userNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-neutral-50 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-neutral-900' : 'text-neutral-700'}`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-neutral-400 mt-2">
                          {new Date(notification.createdAt).toLocaleString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

