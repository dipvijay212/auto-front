import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  RefreshCw, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { useGenerateImages, useLatestScenes } from '../services';
import { usePersistentState } from '../hooks/usePersistentState';

export default function ImageGenerator() {
  const { imagesState, setImagesState, scenesState } = usePersistentState();
  const { useDemo, imagesData } = imagesState;

  const setUseDemo = (val) => setImagesState(prev => ({ ...prev, useDemo: val }));
  const setImagesData = (val) => setImagesState(prev => ({ ...prev, imagesData: val }));

  // Retrieve scenes from global state
  const { scenesData: globalScenesData } = scenesState;

  // Fallback to fetch latest scenes from API if global state is not set
  const { data: latestScenes, isLoading: isScenesLoading } = useLatestScenes(useDemo, {
    enabled: !useDemo && !globalScenesData
  });

  const activeScenesData = globalScenesData || latestScenes;
  const slides = activeScenesData?.slides || [];
  const contentPlanId = activeScenesData?.contentPlanId || null;
  const hasStoryboard = slides.length > 0;

  const imageMutation = useGenerateImages({
    onSuccess: (data) => {
      setImagesData(data);
    }
  });

  // Hydrate mutation output from persistent context if available
  if (imagesData && !imageMutation.data) {
    imageMutation.data = imagesData;
    imageMutation.isSuccess = true;
  }

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!hasStoryboard) return;

    setImagesData(null);
    const promptsArray = slides.map(s => s.imagePrompt || s.visualIdea);
    imageMutation.mutate({ 
      contentPlanId, 
      prompts: promptsArray, 
      useDemo 
    });
  };

  // Handle Download client-side
  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'generated_image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  if (isScenesLoading && !globalScenesData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading storyboard scenes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Vision Engine</span>
        </div>
        <h2 className="text-2xl font-bold mt-1">Image Generation Console</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Synthesize premium visual frames from descriptive text prompts. Generate between 3 and 5 vertical images (4:5 ratio) for compilation.
        </p>
      </div>

      {/* Input panel */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/60">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Prompt Setup (Storyboard Visuals)</h3>
            {hasStoryboard && (
              <span className="inline-flex text-[9px] uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2.5 py-1 rounded-full font-bold">
                Source: Scene Storyboard
              </span>
            )}
          </div>

          {!hasStoryboard ? (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 flex items-center gap-3 text-rose-800 dark:text-rose-450">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div className="text-xs font-semibold text-rose-900 dark:text-rose-400">
                Please generate storyboard scenes first.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {slides.map((slide, idx) => {
                const promptText = slide.imagePrompt || slide.visualIdea || '';
                return (
                  <div key={idx} className="flex gap-3 items-start p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 shrink-0 w-6 pt-1">#{idx + 1}</span>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-850 dark:text-slate-200">{slide.title || slide.headline || `Slide ${idx + 1}`}</span>
                        <span className="text-[9px] uppercase tracking-wider text-violet-500 dark:text-violet-400 font-extrabold">Source: Scene Storyboard</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{slide.description || slide.message}</p>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800/50">
                        <span className="text-[8px] uppercase tracking-widest font-extrabold text-indigo-500 dark:text-indigo-400">Image Prompt</span>
                        <p className="text-[10px] text-slate-700 dark:text-slate-350 italic font-mono leading-normal mt-0.5 whitespace-pre-wrap">{promptText}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
                Simulate (Generate real-time AI images in browser)
              </label>
            </div>

            <button
              type="submit"
              disabled={imageMutation.isPending || !hasStoryboard}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-950 dark:bg-violet-600 hover:bg-slate-850 dark:hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {imageMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing visual assets...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Images</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Skeleton state */}
      {imageMutation.isPending && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(slides.length || 5)].map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm p-4 animate-pulse flex flex-col justify-between">
              <div className="w-full h-full bg-slate-200 dark:bg-slate-900 rounded-xl mb-4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-900 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error display */}
      {imageMutation.isError && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 space-y-4">
          <div className="flex items-start gap-3 text-rose-800 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Failed to connect to backend engine</h4>
              <p className="text-xs mt-1 text-rose-700/80 dark:text-rose-400/80">
                {imageMutation.error.message}. Ensure the backend service is running and POST /api/images/generate is active.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setUseDemo(true);
              const promptsArray = slides.map(s => s.imagePrompt || s.visualIdea);
              imageMutation.mutate({ contentPlanId, prompts: promptsArray, useDemo: true });
            }}
            className="text-xs bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 text-rose-800 dark:text-rose-300 font-semibold px-4 py-2 rounded-xl border border-rose-200/50 dark:border-rose-800/40 transition-colors"
          >
            Switch to Mock Simulator and retry
          </button>
        </div>
      )}

      {/* Success Image Grid */}
      {imageMutation.isSuccess && imageMutation.data && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Generated Visual Frames</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-955/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/30">
              Compilation Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {imageMutation.data.map((item, idx) => {
              const imageSrc = item.cloudinaryUrl || (item.localPath.startsWith('http') ? item.localPath : `http://localhost:5000/${item.localPath}`);
              return (
                <div 
                  key={idx}
                  className="relative rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  {/* Aspect ratio bounding box */}
                  <div className="relative aspect-[4/5] bg-slate-950 overflow-hidden flex items-center justify-center">
                    <img 
                      src={imageSrc} 
                      alt={`Generated visual frame for prompt ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />

                    {/* Overlay actions (reveal on hover) */}
                    <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleDownload(imageSrc, `generated_frame_${idx + 1}.jpg`)}
                        className="p-3 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-semibold shadow-md active:scale-95 transition-all"
                        title="Download image"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata display */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500">Frame {idx + 1}</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans" title={item.prompt}>
                        {item.prompt}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                      <span>1024 x 1280 (JPG)</span>
                      {item.cloudinaryUrl && !item.cloudinaryUrl.includes('pollinations') && (
                        <span className="text-emerald-500 font-medium">Cloudinary Cached</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
