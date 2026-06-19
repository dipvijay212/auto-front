import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Video, 
  Mic, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  Download
} from 'lucide-react';
import { useGenerateVoice, useGenerateReel, useLatestCaption, useLatestReel } from '../services';
import { usePersistentState } from '../hooks/usePersistentState';

export default function Reels() {
  const { reelsState, setReelsState } = usePersistentState();
  const { hook, body, cta, useDemo, voiceStatus, voicePath, reelData } = reelsState;

  const setHook = (val) => setReelsState(prev => ({ ...prev, hook: val }));
  const setBody = (val) => setReelsState(prev => ({ ...prev, body: val }));
  const setCta = (val) => setReelsState(prev => ({ ...prev, cta: val }));
  const setUseDemo = (val) => setReelsState(prev => ({ ...prev, useDemo: val }));
  const setVoiceStatus = (val) => setReelsState(prev => ({ ...prev, voiceStatus: val }));
  const setVoicePath = (val) => setReelsState(prev => ({ ...prev, voicePath: val }));
  const setReelData = (val) => setReelsState(prev => ({ ...prev, reelData: val }));

  const { data: latestCaption } = useLatestCaption({
    enabled: !useDemo
  });

  const { data: latestReel } = useLatestReel(useDemo, {
    enabled: !useDemo
  });

  useEffect(() => {
    if (latestCaption && !useDemo) {
      setHook(latestCaption.hook || '');
      setBody(latestCaption.caption || '');
      setCta(latestCaption.cta || '');
    }
  }, [latestCaption, useDemo]);

  useEffect(() => {
    if (latestReel && !useDemo) {
      setReelData(latestReel.cloudinaryUrl || latestReel.videoPath);
    }
  }, [latestReel, useDemo]);

  const voiceMutation = useGenerateVoice({
    onMutate: () => {
      setVoiceStatus('generating');
    },
    onSuccess: (data) => {
      setVoicePath(data);
      setVoiceStatus('synthesized');
    },
    onError: () => {
      setVoiceStatus('idle');
    }
  });

  const reelMutation = useGenerateReel({
    onSuccess: (data) => {
      setReelData(data);
    }
  });

  // Hydrate mutation output from persistent context if available
  if (reelData && !reelMutation.data) {
    reelMutation.data = reelData;
    reelMutation.isSuccess = true;
  }

  const handleGenerateVoice = () => {
    voiceMutation.mutate({ 
      script: { hook, body, cta }, 
      captionId: latestCaption?.captionId,
      useDemo 
    });
  };

  const handleGenerateReel = () => {
    setReelData(null);
    reelMutation.mutate({
      topicId: latestCaption?.topicId?._id || latestCaption?.topicId,
      script: { hook, body, cta },
      voicePath,
      useDemo
    });
  };


  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-violet-500" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reel Compiler Engine</span>
        </div>
        <h2 className="text-2xl font-bold mt-1">Reel Video Generator</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Synthesize voiceover narrations using Piper TTS, then trigger FFmpeg compilation to bind visual frames, narration, and background tracks into a H.264 reel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Script Editor & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Script Editor Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-500" /> Reel Script Editor
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Hook Sentence</label>
                <textarea
                  rows={2}
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/55 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs transition-all outline-none resize-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Body Script</label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/55 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs transition-all outline-none resize-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Call to Action</label>
                <textarea
                  rows={2}
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/55 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs transition-all outline-none resize-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Synthesis Control Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-800/60">Voiceover & Video Controls</h3>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              
              {/* Voice Generation Card */}
              <div className="flex-1 min-w-[200px] p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Voiceover Status</span>
                  {voiceStatus === 'synthesized' ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{voiceStatus}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleGenerateVoice}
                  disabled={voiceMutation.isPending || !hook || !body || !cta}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs transition-all active:scale-[0.98] disabled:opacity-40"
                >
                  {voiceMutation.isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Generate Voice</span>
                    </>
                  )}
                </button>
              </div>

              {/* Reel Generation Card */}
              <div className="flex-1 min-w-[200px] p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Video Status</span>
                  {reelMutation.isSuccess ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Compiled
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Idle</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleGenerateReel}
                  disabled={reelMutation.isPending || (voiceStatus !== 'synthesized' && !useDemo)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-xs transition-all active:scale-[0.98] disabled:opacity-40"
                >
                  {reelMutation.isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Compiling Reel...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-3.5 h-3.5" />
                      <span>Generate Reel</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="demo-toggle"
                type="checkbox"
                checked={useDemo}
                onChange={(e) => setUseDemo(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300 dark:border-slate-700"
              />
              <label htmlFor="demo-toggle" className="text-xs text-slate-500 dark:text-slate-400 select-none">
                Simulate (Use demo voice over & video playback preview)
              </label>
            </div>
          </div>

          {/* Connection Errors */}
          {(voiceMutation.isError || reelMutation.isError) && (
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 space-y-3">
              <div className="flex items-start gap-2.5 text-rose-800 dark:text-rose-400 text-xs">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Backend connection failed</h4>
                  <p className="mt-0.5 text-rose-700/80 dark:text-rose-400/80">
                    {voiceMutation.error?.message || reelMutation.error?.message || "Could not reach the local synthesis engine. Ensure your backend server is online at port 5000 and FFMPEG_PATH and PIPER_PATH are configured correctly in backend settings."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUseDemo(true)}
                className="text-[10px] bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 text-rose-850 dark:text-rose-300 font-bold px-3 py-1.5 rounded-lg border border-rose-200/50 dark:border-rose-800/40 transition-colors"
              >
                Switch to Mock Simulator
              </button>
            </div>
          )}

        </div>

        {/* Right Side: Smartphone Video Preview (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="relative w-64 h-[440px] rounded-[36px] border-[8px] border-slate-800 dark:border-slate-900 overflow-hidden shadow-xl bg-slate-950 flex flex-col justify-between">
            {/* Camera notch */}
            <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 dark:bg-slate-900 flex justify-center items-center z-10">
              <div className="w-16 h-2 rounded-full bg-slate-900 dark:bg-slate-950" />
            </div>

            {/* Video Player Canvas */}
            {reelMutation.isSuccess && reelMutation.data ? (
              <video 
                src={reelMutation.data} 
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-605 bg-gradient-to-b from-slate-900 to-slate-950">
                <Video className="w-12 h-12 mb-3 opacity-30 animate-pulse-subtle" />
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Video Preview</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-600 mt-2 max-w-[180px] font-sans">
                  Generate voice audio first, then click "Generate Reel" to compile and view preview playback.
                </p>
              </div>
            )}

            {/* Phone Home Bar */}
            <div className="absolute bottom-1 inset-x-0 h-1 flex justify-center z-10">
              <div className="w-24 h-1 rounded-full bg-white/40" />
            </div>
          </div>

          {/* Download Action Footer */}
          {reelMutation.isSuccess && reelMutation.data && (
            <a 
              href={reelMutation.data}
              download="instagram_reel.mp4"
              className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs font-semibold border border-slate-200/50 dark:border-slate-800/60 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Compiled Reel</span>
            </a>
          )}

        </div>

      </div>

    </div>
  );
}
