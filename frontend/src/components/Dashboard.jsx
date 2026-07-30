import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Send, PlusCircle, CreditCard, ShieldCheck, Wallet, RefreshCw } from 'lucide-react';

export const Dashboard = ({ accounts, onOpenTransfer, onOpenDeposit, onRefresh }) => {
  const checking = accounts.find(a => a.accountType === 'CHECKING') || accounts[0] || { balance: 0, accountNumber: 'N/A' };
  const savings = accounts.find(a => a.accountType === 'SAVINGS') || accounts[1] || { balance: 0, accountNumber: 'N/A' };

  const totalNetWorth = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  return (
    <div className="space-y-8">
      {/* Top Banner / Net Worth Summary */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-slate-700/50 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs uppercase tracking-widest font-bold mb-1">
              <Wallet className="w-4 h-4" />
              <span>Combined Liquidity</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
            <p className="text-xs text-slate-400 mt-2 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              FDIC Insured Up To $250,000 • Real-time Ledger Sync
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenTransfer}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              <span>Send Money</span>
            </button>

            <button
              onClick={onOpenDeposit}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Deposit Funds</span>
            </button>

            <button
              onClick={onRefresh}
              className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white border border-slate-700/50 transition"
              title="Refresh Balances"
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checking Account Card */}
        <div className="card-gradient-primary p-7 rounded-3xl shadow-xl relative overflow-hidden border border-indigo-400/20 text-white flex flex-col justify-between h-56 transform transition hover:scale-[1.01]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                Checking Account
              </span>
              <p className="text-xs text-indigo-300 mt-3 font-mono">
                {checking.accountNumber}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-indigo-300/60" />
          </div>

          <div>
            <p className="text-xs text-indigo-200">Available Balance</p>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">
              ${(checking.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        {/* Savings Account Card */}
        <div className="card-gradient-savings p-7 rounded-3xl shadow-xl relative overflow-hidden border border-emerald-400/20 text-white flex flex-col justify-between h-56 transform transition hover:scale-[1.01]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                High-Yield Savings (4.25% APY)
              </span>
              <p className="text-xs text-emerald-300 mt-3 font-mono">
                {savings.accountNumber}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-emerald-300/60" />
          </div>

          <div>
            <p className="text-xs text-emerald-200">Total Savings Balance</p>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">
              ${(savings.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
