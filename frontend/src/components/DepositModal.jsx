import React, { useState } from 'react';
import { bankApi } from '../api/bankApi';
import { X, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

export const DepositModal = ({ isOpen, onClose, accounts, onSuccess }) => {
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const targetId = accountId || accounts[0]?.id;
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Deposit amount must be greater than zero.');
      return;
    }

    setLoading(true);
    try {
      await bankApi.depositMoney(targetId, numAmount, description);
      setSuccessMsg(`Successfully deposited $${numAmount.toFixed(2)}`);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMsg('');
        setAmount('');
        setDescription('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Deposit failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-8 rounded-3xl shadow-2xl border border-slate-700/60 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Deposit Funds</h3>
            <p className="text-xs text-slate-400">Simulate Check or Electronic Deposit</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Target Account</label>
            <select
              value={accountId || accounts[0]?.id}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountType} ({acc.accountNumber}) — Current: ${acc.balance?.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Deposit Amount ($ USD)</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Description / Source</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Payroll Salary, Dividend"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Processing Deposit...' : 'Confirm Deposit'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
