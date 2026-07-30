import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Landmark, Lock, Mail, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

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
      setError(err.message || 'Authentication failed. Please try again.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl border border-slate-700/60 relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isRegister ? 'Create ApexBank Account' : 'Welcome to ApexBank'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isRegister ? 'Enter your details to open Checking & Savings accounts' : 'Access your accounts and transaction ledger'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* 1-Click Demo Login Quick Bar */}
        {!isRegister && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3.5 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 mr-1" /> 1-Click Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('alex.morgan@apexbank.com', 'Alex Morgan')}
                className="px-3 py-2 rounded-xl bg-slate-700/60 hover:bg-indigo-600/30 border border-slate-600/50 text-xs font-medium text-slate-200 transition text-center"
              >
                Alex Morgan
                <span className="block text-[10px] text-slate-400 font-normal">Primary Checking</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('sarah.connor@apexbank.com', 'Sarah Connor')}
                className="px-3 py-2 rounded-xl bg-slate-700/60 hover:bg-indigo-600/30 border border-slate-600/50 text-xs font-medium text-slate-200 transition text-center"
              >
                Sarah Connor
                <span className="block text-[10px] text-slate-400 font-normal">Premium Savings</span>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@apexbank.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Authenticating...' : isRegister ? 'Register & Provision Accounts' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Signup/Login */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
