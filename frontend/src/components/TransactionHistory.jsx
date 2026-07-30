import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownLeft, FileText, Filter, Calendar } from 'lucide-react';

export const TransactionHistory = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedTxn, setSelectedTxn] = useState(null);

  const filteredTxns = transactions.filter(txn => {
    const matchesSearch =
      txn.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.sourceAccountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.targetAccountNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'ALL' || txn.transactionType === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="glass-panel p-7 rounded-3xl border border-slate-700/50 shadow-xl space-y-6">
      {/* Header & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center">
            <FileText className="w-5 h-5 text-indigo-400 mr-2" />
            Transaction Ledger & Activity
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time audit history of debits and credits</p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 w-52"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Types</option>
              <option value="TRANSFER" className="bg-slate-900 text-white">Transfers</option>
              <option value="DEPOSIT" className="bg-slate-900 text-white">Deposits</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/60 pb-3">
            <tr>
              <th className="py-3 px-4">Transaction</th>
              <th className="py-3 px-4">Ref Number</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredTxns.length > 0 ? (
              filteredTxns.map((txn) => {
                const isDeposit = txn.transactionType === 'DEPOSIT';
                return (
                  <tr
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="hover:bg-slate-800/40 transition cursor-pointer group"
                  >
                    {/* Description & Icon */}
                    <td className="py-4 px-4 flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isDeposit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {isDeposit ? <ArrowDownLeft className="w-4.5 h-4.5" /> : <ArrowUpRight className="w-4.5 h-4.5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-white group-hover:text-indigo-300 transition">{txn.description}</p>
                        <p className="text-xs text-slate-400">{txn.category || 'General'}</p>
                      </div>
                    </td>

                    {/* Reference Number */}
                    <td className="py-4 px-4 font-mono text-xs text-slate-400">{txn.referenceNumber}</td>

                    {/* Date */}
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {new Date(txn.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>

                    {/* Amount */}
                    <td className={`py-4 px-4 text-right font-bold text-base ${
                      isDeposit ? 'text-emerald-400' : 'text-slate-200'
                    }`}>
                      {isDeposit ? '+' : '-'}${parseFloat(txn.amount || 0).toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400 text-sm">
                  No transactions match your search filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700/60 text-white space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h4 className="font-bold text-lg">Transaction Receipt</h4>
              <button onClick={() => setSelectedTxn(null)} className="text-slate-400 hover:text-white text-sm font-bold">✕</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Reference ID:</span>
                <span className="font-mono text-indigo-400">{selectedTxn.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Description:</span>
                <span className="font-semibold">{selectedTxn.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-bold text-lg">${parseFloat(selectedTxn.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Source Account:</span>
                <span className="font-mono text-xs">{selectedTxn.sourceAccountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Account:</span>
                <span className="font-mono text-xs">{selectedTxn.targetAccountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span>{new Date(selectedTxn.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxn(null)}
              className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-slate-700 transition"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
