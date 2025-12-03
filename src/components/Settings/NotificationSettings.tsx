import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Bell, Mail, Smartphone, Save } from 'lucide-react';

function NotificationSettings() {
  const { currentUser, notificationSettings } = useApp();
  const [settings, setSettings] = useState(() => {
    const userSettings = notificationSettings.find(s => s.userId === currentUser?.id);
    return userSettings || {
      userId: currentUser?.id || 0,
      emailNotifications: true,
      inAppNotifications: true,
      notificationTypes: {
        approval_request: true,
        approval_result: true,
        comment: true,
        mention: true,
        data_change: false,
        assignment: true,
      },
    };
  });

  const handleSave = () => {
    // 설정 저장 로직
    alert('알림 설정이 저장되었습니다.');
  };

  const toggleNotificationType = (type: keyof typeof settings.notificationTypes) => {
    setSettings({
      ...settings,
      notificationTypes: {
        ...settings.notificationTypes,
        [type]: !settings.notificationTypes[type],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">알림 설정</h2>
        <p className="text-neutral-600">알림 수신 방식을 커스터마이징하세요</p>
      </div>

      {/* 알림 채널 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">알림 채널</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-neutral-600" />
              <div>
                <div className="font-medium text-neutral-900">이메일 알림</div>
                <div className="text-sm text-neutral-600">이메일로 알림을 받습니다</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotifications: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-neutral-600" />
              <div>
                <div className="font-medium text-neutral-900">앱 내 알림</div>
                <div className="text-sm text-neutral-600">웹 앱 내에서 알림을 받습니다</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.inAppNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, inAppNotifications: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 알림 유형 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">알림 유형</h3>
        <div className="space-y-3">
          {Object.entries(settings.notificationTypes).map(([type, enabled]) => (
            <div
              key={type}
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-neutral-600" />
                <span className="font-medium text-neutral-900">
                  {type === 'approval_request' && '승인 요청'}
                  {type === 'approval_result' && '승인 결과'}
                  {type === 'comment' && '댓글'}
                  {type === 'mention' && '멘션'}
                  {type === 'data_change' && '데이터 변경'}
                  {type === 'assignment' && '작업 할당'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => toggleNotificationType(type as keyof typeof settings.notificationTypes)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          설정 저장
        </button>
      </div>
    </div>
  );
}

export default NotificationSettings;

