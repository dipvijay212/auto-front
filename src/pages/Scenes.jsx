import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Film, 
  Image as ImageIcon,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Play
} from 'lucide-react';
import { useCreateScenes, useLatestScenes, useCompilePrompts } from '../services';
import { usePersistentState } from '../hooks/usePersistentState';

export default function Scenes() {
  const navigate = useNavigate();
  const { scenesState, setScenesState } = usePersistentState();
  const { topic, useDemo, scenesData } = scenesState;

  const setTopic = (val) => setScenesState(prev => ({ ...prev, topic: val }));
  const setUseDemo = (val) => setScenesState(prev => ({ ...prev, useDemo: val }));
  const setScenesData = (val) => setScenesState(prev => ({ ...prev, scenesData: val }));

  const scenesMutation = useCreateScenes({
    onSuccess: (data) => {
      setScenesData(data);
    }
  });

  // Fetch latest storyboard slides on mount
  const { data: latestScenes, isLoading: isLatestLoading } = useLatestScenes(useDemo, {
    enabled: !useDemo
  });

  useEffect(() => {
    if (latestScenes && !useDemo) {
      const isDifferentData = !scenesData || scenesData.contentPlanId !== latestScenes.contentPlanId || scenesData.slides?.length !== latestScenes.slides?.length;
      if (isDifferentData) {
        setScenesData(latestScenes);
      }
      if (latestScenes.topicTitle && topic !== latestScenes.topicTitle) {
        setTopic(latestScenes.topicTitle);
      }
    }
  }, [latestScenes, useDemo, scenesData, topic]);

  const compilePromptsMutation = useCompilePrompts({
    onSuccess: () => {
      navigate('/images');
    }
  });

  const handleAutoCompile = () => {
    const activeData = scenesData || latestScenes;
    if (!activeData || !activeData.contentPlanId) return;
    compilePromptsMutation.mutate({ contentPlanId: activeData.contentPlanId });
  };

  // Hydrate mutation output from persistent context if available
  if (scenesData && !scenesMutation.data) {
    scenesMutation.data = scenesData;
    scenesMutation.isSuccess = true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setScenesData(null);
    scenesMutation.mutate({ topic: topic.trim(), useDemo });
  };

  const handleDemoClick = () => {
    setTopic("Why Every Business Needs a Website");
  };

  // Harmonious gradient colors for cards
  const gradients = [
    "from-violet-600/90 to-fuchsia-600/90 dark:from-violet-950/80 dark:to-fuchsia-950/80",
    "from-blue-600/90 to-indigo-600/90 dark:from-blue-950/80 dark:to-indigo-950/80",
    "from-pink-600/90 to-rose-600/90 dark:from-pink-950/80 dark:to-rose-950/80",
    "from-emerald-600/90 to-teal-600/90 dark:from-emerald-950/80 dark:to-teal-950/80",
    "from-amber-600/90 to-orange-600/90 dark:from-amber-950/80 dark:to-orange-950/80"
  ];

  const activeSlides = scenesMutation.data?.slides || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-pink-500" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Visual Storyboarder</span>
        </div>
        <h2 className="text-2xl font-bold mt-1">Scene Script Preview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate exactly 5 distinct visual scenes representing key highlights of your video storyboard. These serve as image prompts.
        </p>
      </div>

      {/* Input panel */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="scene-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Input your content topic or concept description
              </label>
              <button
                type="button"
                onClick={handleDemoClick}
                className="text-xs text-violet-600 hover:text-violet-500 dark:text-violet-400 font-medium"
              >
                Try Example Topic
              </button>
            </div>
            <input
              id="scene-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Why Every Business Needs a Website"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm transition-all outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <input
                id="demo-toggle"
                type="checkbox"
                checked={useDemo}
                onChange={(e) => setUseDemo(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300 dark:border-slate-700"
              />
              <label htmlFor="demo-toggle" className="text-xs text-slate-500 dark:text-slate-400 select-none">
                Simulate (Use mock engine fallback)
              </label>
            </div>

            <button
              type="submit"
              disabled={!topic.trim() || scenesMutation.isPending}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-950 dark:bg-violet-600 hover:bg-slate-850 dark:hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {scenesMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Storyboard...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Scenes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {(scenesMutation.isPending || (isLatestLoading && !useDemo && !scenesData)) && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm p-4 animate-pulse flex flex-col justify-between">
              <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
              </div>
              <div className="w-full h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Error Alert */}
      {scenesMutation.isError && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 space-y-4">
          <div className="flex items-start gap-3 text-rose-800 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">
                {scenesMutation.error.status === 429 ? "Gemini API Quota Exceeded" : "Failed to connect to backend engine"}
              </h4>
              <p className="text-xs mt-1 text-rose-700/80 dark:text-rose-400/80">
                {scenesMutation.error.message}
              </p>
              {scenesMutation.error.status === 429 && (
                <p className="text-xs font-semibold mt-2 text-rose-600 dark:text-rose-300">
                  Tip: To bypass the daily limit and continue testing, check the "Simulate (Use mock engine fallback)" box below.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setUseDemo(true);
              scenesMutation.mutate({ topic: topic.trim(), useDemo: true });
            }}
            className="text-xs bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 text-rose-850 dark:text-rose-300 font-semibold px-4 py-2 rounded-xl border border-rose-200/50 dark:border-rose-800/40 transition-colors"
          >
            Switch to Mock Simulator and retry
          </button>
        </div>
      )}

      {/* Storyboard Output */}
      {scenesMutation.isSuccess && activeSlides.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white">Active Storyboard Scenes</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-955/40 text-pink-700 dark:text-pink-400 border border-pink-200/50 dark:border-pink-800/30">
              {activeSlides.length} Scenes Compiled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {activeSlides.map((slide, idx) => (
              <div 
                key={idx}
                className="relative overflow-hidden h-full min-h-[22rem] rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Visual Accent Background representation */}
                <div className={`absolute top-0 inset-x-0 h-20 bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-between px-4 text-white`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-75">Slide</span>
                    <span className="text-xl font-black">{slide.slideNumber || idx + 1}</span>
                  </div>
                  <ImageIcon className="w-4 h-4 opacity-40 group-hover:scale-110 transition-transform" />
                </div>

                {/* Body Content */}
                <div className="pt-22 px-4 pb-4 flex flex-col justify-between flex-1 space-y-2">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{slide.title || slide.headline}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{slide.description || slide.message}</p>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-violet-500 dark:text-violet-400">Brief Prompter</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-350 leading-normal mt-0.5 italic">{slide.imagePrompt || slide.visualIdea}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                    <span>Frame #{idx + 1}</span>
                    <span className="text-violet-550 group-hover:underline cursor-pointer flex items-center gap-0.5">
                      Prompt info <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Prompt compilation helper footer */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between flex-wrap gap-4 text-xs font-medium">
            <span className="text-slate-500 dark:text-slate-400">
              These scenes will act as visual templates for generating image assets using Pollinations AI.
            </span>
            <button 
              onClick={handleAutoCompile}
              disabled={compilePromptsMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-violet-600 text-white font-semibold text-[11px] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {compilePromptsMutation.isPending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Compiling Prompts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Compile Visual Prompts</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
