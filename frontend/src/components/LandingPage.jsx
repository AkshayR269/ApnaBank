import React from 'react';
import { ArrowRight, ShieldCheck, Lock, CreditCard, Wallet, TrendingUp, CheckCircle, UserCheck } from 'lucide-react';

export const LandingPage = ({ onOpenAuth }) => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="bg-white p-8 sm:p-14 rounded-2xl border border-slate-200 shadow-xs text-center max-w-4xl mx-auto">
        <div className="space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Personal & Business Banking</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Simple, Transparent, and <br className="hidden sm:inline" />
            <span className="text-blue-700">Secure Online Banking</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Manage your Checking, High-Yield Savings, and Debit Cards with real-time transaction processing and zero monthly account fees.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm shadow-xs transition flex items-center justify-center space-x-2"
            >
              <span>Access Your Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm border border-slate-200 transition flex items-center justify-center space-x-2"
            >
              <UserCheck className="w-4 h-4 text-slate-600" />
              <span>Explore Demo Account</span>
            </button>
          </div>

          {/* Security Banner */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 border-t border-slate-100 max-w-lg mx-auto mt-6">
            <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" /> FDIC Insured ($250,000)</span>
            <span className="flex items-center"><Lock className="w-3.5 h-3.5 text-slate-600 mr-1" /> 256-bit AES Security</span>
            <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-slate-600 mr-1" /> No Hidden Maintenance Fees</span>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Checking & Savings</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Separate everyday spending in Checking from long-term wealth in High-Yield Savings (4.25% APY).
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Card Controls</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Manage debit card security with 1-click Freeze/Unfreeze controls and instant transaction alerts.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Instant Transfers</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Transfer money internally or to peer accounts backed by atomic database row locking.
          </p>
        </div>
      </div>
    </div>
  );
};
