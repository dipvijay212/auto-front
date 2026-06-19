import React from 'react';
import { Menu, Wifi, Instagram } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function TopNav({ pageTitle, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/60 transition-colors duration-300">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg lg:hidden text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-semibold text-slate-800 dark:text-white capitalize">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* System Connection Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
          <Wifi className="w-3.5 h-3.5 animate-pulse" />
          <span>Local Engine Active</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Personal Instagram Handle Indicator */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white font-bold shadow-sm">
            <Instagram className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              @personal_account
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              System Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
