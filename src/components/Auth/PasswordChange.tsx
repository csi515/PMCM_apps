import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Lock, X } from 'lucide-react';

interface PasswordChangeProps {
  isOpen: boolean;
  onClose: () => void;
}

function PasswordChange({ isOpen, onClose }: PasswordChangeProps) {
  const { changePassword, currentUser } = useApp();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // 유효성 검사
    if (newPassword.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('현재 비밀번호와 새 비밀번호가 같습니다.');
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      // 성공 후 폼 초기화
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card w-full max-w-md m-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">비밀번호 변경</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-green-600 mb-2">비밀번호가 변경되었습니다.</p>
            <p className="text-sm text-neutral-500">잠시 후 창이 닫힙니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                현재 비밀번호
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field"
                placeholder="현재 비밀번호를 입력하세요"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                새 비밀번호
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="새 비밀번호를 입력하세요 (최소 4자)"
                minLength={4}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                새 비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="새 비밀번호를 다시 입력하세요"
                minLength={4}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary flex-1"
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? '변경 중...' : '변경'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PasswordChange;

