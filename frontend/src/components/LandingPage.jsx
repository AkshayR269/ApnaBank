import React from 'react';
import { Landmark, ArrowRight, ShieldCheck, Zap, Lock, CreditCard, Wallet, TrendingUp, CheckCircle, UserCheck } from 'lucide-react';

export const LandingPage = ({ onOpenAuth }) => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <div className="glass-panel p-10 sm:p-16 rounded-3xl relative overflow-hidden border border-slate-700/60 shadow-2xl text-center max-w-5xl mx-auto">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Enterprise Digital Banking V1</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            The Next Generation of <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">Intelligent Banking</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Manage your Checking, Savings, and Virtual Debit Cards with bank-grade security, instant peer transfers, and real-time ledger accounting.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
            >
              <span>Access Your Account</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-base border border-slate-700 transition flex items-center justify-center space-x-2"
            >
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <span>Try Demo Account</span>
            </button>
          </div>

          {/* Security Banner */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 max-w-xl mx-auto mt-8">
            <span className="flex items-center"><ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5" /> FDIC Insured to $250k</span>
            <span className="flex items-center"><Lock className="w-4 h-4 text-indigo-400 mr-1.5" /> 256-bit AES Encryption</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 text-violet-400 mr-1.5" /> Zero Hidden Fees</span>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Feature 1 */}
        <div className="glass-card p-8 rounded-3xl space-y-4 border border-slate-700/50 hover:border-indigo-500/40 transition">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Dual Account Vaults</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Separate everyday spending in Checking from long-term wealth in High-Yield Savings (4.25% APY).
          </p>
        </div>

        {/* Feature 2 */}
        <div className="glass-card p-8 rounded-3xl space-y-4 border border-slate-700/50 hover:border-indigo-500/40 transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Virtual Debit Controls</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Generate virtual debit cards with instant 1-click **Freeze / Unfreeze** toggles and masked security credentials.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="glass-card p-8 rounded-3xl space-y-4 border border-slate-700/50 hover:border-indigo-500/40 transition">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Atomic Money Transfers</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Send money to internal or peer accounts backed by row-level database locking and strict ACID transactions.
          </p>
        </div>
      </div>
    </div>
  );
};
