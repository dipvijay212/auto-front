import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm text-center py-16">
      <SettingsIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">System Configuration</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2">
        Manage automation schedules, Cron cronjob timing parameters, Elevenlabs API keys, Gemini model prompts, and directories.
      </p>
    </div>
  );
}
