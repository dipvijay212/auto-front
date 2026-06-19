import React, { useState } from 'react';
import { 
  Terminal, 
  RefreshCw, 
  Search, 
  Filter, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { usePipelineLogs } from '../services';

export default function Logs() {
  const { data: logs = [], isLoading, isError, refetch } = usePipelineLogs();

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStep, setFilterStep] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Available unique steps/stages in logs for filtering
  const stepsList = [
    'All',
    'Content Planner',
    'Scene Storyboard',
    'Image Brief Generator',
    'Image Prompt Generator',
    'Image Generator',
    'Caption Generator',
    'Voice Script Generator',
    'Piper TTS',
    'Reel Generator',
    'Instagram Publisher'
  ];

  // Filtering Logic
  const filteredLogs = logs.filter(log => {
    const topicTitle = log.topicId?.title || log.topicId?.text || '';
    const messageMatch = log.message.toLowerCase().includes(searchQuery.toLowerCase());
    const titleMatch = topicTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const queryMatch = messageMatch || titleMatch;

    const stepMatch = filterStep === 'All' || log.step === filterStep;
    const statusMatch = filterStatus === 'All' || log.status === filterStatus;

    return queryMatch && stepMatch && statusMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'SUCCESS':
        return 'text-emerald-400';
      case 'failed':
      case 'ERROR':
        return 'text-rose-400';
      case 'started':
      case 'INFO':
        return 'text-violet-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-violet-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pipeline Auditor</span>
          </div>
          <button 
            onClick={() => refetch()}
            className="p-2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <h2 className="text-2xl font-bold mt-1">Pipeline Execution Logs</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor the lifecycle event milestones of your automated contents generation stages.
        </p>
      </div>

      {/* Toolbar / Filters */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search topic or log message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-650 text-xs text-white transition-all outline-none"
          />
        </div>

        {/* Right Side: Step and Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Step Dropdown */}
          <select
            value={filterStep}
            onChange={(e) => setFilterStep(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-350 focus:outline-none focus:ring-2 focus:ring-violet-550 transition-all cursor-pointer font-sans"
          >
            {stepsList.map(step => (
              <option key={step} value={step}>{step === 'All' ? 'All Steps' : step}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-350 focus:outline-none focus:ring-2 focus:ring-violet-550 transition-all cursor-pointer font-sans"
          >
            <option value="All">All Statuses</option>
            <option value="started">Started</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

      </div>

      {/* Terminal View */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-lg flex flex-col justify-between min-h-[460px] font-mono text-xs select-text">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800/60 mb-4 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-500 font-bold ml-2">pipeline_engine.log</span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold tracking-wider">UTF-8 Output Stream</span>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-20 select-none">
            <RefreshCw className="w-8 h-8 animate-spin mb-3 text-violet-550" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Streaming log file...</p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex-1 flex flex-col items-center justify-center text-rose-500 py-20 gap-3 select-none">
            <AlertCircle className="w-10 h-10 animate-bounce" />
            <div className="text-center">
              <h4 className="font-bold text-sm">Log Stream Terminated</h4>
              <p className="text-[10px] text-rose-400/80 mt-1">Failed to read pipelineLog collection on backend server.</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filteredLogs.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-20 select-none">
            <Terminal className="w-10 h-10 mb-3 opacity-30 animate-pulse-subtle" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider">Empty Log Stream</h4>
            <p className="text-[10px] text-slate-600 mt-2 max-w-xs text-center leading-relaxed">
              No pipeline events match your search query or filters. Ensure the automation queue is running.
            </p>
          </div>
        )}

        {/* Log Lines */}
        {!isLoading && !isError && filteredLogs.length > 0 && (
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-slate-800">
            {filteredLogs.map((log) => {
              const topicText = log.topicId?.title || log.topicId?.text || 'Global Process';
              return (
                <div key={log._id} className="space-y-1 group">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-500 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-slate-400 font-semibold uppercase select-none">[{log.step}]</span>
                    <span className={`font-extrabold uppercase shrink-0 select-none ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                    <span className="text-[10px] text-slate-600 italic group-hover:text-slate-500 transition-colors font-sans select-none">
                      (Topic: "{topicText.substring(0, 45)}{topicText.length > 45 ? '...' : ''}")
                    </span>
                  </div>
                  <p className="text-slate-350 pl-4 border-l border-slate-800/80 group-hover:text-slate-200 transition-colors">
                    {log.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Terminal Footer */}
        <div className="pt-4 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-500 mt-4 select-none">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Latest tick: {new Date().toLocaleTimeString()}
          </span>
          <span>Logged {filteredLogs.length} events</span>
        </div>

      </div>

    </div>
  );
}
