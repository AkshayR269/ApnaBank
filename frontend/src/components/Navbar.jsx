import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Landmark, LogOut, ShieldCheck, User } from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="glass-panel sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between shadow-xl mb-8">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3 cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Landmark className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
            ApexBank
          </span>
          <span className="block text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
            Enterprise Banking V1
          </span>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-white leading-none">{user?.fullName}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 inline mr-1" />
                  Verified Customer
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition duration-200 font-medium text-sm"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition duration-200"
          >
            <User className="w-4 h-4" />
            <span>Sign In / Demo</span>
          </button>
        )}
      </div>
    </nav>
  );
};
