import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { LogIn } from 'lucide-react';

function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [ssnPrefix, setSsnPrefix] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();
  
  // 로그인 성공 시 대시보드로 이동
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // 로그인 시도 (사번 + 주민등록번호 앞자리)
      await login(employeeId, ssnPrefix);
      // 성공 시 useEffect에서 자동으로 리다이렉트
    } catch (error) {
      setError('사번 또는 주민등록번호 앞자리가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">CQT-MES</h1>
          <p className="text-neutral-600">Core Tools Quality Management System</p>
        </div>

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
              onChange={(e) => setEmployeeId(e.target.value)}
              className="input-field"
              placeholder="사번을 입력하세요 (예: E001)"
              required
            />
          </div>

          <div>
            <label htmlFor="ssnPrefix" className="block text-sm font-medium text-neutral-700 mb-2">
              주민등록번호 앞자리
            </label>
            <input
              id="ssnPrefix"
              type="text"
              value={ssnPrefix}
              onChange={(e) => setSsnPrefix(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="input-field"
              placeholder="주민등록번호 앞자리 6자리 (예: 900101)"
              maxLength={6}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            로그인
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
          <Link 
            to="/password-reset" 
            className="block text-center text-sm text-primary-600 hover:text-primary-700"
          >
            비밀번호 재설정
          </Link>
          <p className="text-xs text-neutral-500 text-center">
            테스트 계정: E001/900101, E002/850215, E003/920330
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

