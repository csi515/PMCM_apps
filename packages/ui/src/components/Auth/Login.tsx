import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [ssnPrefix, setSsnPrefix] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(employeeId, ssnPrefix);
    } catch (error) {
      setError('사번 또는 주민등록번호 앞자리가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-200 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[100px] opacity-30 animation-delay-2000 animate-pulse"></div>
      </div>

      <div className="w-full max-w-md z-10 px-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-glass border border-white/50 p-8 md:p-10 relative overflow-hidden">
          {/* Top Accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-indigo-600"></div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-primary-500/30 transform transition-transform hover:scale-110 duration-300">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 font-display tracking-tight mb-2">Welcome Back</h1>
            <p className="text-neutral-500 text-sm font-medium">CQT-MES Enterprise System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center animate-shake">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="employeeId" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">
                  Employee ID
                </label>
                <div className="relative group">
                  <input
                    id="employeeId"
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-200 font-medium placeholder:text-neutral-400 group-hover:bg-white"
                    placeholder="E.g. E001"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ssnPrefix" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">
                  Access Code (SSN 6)
                </label>
                <div className="relative group">
                  <input
                    id="ssnPrefix"
                    type="password"
                    value={ssnPrefix}
                    onChange={(e) => setSsnPrefix(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 bg-white/50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-200 font-medium placeholder:text-neutral-400 group-hover:bg-white tracking-widest"
                    placeholder="••••••"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center group"
            >
              Sign In to Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col items-center space-y-4">
            <Link
              to="/password-reset"
              className="text-sm font-medium text-neutral-500 hover:text-primary-600 transition-colors"
            >
              Forgot your credentials?
            </Link>

            <div className="text-[10px] text-neutral-400 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100">
              Demo: E001 / 900101
            </div>
          </div>
        </div>

        <p className="text-center text-neutral-400 text-xs mt-6 font-medium">
          © 2024 PMCM Core Tools System. Secure Environment.
        </p>
      </div>
    </div>
  );
}

export default Login;
