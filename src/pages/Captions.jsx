import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Quote,
  Megaphone,
  Hash
} from 'lucide-react';
import { useGenerateCaption, useLatestCaption, useLatestContentPlan } from '../services';
import { usePersistentState } from '../hooks/usePersistentState';

export default function Captions() {
  const { captionsState, setCaptionsState } = usePersistentState();
  const { topic, audience, benefits, useDemo, captionData } = captionsState;

  const setTopic = (val) => setCaptionsState(prev => ({ ...prev, topic: val }));
  const setAudience = (val) => setCaptionsState(prev => ({ ...prev, audience: val }));
  const setBenefits = (val) => setCaptionsState(prev => ({ ...prev, benefits: val }));
  const setUseDemo = (val) => setCaptionsState(prev => ({ ...prev, useDemo: val }));
  const setCaptionData = (val) => setCaptionsState(prev => ({ ...prev, captionData: val }));

  const { data: latestPlan } = useLatestContentPlan({
    enabled: !useDemo
  });

  const { data: latestCaption } = useLatestCaption({
    enabled: !useDemo
  });

  useEffect(() => {
    if (latestCaption && !useDemo) {
      setCaptionData(latestCaption);
    }
  }, [latestCaption, useDemo]);

  useEffect(() => {
    if (latestPlan && !useDemo) {
      if (latestPlan.topicId?.title) {
        setTopic(latestPlan.topicId.title);
      }
      setAudience(latestPlan.audience || '');
      setBenefits(Array.isArray(latestPlan.benefits) ? latestPlan.benefits.join(', ') : (latestPlan.benefits || ''));
    }
  }, [latestPlan, useDemo]);

  // Success copy states
  const [copyState, setCopyState] = useState({ caption: false, hashtags: false });

  const captionMutation = useGenerateCaption({
    onSuccess: (data) => {
      setCaptionData(data);
    }
  });

  // Hydrate mutation output from persistent context if available
  if (captionData && !captionMutation.data) {
    captionMutation.data = captionData;
    captionMutation.isSuccess = true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setCaptionData(null);
    
    captionMutation.mutate({
      topic: topic.trim(),
      audience: audience.trim(),
      benefits: benefits.trim(),
      useDemo
    });
  };

  const handleDemoClick = () => {
    setTopic("Why Every Business Needs a Website");
    setAudience("Local business owners, traditional entrepreneurs");
    setBenefits("Increased credibility, automated leads, 24/7 search visibility");
  };


  // Copy full caption text
  const handleCopyCaption = (data) => {
    const fullText = `${data.hook}\n\n${data.caption}\n\n${data.cta}`;
    navigator.clipboard.writeText(fullText);
    setCopyState(prev => ({ ...prev, caption: true }));
    setTimeout(() => {
      setCopyState(prev => ({ ...prev, caption: false }));
    }, 2000);
  };

  // Copy hashtags formatted with # symbols
  const handleCopyHashtags = (hashtagsList) => {
    const formatted = hashtagsList.map(tag => `#${tag}`).join(' ');
    navigator.clipboard.writeText(formatted);
    setCopyState(prev => ({ ...prev, hashtags: true }));
    setTimeout(() => {
      setCopyState(prev => ({ ...prev, hashtags: false }));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Copywriter</span>
        </div>
        <h2 className="text-2xl font-bold mt-1">Instagram Caption Generator</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Synthesize high-converting copy containing attention-grabbing hooks, spacing-optimized body content, calls to action, and matching hashtags.
        </p>
      </div>

      {/* Form Settings Panel */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Topic (Full Span) */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="topic-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Topic Prompt
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs transition-all outline-none"
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <label htmlFor="audience-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Target Audience
              </label>
              <input
                id="audience-input"
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Local store owners, developers"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs transition-all outline-none"
              />
            </div>

            {/* Key Benefits */}
            <div className="space-y-2">
              <label htmlFor="benefits-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Key Benefits (comma-separated)
              </label>
              <input
                id="benefits-input"
                type="text"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="e.g. credibility, 24/7 visibility"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs transition-all outline-none"
              />
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
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
              disabled={captionMutation.isPending || !topic.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-950 dark:bg-violet-600 hover:bg-slate-855 dark:hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {captionMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting caption copy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Caption</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {captionMutation.isPending && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-900 rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-900 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-900 rounded w-5/6" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-900 rounded w-1/5" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-900 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-900 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-900 rounded w-2/3" />
            </div>
          </div>
        </div>
      )}

      {/* Connection Error Alert */}
      {captionMutation.isError && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 space-y-4">
          <div className="flex items-start gap-3 text-rose-800 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">
                {captionMutation.error.status === 429 ? "Gemini API Quota Exceeded" : "Failed to connect to backend engine"}
              </h4>
              <p className="text-xs mt-1 text-rose-700/80 dark:text-rose-400/80">
                {captionMutation.error.message}
              </p>
              {captionMutation.error.status === 429 && (
                <p className="text-xs font-semibold mt-2 text-rose-600 dark:text-rose-300">
                  Tip: To bypass the daily limit and continue testing, check the "Simulate (Use mock engine fallback)" box below.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setUseDemo(true);
              captionMutation.mutate({
                topic: topic.trim(),
                audience: audience.trim(),
                benefits: benefits.trim(),
                useDemo: true
              });
            }}
            className="text-xs bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 text-rose-800 dark:text-rose-300 font-semibold px-4 py-2 rounded-xl border border-rose-200/50 dark:border-rose-800/40 transition-colors"
          >
            Switch to Mock Simulator and retry
          </button>
        </div>
      )}

      {/* Output Display */}
      {captionMutation.isSuccess && captionMutation.data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Caption Column (Takes 2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Scroll-stopping Hook */}
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-violet-500/10 to-fuchsia-500/10 dark:from-violet-950/20 dark:to-fuchsia-950/20 border border-violet-100 dark:border-violet-900/30 shadow-sm relative overflow-hidden">
              <Quote className="absolute right-4 bottom-2 w-16 h-16 opacity-[0.04] dark:opacity-[0.08] text-violet-500" />
              <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest block mb-2">Scroll-Stopping Hook</span>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed font-sans">
                "{captionMutation.data.hook}"
              </p>
            </div>

            {/* Main Caption Body */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Caption Body Copy</span>
                
                <button
                  onClick={() => handleCopyCaption(captionMutation.data)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-55 hover:bg-slate-100 dark:bg-slate-905 dark:hover:bg-slate-800 text-xs font-semibold border border-slate-200/50 dark:border-slate-800/60 transition-all active:scale-95"
                >
                  {copyState.caption ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {captionMutation.data.caption}
              </p>
            </div>

            {/* Call to Action */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-indigo-550">
                <Megaphone className="w-4.5 h-4.5" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Call to Action (CTA)</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed font-sans">
                {captionMutation.data.cta}
              </p>
            </div>

          </div>

          {/* Hashtags Column (Takes 1/3 width) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-pink-500 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                <Hash className="w-4.5 h-4.5" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hashtag Selection</span>
              </div>

              {/* Tags Grid */}
              <div className="flex flex-wrap gap-2">
                {captionMutation.data.hashtags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 text-[10px] font-semibold rounded bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-150/40 dark:border-slate-800/50 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950/20 dark:hover:text-violet-400 transition-colors font-sans"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Copy button */}
            <button
              onClick={() => handleCopyHashtags(captionMutation.data.hashtags)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-950 dark:bg-violet-600 hover:bg-slate-855 dark:hover:bg-violet-500 text-white font-semibold text-xs active:scale-[0.98] transition-all"
            >
              {copyState.hashtags ? (
                <>
                  <Check className="w-4 h-4 text-emerald-350" />
                  <span>Hashtags Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy All Hashtags</span>
                </>
              )}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
