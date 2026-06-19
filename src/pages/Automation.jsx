import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  Settings, 
  Clock, 
  Terminal, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';
import { useAutomationConfig, useUpdateAutomationConfig } from '../services';

export default function Automation() {
  const queryClient = useQueryClient();
  const [useDemo, setUseDemo] = useState(false);

  // Query to fetch current automation config & logs
  const { data, isLoading, isError, error } = useAutomationConfig(useDemo);

  // Mutation to update configuration
  const updateMutation = useUpdateAutomationConfig({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation', useDemo] });
    }
  });

  const handleToggle = () => {
    if (!data) return;
    updateMutation.mutate({
      enabled: !data.enabled,
      schedule: data.schedule,
      useDemo
    });
  };

  const handleScheduleChange = (timeSlot) => {
    if (!data) return;
    const isChecked = data.schedule.includes(timeSlot);
    const updatedSchedule = isChecked
      ? data.schedule.filter(s => s !== timeSlot)
      : [...data.schedule, timeSlot];
    
    updateMutation.mutate({
      enabled: data.enabled,
      schedule: updatedSchedule,
      useDemo
    });
  };

  // Refetch when simulation mode toggles
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['automation', useDemo] });
  }, [useDemo]);


  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-violet-500" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pipeline Orchestrator</span>
        </div>
        <h2 className="text-2xl font-bold mt-1">Automation Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure daily cron schedules for automatic Instagram content generation and publishing.
        </p>
      </div>

      {isLoading && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-900 rounded w-1/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-900 rounded w-3/4" />
        </div>
      )}

      {isError && !useDemo && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 space-y-4">
          <div className="flex items-start gap-3 text-rose-800 dark:text-rose-400 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Failed to query automation configurations</h4>
              <p className="mt-1 text-rose-700/80 dark:text-rose-400/80">
                {error.message}. Ensure the backend is active on port 5000 and exposes GET /api/automation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setUseDemo(true)}
            className="text-xs bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 text-rose-850 dark:text-rose-300 font-semibold px-4 py-2 rounded-xl border border-rose-200/50 dark:border-rose-800/40 transition-colors"
          >
            Switch to Mock Simulator
          </button>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Settings Section (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Toggle Configuration */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col gap-6">
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white font-sans">Enable Automation</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-sans">Toggle background cron scheduler</p>
                </div>
                
                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={updateMutation.isPending}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none
                    ${data.enabled ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}
                  `}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                      ${data.enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>

              {/* Connected Schedule Options */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-sans">Cron Schedule Times</span>
                
                <div className="space-y-2">
                  {["9 AM", "2 PM", "7 PM"].map((slot) => {
                    const isChecked = data.schedule.includes(slot);
                    return (
                      <label 
                        key={slot}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all font-sans
                          ${isChecked 
                            ? 'border-violet-100 dark:border-violet-900/30 bg-violet-50/30 dark:bg-violet-950/10 text-slate-800 dark:text-slate-200' 
                            : 'border-slate-100 dark:border-slate-800/60 bg-transparent text-slate-400 dark:text-slate-500'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className={`w-4 h-4 ${isChecked ? 'text-violet-500' : ''}`} />
                          <span>Daily run at {slot}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleScheduleChange(slot)}
                          disabled={updateMutation.isPending}
                          className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Simulation switch inside card */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
                <input
                  id="demo-toggle"
                  type="checkbox"
                  checked={useDemo}
                  onChange={(e) => setUseDemo(e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-355 dark:border-slate-700"
                />
                <label htmlFor="demo-toggle" className="text-xs text-slate-500 dark:text-slate-400 select-none font-sans">
                  Simulate local console state
                </label>
              </div>

            </div>

            {/* Quick Diagnostic status */}
            <div className="p-5 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/40 flex justify-between items-center text-xs font-sans">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Scheduler Engine Load</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Idle (0.01s)</span>
            </div>

          </div>

          {/* Logs Terminal Column (7 Cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-slate-900 shadow-lg flex flex-col justify-between space-y-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4.5 h-4.5 text-violet-400" />
                <h3 className="text-sm font-bold text-slate-100 font-mono">automation.job.log</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">UTF-8 Output</span>
            </div>

            {/* Terminal Outputs */}
            <div className="flex-1 max-h-[360px] overflow-y-auto space-y-3 font-mono text-[11px] leading-relaxed text-slate-350 pr-1 select-text">
              {data.logs.map((log) => (
                <div key={log.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                    <span className={`font-bold shrink-0
                      ${log.level === 'SUCCESS' ? 'text-emerald-450' : ''}
                      ${log.level === 'INFO' ? 'text-violet-400' : ''}
                      ${log.level === 'WARN' ? 'text-amber-400' : ''}
                    `}>
                      {log.level}
                    </span>
                  </div>
                  <p className="text-slate-400 pl-4 border-l border-slate-800">
                    {log.message}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>Ready for pipeline events...</span>
              <button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['automation', useDemo] })}
                className="hover:text-slate-300 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Logs
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
