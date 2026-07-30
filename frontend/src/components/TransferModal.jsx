import React, { useState } from 'react';
import { bankApi } from '../api/bankApi';
import { X, Send, AlertCircle, CheckCircle2, ArrowRightLeft } from 'lucide-react';

export const TransferModal = ({ isOpen, onClose, accounts, onSuccess }) => {
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [targetAccountNumber, setTargetAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const currentSource = accounts.find(a => a.id === parseInt(sourceAccountId) || a.accountNumber === sourceAccountId) || accounts[0];

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const sourceId = sourceAccountId || accounts[0]?.id;
    if (!sourceId) {
      setError('Please select a valid source account.');
      return;
    }

    if (!targetAccountNumber.trim()) {
      setError('Recipient account number is required.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Transfer amount must be greater than zero.');
      return;
    }

    if (currentSource && currentSource.balance < numAmount) {
      setError(`Insufficient funds! Available balance: $${currentSource.balance.toFixed(2)}`);
      return;
    }

    setLoading(true);
    try {
      await bankApi.transferMoney(sourceId, targetAccountNumber, numAmount, description);
      setSuccessMsg(`Successfully transferred $${numAmount.toFixed(2)} to ${targetAccountNumber}`);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMsg('');
        setAmount('');
        setDescription('');
        setTargetAccountNumber('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Transfer failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-8 rounded-3xl shadow-2xl border border-slate-700/60 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Transfer Funds</h3>
            <p className="text-xs text-slate-400">Internal or Peer-to-Peer Transfer</p>
          </div>
        </div>

        {/* Alert Notifications */}
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

        <form onSubmit={handleTransfer} className="space-y-4">
          {/* Source Account Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">From Account</label>
            <select
              value={sourceAccountId || accounts[0]?.id}
              onChange={(e) => setSourceAccountId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountType} ({acc.accountNumber}) — Available: ${acc.balance?.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Internal Switch Helper */}
          {accounts.length > 1 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const other = accounts.find(a => a.id !== (parseInt(sourceAccountId) || accounts[0]?.id));
                  if (other) setTargetAccountNumber(other.accountNumber);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>Autofill Own Savings Account</span>
              </button>
            </div>
          )}

          {/* Target Account Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Recipient Account Number</label>
            <input
              type="text"
              required
              value={targetAccountNumber}
              onChange={(e) => setTargetAccountNumber(e.target.value)}
              placeholder="e.g. ACC-31094821"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Transfer Amount ($ USD)</label>
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

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Note / Reference (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Dinner share, Savings transfer"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Processing Transfer...' : 'Confirm & Send Money'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
