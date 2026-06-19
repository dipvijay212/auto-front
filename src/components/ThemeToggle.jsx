import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-violet-500"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <Sun className="absolute inset-0 w-5 h-5 transform transition-transform duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute inset-0 w-5 h-5 transform transition-transform duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-indigo-400" />
      </div>
    </button>
  );
}
