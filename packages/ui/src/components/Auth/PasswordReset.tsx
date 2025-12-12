import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Lock, ArrowLeft } from 'lucide-react';

function PasswordReset() {
  const { resetPassword } = useApp();
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [ssnSuffix, setSsnSuffix] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // 유효성 검사
    if (ssnSuffix.length !== 7) {
      setError('주민등록번호 뒷자리는 7자리여야 합니다.');
      return;
    }

    if (newPassword.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(employeeId, ssnSuffix, newPassword);
      setSuccess(true);
      // 성공 후 3초 뒤 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || '비밀번호 재설정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="card w-full max-w-md m-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">비밀번호 재설정</h1>
          <p className="text-neutral-600">본인 인증 후 새 비밀번호를 설정하세요</p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-green-600 mb-2">비밀번호가 재설정되었습니다.</p>
            <p className="text-sm text-neutral-500 mb-4">잠시 후 로그인 페이지로 이동합니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-neutral-700 mb-2">
                사번
              </label>
              <input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                className="input-field"
                placeholder="사번을 입력하세요 (예: E001)"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="ssnSuffix" className="block text-sm font-medium text-neutral-700 mb-2">
                주민등록번호 뒷자리
              </label>
              <input
                id="ssnSuffix"
                type="text"
                value={ssnSuffix}
                onChange={(e) => setSsnSuffix(e.target.value.replace(/\D/g, '').slice(0, 7))}
                className="input-field"
                placeholder="주민등록번호 뒷자리 7자리 (예: 1234567)"
                maxLength={7}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-neutral-500 mt-1">
                본인 인증을 위해 주민등록번호 뒷자리를 입력하세요
              </p>
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

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '비밀번호 재설정'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-neutral-200">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4" />
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;

