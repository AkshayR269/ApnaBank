import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Landmark, LogOut, ShieldCheck, User } from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 shadow-xs mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              ApexBank
            </span>
            <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Online Banking
            </span>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2.5 bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200">
                <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  {user?.fullName?.charAt(0) || 'A'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.fullName}</p>
                  <p className="text-[10px] text-emerald-600 font-medium flex items-center">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 inline mr-0.5" />
                    Verified Customer
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition font-medium text-xs border border-slate-200"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
