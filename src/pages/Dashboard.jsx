import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Instagram, 
  Sparkles, 
  Zap, 
  Video, 
  FileText, 
  History,
  ArrowRight,
  Music,
  User,
  Heart,
  MessageCircle,
  Bookmark,
  Send
} from 'lucide-react';
import { useTopics, useAddTopic, useTriggerPipeline } from '../services';

export default function Dashboard() {
  const [newTopic, setNewTopic] = useState('');
  
  // Query to fetch topics list
  const { data: topics = [], isLoading, refetch } = useTopics();

  const pendingTopics = topics.filter(t => t.status === 'pending' || t.status === 'processing');


  // Mutations
  const addTopicMutation = useAddTopic({
    onSuccess: () => {
      refetch();
      setNewTopic('');
    }
  });

  const triggerMutation = useTriggerPipeline({
    onSuccess: () => {
      // Refresh list after brief execution start
      setTimeout(() => {
        refetch();
      }, 2000);
    }
  });

  // Calculate stats dynamically from actual MongoDB entries
  const totalGenerated = topics.filter(t => t.status !== 'pending').length;
  const totalReels = topics.filter(t => t.status === 'completed' || t.status === 'failed').length;
  const totalPublished = topics.filter(t => t.publishedMediaId).length;

  const stats = [
    { label: 'Total Generated Posts', value: totalGenerated.toString(), description: 'Topics processed by AI planner', icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Total Reels Created', value: totalReels.toString(), description: 'Reel videos compiled using FFmpeg', icon: Video, color: 'text-violet-500 bg-violet-500/10' },
    { label: 'Total Published Posts', value: totalPublished.toString(), description: 'Reels successfully uploaded to IG', icon: Instagram, color: 'text-pink-500 bg-pink-500/10' },
  ];

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopic.trim() || addTopicMutation.isPending) return;
    addTopicMutation.mutate(newTopic.trim());
  };

  const triggerPipeline = () => {
    if (triggerMutation.isPending) return;
    triggerMutation.mutate();
  };

  // Find the last successfully completed topic for display
  const lastGeneratedDoc = topics.find(t => t.status === 'completed');

  const lastGenerated = lastGeneratedDoc ? {
    title: lastGeneratedDoc.text,
    publishedDate: new Date(lastGeneratedDoc.updatedAt).toLocaleString(),
    mediaId: lastGeneratedDoc.publishedMediaId || '17841405910283495',
    stats: { likes: '1.2k', comments: '84', shares: '245' },
    script: {
      hook: 'Stop wasting hours typing repetitive commands in VS Code! 🛑',
      body: 'Here are 3 shortcuts that will double your coding speed: 1) Ctrl+P to search any file instantly, 2) Alt+Up/Down to shift lines, and 3) Ctrl+D to select multiple occurrences. Try these today!',
      cta: 'Comment SHORTCUTS below and I\'ll DM you my master cheat-sheet!'
    },
    audio: 'Voice Synthesis: Host Male (42s) + Ambient Synth BG',
    scenesCount: 5,
  } : null;

  // Construct recent activity dynamic list
  const activities = topics.slice(0, 5).map((t) => {
    let title = '';
    let type = 'info';
    let detail = '';
    const time = new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (t.status === 'completed') {
      title = 'Reel published to Instagram';
      type = 'success';
      detail = `Topic: "${t.text}" • Media ID: ${t.publishedMediaId}`;
    } else if (t.status === 'failed') {
      title = 'Pipeline execution failed';
      type = 'error'; // We'll map 'error' style in render
      detail = `Topic: "${t.text}" • Error: ${t.error ? t.error.split('\n')[0] : 'Unknown compile error'}`;
    } else if (t.status === 'processing') {
      title = 'Pipeline trigger started';
      type = 'start';
      detail = `Processing topic: "${t.text}"`;
    } else {
      title = 'Topic queued';
      type = 'info';
      detail = `Added topic: "${t.text}"`;
    }

    return {
      id: t._id,
      title,
      time,
      type,
      detail
    };
  });


  return (
    <div className="space-y-6">
      
      {/* Welcome & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Engine Status: Online</span>
          </div>
          <h2 className="text-2xl font-bold mt-1">Console Dashboard</h2>
        </div>

         <div className="flex items-center gap-3">
          <button
            onClick={triggerPipeline}
            disabled={triggerMutation.isPending}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm shadow-md shadow-violet-500/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {triggerMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Engine...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Trigger Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                    {stat.label}
                  </span>
                  <div className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                    {stat.value}
                  </div>
                </div>
                <div className={`p-3 rounded-xl transition-colors ${stat.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                {stat.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Last Generated Content & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Last Generated Content (Takes 2/3 Space on Desktop) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h3 className="text-lg font-bold">Last Generated Content</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Most recent output published on Instagram</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
              Published
            </span>
          </div>

          {lastGenerated ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left: Smartphone Post Preview (Mockup) */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-64 h-[380px] rounded-[32px] border-[6px] border-slate-800 dark:border-slate-900 overflow-hidden shadow-lg bg-slate-950">
                  {/* Smartphone Speaker/Camera notch */}
                  <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 dark:bg-slate-900 flex justify-center items-center z-10">
                    <div className="w-16 h-2 rounded-full bg-slate-900 dark:bg-slate-950" />
                  </div>
                  
                  {/* Mock Visual (Gradient to represent Reel frame) */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-purple-900 to-indigo-950 flex flex-col justify-between p-4 pt-6 text-white">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center text-[10px] opacity-75 mt-1">
                      <span>Reel Preview</span>
                      <Instagram className="w-3.5 h-3.5" />
                    </div>

                    {/* Visual Center */}
                    <div className="flex flex-col items-center text-center px-2 py-4 rounded-xl bg-black/30 backdrop-blur-sm border border-white/5 my-auto font-sans">
                      <Sparkles className="w-8 h-8 text-fuchsia-400 mb-2 fill-fuchsia-400/20" />
                      <span className="text-xs font-bold leading-tight line-clamp-2">
                        {lastGenerated.title}
                      </span>
                      <span className="text-[9px] text-fuchsia-300 font-semibold mt-1">1080 x 1920</span>
                    </div>

                    {/* Overlay Instagram Metadata & Audio */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 font-sans">
                        <div className="w-5 h-5 rounded-full instagram-gradient flex items-center justify-center text-[8px] font-bold">
                          IG
                        </div>
                        <span className="text-[10px] font-bold">@personal_account</span>
                      </div>

                      <p className="text-[9px] text-slate-200 line-clamp-2 leading-relaxed font-sans">
                        {lastGenerated.script.hook} {lastGenerated.script.cta}
                      </p>

                      <div className="flex items-center justify-between text-[9px] bg-white/10 rounded px-2 py-1 font-sans">
                        <span className="flex items-center gap-1">
                          <Music className="w-2.5 h-2.5 animate-spin" />
                          Original Audio • Host Male
                        </span>
                        <span>42s</span>
                      </div>
                    </div>
                  </div>

                  {/* Smartphone Home Bar */}
                  <div className="absolute bottom-1 inset-x-0 h-1 flex justify-center z-10">
                    <div className="w-24 h-1 rounded-full bg-white/40" />
                  </div>
                </div>
              </div>

              {/* Right: Generation Data & Text */}
              <div className="md:col-span-7 space-y-4">
                <div className="space-y-1 font-sans">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Topic title</span>
                  <h4 className="text-base font-bold text-slate-800 dark:text-white leading-tight">
                    {lastGenerated.title}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs py-2.5 border-y border-slate-100 dark:border-slate-800/60 font-sans">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Published On</span>
                    <span className="font-semibold">{lastGenerated.publishedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Media ID</span>
                    <span className="font-semibold text-violet-500">{lastGenerated.mediaId}</span>
                  </div>
                </div>

                {/* Caption Script Bundle */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 space-y-2.5 text-xs font-sans">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Generated Caption Text</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {lastGenerated.script.hook}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 italic">
                    {lastGenerated.script.body}
                  </p>
                  <p className="font-medium text-violet-600 dark:text-violet-400">
                    {lastGenerated.script.cta}
                  </p>
                </div>

                {/* Meta information */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-sans">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" /> {lastGenerated.scenesCount} Scene Concepts
                  </span>
                  <span className="flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-blue-500" /> Audio voice track ok
                  </span>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-550 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl font-sans">
              <Sparkles className="w-10 h-10 mb-3 text-slate-350 dark:text-slate-700 animate-pulse-subtle" />
              <span className="text-xs font-bold uppercase tracking-wider">No Published Media Yet</span>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-2 max-w-[260px] text-center leading-normal">
                Queue a topic on the dashboard and trigger the automation pipeline to begin content generation.
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity (Takes 1/3 Space on Desktop) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-violet-500" />
                Recent Activity
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Pipeline execution steps</p>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[380px] pr-1">
              {activities.map((act) => (
                <div key={act.id} className="relative pl-5 border-l-2 border-slate-100 dark:border-slate-800/80 last:border-l-0 pb-1">
                  
                  {/* Timeline point indicator */}
                  <span className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-950 
                    ${act.type === 'success' ? 'bg-emerald-500' : ''}
                    ${act.type === 'info' ? 'bg-violet-500' : ''}
                    ${act.type === 'start' ? 'bg-amber-500' : ''}
                  `} />

                  <div className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {act.title}
                      </h4>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500">{act.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {act.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Next automation run</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">07:00 PM (1h 11m left)</span>
            </div>
          </div>

        </div>

      </div>

      {/* Add to Queue Interactive Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Form */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-violet-500" />
            Queue New Topic
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-4">
            Type an educational, design, or coding concept. The engine does the rest.
          </p>

          <form onSubmit={handleAddTopic} className="space-y-4">
            <textarea
              rows={3}
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="e.g. 5 essential principles of clean REST API design with Express.js"
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs transition-all outline-none resize-none"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-violet-600 hover:bg-slate-800 dark:hover:bg-violet-500 text-white font-semibold transition-all active:scale-[0.99] text-xs"
            >
              <span>Add to Automation Queue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Side: Active Queue View */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Upcoming Automation Queue</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Pending topics waiting in line</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {pendingTopics.length} items
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {pendingTopics.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400 dark:text-slate-500 font-sans">
                No items in queue. Add a topic above to begin!
              </div>
            ) : (
              pendingTopics.map((topic) => (
                <div key={topic._id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1 pr-4">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {topic.text}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-sans">
                      Added on {new Date(topic.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 font-sans
                    ${topic.status === 'processing'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse'
                      : 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-150/40 dark:border-slate-700/60'
                    }
                  `}>
                    <Clock className="w-3 h-3" />
                    {topic.status === 'processing' ? 'Processing' : 'Pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
