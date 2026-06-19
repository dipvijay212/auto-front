import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Settings, 
  FolderHeart, 
  Terminal, 
  X, 
  Instagram,
  Sparkles,
  Film,
  Image as ImageIcon,
  MessageSquare,
  Video,
  Cpu
} from 'lucide-react';
import TopNav from '../components/TopNav';

export default function SidebarLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Map route pathname to Page Title
  const getPageTitle = () => {
    const path = location.pathname.substring(1) || 'dashboard';
    if (path.includes('planner')) return 'content planner';
    if (path.includes('scenes')) return 'scenes storyboard';
    if (path.includes('images')) return 'image generation';
    if (path.includes('captions')) return 'caption builder';
    if (path.includes('reels')) return 'reel compilation';
    if (path.includes('publish')) return 'instagram publishing';
    if (path.includes('automation')) return 'cron scheduler';
    if (path.includes('queue')) return 'automation queue';
    if (path.includes('logs')) return 'pipeline logs';
    if (path.includes('media')) return 'media gallery';
    if (path.includes('settings')) return 'system configuration';
    return path;
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Content Planner', path: '/planner', icon: Sparkles },
    { name: 'Scene Storyboard', path: '/scenes', icon: Film },
    { name: 'Image Generator', path: '/images', icon: ImageIcon },
    { name: 'Caption Generator', path: '/captions', icon: MessageSquare },
    { name: 'Reel Generator', path: '/reels', icon: Video },
    { name: 'Instagram Publisher', path: '/publish', icon: Instagram },
    { name: 'Cron Scheduler', path: '/automation', icon: Cpu },
    { name: 'Content Queue', path: '/queue', icon: Layers },
    { name: 'Media Library', path: '/media', icon: FolderHeart },
    { name: 'Pipeline Logs', path: '/logs', icon: Terminal },
    { name: 'Automation Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800/60
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 text-white shadow-md">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white leading-tight flex items-center gap-1">
                InstaAuto <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              </h2>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Personal Console</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md lg:hidden text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 shadow-sm border-l-4 border-violet-500 dark:border-violet-400' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-slate-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">System Load</span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-gradient-to-r from-violet-500 to-pink-500 h-1.5 rounded-full w-[15%]" />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              <span>CPU: 12%</span>
              <span>1 Topic Pending</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav pageTitle={getPageTitle()} onMenuClick={() => setIsOpen(true)} />
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
          <div className="max-w-6xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
