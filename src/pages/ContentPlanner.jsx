import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Target, 
  Briefcase, 
  AlertCircle, 
  ThumbsUp, 
  Layers, 
  Image as ImageIcon,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useCreateContentPlan, useLatestContentPlan } from '../services';
import { usePersistentState } from '../hooks/usePersistentState';

export default function ContentPlanner() {
  const { plannerState, setPlannerState } = usePersistentState();
  const { topic, useDemo, planData } = plannerState;

  const setTopic = (val) => setPlannerState(prev => ({ ...prev, topic: val }));
  const setUseDemo = (val) => setPlannerState(prev => ({ ...prev, useDemo: val }));
  const setPlanData = (val) => setPlannerState(prev => ({ ...prev, planData: val }));

  const planMutation = useCreateContentPlan({
    onSuccess: (data) => {
      setPlanData(data);
    }
  });

  const { data: latestPlan } = useLatestContentPlan({
    enabled: !useDemo
  });

  useEffect(() => {
    if (latestPlan && !useDemo) {
      setPlanData(latestPlan);
      if (latestPlan.topicId?.title) {
        setTopic(latestPlan.topicId.title);
      }
    }
  }, [latestPlan, useDemo]);

  // Hydrate mutation output from persistent context if available
  if (planData && !planMutation.data) {
    planMutation.data = planData;
    planMutation.isSuccess = true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setPlanData(null);
    planMutation.mutate({ topic: topic.trim(), useDemo });
  };

  const handleDemoClick = () => {
    setTopic("Why Every Business Needs a Website");
  };


  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-500 fill-violet-500/20" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Content Architect</span>
        </div>
        <h2 className="text-2xl font-bold mt-1">AI Content Planner</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Map any content topic to deep strategic insights. The planner analyzes pain points, benefits, and selects the ideal format.
        </p>
      </div>

      {/* Input Panel */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="topic-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                What topic do you want to plan?
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
              id="topic-input"
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
              disabled={!topic.trim() || planMutation.isPending}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-950 dark:bg-violet-600 hover:bg-slate-850 dark:hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {planMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Planning Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generation Results View */}
      {planMutation.isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {planMutation.isError && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 space-y-4">
          <div className="flex items-start gap-3 text-rose-800 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">
                {planMutation.error.status === 429 ? "Gemini API Quota Exceeded" : "Failed to connect to backend engine"}
              </h4>
              <p className="text-xs mt-1 text-rose-700/80 dark:text-rose-400/80">
                {planMutation.error.message}
              </p>
              {planMutation.error.status === 429 && (
                <p className="text-xs font-semibold mt-2 text-rose-600 dark:text-rose-300">
                  Tip: To bypass the daily limit and continue testing, check the "Simulate (Use mock engine fallback)" box below.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setUseDemo(true);
              planMutation.mutate({ topic: topic.trim(), useDemo: true });
            }}
            className="text-xs bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 text-rose-800 dark:text-rose-300 font-semibold px-4 py-2 rounded-xl border border-rose-200/50 dark:border-rose-800/40 transition-colors"
          >
            Switch to Mock Simulator and retry
          </button>
        </div>
      )}

      {planMutation.isSuccess && planMutation.data && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Content Strategy Blueprint</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/30">
              Analysis Complete
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Industry */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Target Industry</h4>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                {planMutation.data.industry}
              </p>
            </div>

            {/* 2. Audience */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
                  <Target className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Target Audience</h4>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                {planMutation.data.audience}
              </p>
            </div>

            {/* 3. Goal */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Target className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Marketing Goal</h4>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                {planMutation.data.goal}
              </p>
            </div>

            {/* 4. Pain Points */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pain Points Addressed</h4>
              </div>
              <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                {Array.isArray(planMutation.data.painPoints) ? (
                  planMutation.data.painPoints.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-2">{planMutation.data.painPoints}</li>
                )}
              </ul>
            </div>

            {/* 5. Benefits */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
                  <ThumbsUp className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Core Benefits Delivered</h4>
              </div>
              <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                {Array.isArray(planMutation.data.benefits) ? (
                  planMutation.data.benefits.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-2">{planMutation.data.benefits}</li>
                )}
              </ul>
            </div>

            {/* 6. Content Type */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Suggested IG Format</h4>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed mb-3">
                {planMutation.data.contentType}
              </p>
              <span className="inline-flex text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">
                High engagement
              </span>
            </div>

          </div>

          {/* Visual Concept slide layout if available */}
          {Array.isArray(planMutation.data.visualConcepts) && planMutation.data.visualConcepts.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-fuchsia-500" />
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Visual Script Concept Carousel</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {planMutation.data.visualConcepts.map((concept, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-fuchsia-500 uppercase">Slide {idx + 1}</span>
                    <p className="text-xs mt-2 text-slate-700 dark:text-slate-300 leading-relaxed">{concept}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
