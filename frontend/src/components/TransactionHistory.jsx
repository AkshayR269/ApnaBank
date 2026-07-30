import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownLeft, FileText, Filter } from 'lucide-react';

export const TransactionHistory = ({ transactions = [] }) => {
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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <FileText className="w-4 h-4 text-blue-700 mr-2" />
            Transaction History
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time record of account debits and credits</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-600 w-48"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Transactions</option>
              <option value="TRANSFER">Transfers</option>
              <option value="DEPOSIT">Deposits</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-y border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3">Reference ID</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTxns.length > 0 ? (
              filteredTxns.map((txn) => {
                const isDeposit = txn.transactionType === 'DEPOSIT';
                return (
                  <tr
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="hover:bg-slate-50 transition cursor-pointer"
                  >
                    <td className="py-3 px-3 flex items-center space-x-2.5">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                        isDeposit ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isDeposit ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{txn.description}</p>
                        <p className="text-[10px] text-slate-400">{txn.category || 'General'}</p>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{txn.referenceNumber}</td>

                    <td className="py-3 px-3 text-slate-500">
                      {new Date(txn.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className={`py-3 px-3 text-right font-bold text-xs ${
                      isDeposit ? 'text-emerald-700' : 'text-slate-900'
                    }`}>
                      {isDeposit ? '+' : '-'}${parseFloat(txn.amount || 0).toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">
                  No transactions match your search filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl border border-slate-200 shadow-lg space-y-4 text-slate-900">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h4 className="font-bold text-sm">Transaction Receipt</h4>
              <button onClick={() => setSelectedTxn(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">✕</button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Reference ID:</span>
                <span className="font-mono font-semibold">{selectedTxn.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Description:</span>
                <span className="font-medium">{selectedTxn.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-bold text-sm">${parseFloat(selectedTxn.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Source Account:</span>
                <span className="font-mono text-[11px]">{selectedTxn.sourceAccountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Account:</span>
                <span className="font-mono text-[11px]">{selectedTxn.targetAccountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span>{new Date(selectedTxn.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxn(null)}
              className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
