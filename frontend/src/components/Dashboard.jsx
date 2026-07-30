import React from 'react';
import { Send, PlusCircle, CreditCard, ShieldCheck, Wallet, RefreshCw } from 'lucide-react';

export const Dashboard = ({ accounts = [], onOpenTransfer, onOpenDeposit, onRefresh }) => {
  // 1. Checking Account Lookup
  const checking = accounts.find(a => {
    const typeStr = (a?.accountType || a?.type || '').toString().toUpperCase();
    return typeStr === 'CHECKING';
  }) || accounts[0] || { balance: 0, accountNumber: 'N/A' };

  // 2. Savings Account Lookup
  const savings = accounts.find(a => {
    const typeStr = (a?.accountType || a?.type || '').toString().toUpperCase();
    return typeStr === 'SAVINGS' && a?.id !== checking?.id;
  }) || accounts.find(a => a?.id !== checking?.id) || accounts[1] || { balance: 0, accountNumber: 'N/A' };

  const totalNetWorth = accounts.reduce((acc, curr) => acc + (parseFloat(curr?.balance) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Net Worth Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
              <Wallet className="w-4 h-4 text-blue-700" />
              <span>Total Liquid Assets</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              ₹{totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              FDIC Insured Up To ₹250,000 • Verified Live Balance
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenTransfer}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transfer Funds</span>
            </button>

            <button
              onClick={onOpenDeposit}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs border border-slate-200 transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deposit Funds</span>
            </button>

            <button
              onClick={onRefresh}
              className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition border border-slate-200"
              title="Refresh Accounts"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checking Account Card */}
        <div className="card-navy p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between h-52">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-300 bg-white/10 px-2.5 py-1 rounded-md">
                Checking Account
              </span>
              <p className="text-xs text-slate-400 mt-2.5 font-mono">
                {checking.accountNumber}
              </p>
            </div>
            <CreditCard className="w-6 h-6 text-slate-400" />
          </div>

          <div>
            <p className="text-xs text-slate-400">Available Balance</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              ₹{(parseFloat(checking.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        {/* Savings Account Card */}
        <div className="card-slate p-6 rounded-2xl border border-blue-800 shadow-sm flex flex-col justify-between h-52">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-100 bg-white/15 px-2.5 py-1 rounded-md">
                Savings Account (4.25% APY)
              </span>
              <p className="text-xs text-blue-200 mt-2.5 font-mono">
                {savings.accountNumber}
              </p>
            </div>
            <Wallet className="w-6 h-6 text-blue-200" />
          </div>

          <div>
            <p className="text-xs text-blue-200">Total Savings Balance</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              ₹{(parseFloat(savings.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
