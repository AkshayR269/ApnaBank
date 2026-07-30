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
    <div className="glass-panel p-7 rounded-3xl border border-slate-700/50 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center">
            <CreditCard className="w-5 h-5 text-indigo-400 mr-2" />
            Virtual Debit Card Controls
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage security & instant card lock</p>
        </div>

        {/* Freeze/Unfreeze Button */}
        <button
          onClick={handleToggleFreeze}
          disabled={loading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
            card.isFrozen
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
          }`}
        >
          {card.isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          <span>{loading ? 'Updating...' : card.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Physical Virtual Card Visualizer */}
        <div className={`lg:col-span-2 p-6 rounded-2xl shadow-2xl relative overflow-hidden text-white flex flex-col justify-between h-52 transition-all duration-300 ${
          card.isFrozen
            ? 'bg-slate-900 border-2 border-rose-500/40 opacity-80'
            : 'bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-slate-700'
        }`}>
          {/* Card Overlay Lock Notice if Frozen */}
          {card.isFrozen && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-rose-400 animate-bounce" />
              <p className="text-sm font-bold text-rose-400">CARD FROZEN & LOCKED</p>
              <p className="text-xs text-slate-400">Transactions temporarily disabled</p>
            </div>
          )}

          {/* Top Row: Chip & Contactless */}
          <div className="flex justify-between items-center relative z-10">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-300">ApexBank Visa</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition"
                title={showDetails ? 'Mask Details' : 'Show Details'}
              >
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card Number */}
          <div className="relative z-10 my-auto">
            <p className="text-xl sm:text-2xl font-mono tracking-wider font-bold text-slate-100">
              {formatCardNumber(card.cardNumber)}
            </p>
          </div>

          {/* Bottom Row: Name & Expiry */}
          <div className="flex justify-between items-end relative z-10 text-xs">
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold">Cardholder</p>
              <p className="font-bold tracking-wide mt-0.5">{card.cardHolderName || 'ALEX MORGAN'}</p>
            </div>
            <div className="flex space-x-4">
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Expires</p>
                <p className="font-mono font-bold mt-0.5">{card.expiryDate || '12/28'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-semibold">CVV</p>
                <p className="font-mono font-bold mt-0.5">{showDetails ? card.cvv : '•••'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Info Box */}
        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Card Status:</span>
            <span className={`font-bold ${card.isFrozen ? 'text-rose-400' : 'text-emerald-400'}`}>
              {card.isFrozen ? 'FROZEN' : 'ACTIVE'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Linked Account:</span>
            <span className="font-mono text-slate-200">Checking (ACC-98421054)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Daily ATM Limit:</span>
            <span className="font-bold text-slate-200">$1,000.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">International Usage:</span>
            <span className="text-emerald-400 font-semibold">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
