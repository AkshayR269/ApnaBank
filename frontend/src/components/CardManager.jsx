import React, { useState } from 'react';
import { bankApi } from '../api/bankApi';
import { CreditCard, Eye, EyeOff, Lock, Unlock, ShieldAlert } from 'lucide-react';

export const CardManager = ({ card, onCardUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!card) return null;

  const handleToggleFreeze = async () => {
    setLoading(true);
    try {
      const updated = await bankApi.toggleCardFreeze(card.id);
      onCardUpdate(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (num) => {
    if (!num) return '•••• •••• •••• ••••';
    if (!showDetails) {
      return `•••• •••• •••• ${num.slice(-4)}`;
    }
    return num.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <CreditCard className="w-4 h-4 text-blue-700 mr-2" />
            Debit Card Controls
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage virtual card security and lock status</p>
        </div>

        {/* Freeze/Unfreeze Button */}
        <button
          onClick={handleToggleFreeze}
          disabled={loading}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
            card.isFrozen
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}
        >
          {card.isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          <span>{loading ? 'Updating...' : card.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Debit Card Visual */}
        <div className={`lg:col-span-2 p-6 rounded-xl shadow-xs relative overflow-hidden text-white flex flex-col justify-between h-48 transition-all ${
          card.isFrozen
            ? 'bg-slate-800 opacity-75 border border-rose-400'
            : 'bg-slate-900 border border-slate-800'
        }`}>
          {card.isFrozen && (
            <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center space-y-1">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
              <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">CARD FROZEN</p>
              <p className="text-[10px] text-slate-300">Transactions Temporarily Blocked</p>
            </div>
          )}

          <div className="flex justify-between items-center relative z-10">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300">ApexBank Visa</span>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title={showDetails ? 'Mask Details' : 'Show Details'}
            >
              {showDetails ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="relative z-10 my-auto">
            <p className="text-lg sm:text-xl font-mono tracking-widest font-bold text-white">
              {formatCardNumber(card.cardNumber)}
            </p>
          </div>

          <div className="flex justify-between items-end relative z-10 text-xs">
            <div>
              <p className="text-[9px] uppercase text-slate-400 font-semibold">Cardholder</p>
              <p className="font-bold tracking-wide mt-0.5 text-slate-100">{card.cardHolderName || 'ALEX MORGAN'}</p>
            </div>
            <div className="flex space-x-4">
              <div>
                <p className="text-[9px] uppercase text-slate-400 font-semibold">Expires</p>
                <p className="font-mono font-bold mt-0.5 text-slate-100">{card.expiryDate || '12/28'}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-slate-400 font-semibold">CVV</p>
                <p className="font-mono font-bold mt-0.5 text-slate-100">{showDetails ? card.cvv : '•••'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Info Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className={`font-semibold ${card.isFrozen ? 'text-rose-600' : 'text-emerald-700'}`}>
              {card.isFrozen ? 'FROZEN' : 'ACTIVE'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Linked Account:</span>
            <span className="font-mono text-slate-800">Checking (ACC-98421054)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Daily ATM Limit:</span>
            <span className="font-medium text-slate-800">$1,000.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Contactless Payment:</span>
            <span className="text-emerald-700 font-medium">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
