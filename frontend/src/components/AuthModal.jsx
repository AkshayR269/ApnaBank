import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Landmark, Lock, Mail, User, ArrowRight, Zap } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(fullName, email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoName) => {
    setError('');
    setSubmitting(true);
    try {
      await login(demoEmail, 'password123');
      onClose();
    } catch (err) {
      setError('Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 relative text-slate-900">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-2.5">
            <Landmark className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isRegister ? 'Open ApexBank Account' : 'Sign In to Online Banking'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRegister ? 'Enter your details to open accounts' : 'Access your Checking, Savings & Cards'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center">
            {error}
          </div>
        )}

        {/* 1-Click Demo Login Bar */}
        {!isRegister && (
          <div className="mb-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-2 flex items-center justify-center">
              <Zap className="w-3 h-3 text-blue-700 mr-1" /> Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('alex.morgan@apexbank.com', 'Alex Morgan')}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 transition text-center"
              >
                Alex Morgan
                <span className="block text-[9px] text-slate-500">Checking Account</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('sarah.connor@apexbank.com', 'Sarah Connor')}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 transition text-center"
              >
                Sarah Connor
                <span className="block text-[9px] text-slate-500">Savings Account</span>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-700"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@apexbank.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs shadow-xs transition flex items-center justify-center space-x-1.5"
          >
            <span>{submitting ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500">
          {isRegister ? 'Already registered?' : 'New to ApexBank?'}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-700 hover:underline font-semibold ml-0.5"
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
