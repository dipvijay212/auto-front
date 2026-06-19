import React, { useState } from 'react';
import { 
  Instagram, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Image as ImageIcon, 
  Layers, 
  Video, 
  Copy, 
  Check, 
  Facebook, 
  Globe,
  Send
} from 'lucide-react';
import { usePublishPost, usePublishCarousel, usePublishReel } from '../services';

export default function Publishing() {
  const [useDemo, setUseDemo] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  // Form states
  const [postImage, setPostImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800');
  const [postCaption, setPostCaption] = useState('My first automated coding tutorial! 🚀 #cleancode #developer');
  
  const [carouselImages, setCarouselImages] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800\nhttps://images.unsplash.com/photo-1618005198143-e528346440f2?w=800'
  );
  const [carouselCaption, setCarouselCaption] = useState('Slide deck guide on clean REST design! 💡 #api #express');

  const [reelVideo, setReelVideo] = useState('generated/videos/reel_sample.mp4');
  const [reelCaption, setReelCaption] = useState('Watch how this TTS pipeline generates audio! 🎙️ #tts #artificialintelligence');

  // Copy helper
  const handleCopy = (val, label) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  // Mutations
  const imagePostMutation = usePublishPost();
  const carouselPostMutation = usePublishCarousel();
  const reelPostMutation = usePublishReel();

  const handlePublishImage = (e) => {
    e.preventDefault();
    imagePostMutation.mutate({ imageUrl: postImage, caption: postCaption, useDemo });
  };

  const handlePublishCarousel = (e) => {
    e.preventDefault();
    const urls = carouselImages.split('\n').map(u => u.trim()).filter(Boolean);
    carouselPostMutation.mutate({ imageUrls: urls, caption: carouselCaption, useDemo });
  };

  const handlePublishReel = (e) => {
    e.preventDefault();
    reelPostMutation.mutate({ videoUrl: reelVideo, caption: reelCaption, useDemo });
  };


  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Instagram className="w-5 h-5 text-pink-500" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Instagram Publishing Engine</span>
        </div>
        <h2 className="text-2xl font-bold mt-1">Publisher Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Distribute visual frames, educational carousel slides, and reels directly to your personal Instagram account via Meta Graph APIs.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Instagram Account Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Instagram ID */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Instagram Account ID</span>
                <span className="text-xs font-mono font-bold">17841405910283495</span>
              </div>
              <button
                onClick={() => handleCopy('17841405910283495', 'ig')}
                className="p-2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
                title="Copy ID"
              >
                {copiedKey === 'ig' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Facebook ID */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">Connected FB Page ID</span>
                <span className="text-xs font-mono font-bold">102834910283491</span>
              </div>
              <button
                onClick={() => handleCopy('102834910283491', 'fb')}
                className="p-2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
                title="Copy ID"
              >
                {copiedKey === 'fb' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-2 flex-wrap font-sans">
            <span className="flex items-center gap-1.5"><Facebook className="w-4 h-4 text-blue-600" /> Meta Developer Verified</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-indigo-500" /> Access Token Status: Perpetual</span>
          </div>

        </div>

        {/* Connection Status Panel (1 Col) */}
        <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 text-white flex flex-col justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider font-sans">Facebook API Integration</span>
            <h4 className="text-lg font-bold">API Access Status</h4>
          </div>

          <div className="py-4 flex items-center gap-3">
            <div className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </div>
            <div>
              <span className="text-sm font-bold text-emerald-400">Connected</span>
              <p className="text-[10px] text-slate-400 leading-tight">API queries responding healthy</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <input
              id="demo-toggle"
              type="checkbox"
              checked={useDemo}
              onChange={(e) => setUseDemo(e.target.checked)}
              className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-white/10 bg-white/5"
            />
            <label htmlFor="demo-toggle" className="text-xs text-slate-300 select-none">
              Simulate Publishing (Mock ID replies)
            </label>
          </div>
        </div>
      </div>

      {/* Grid of Post Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form 1: Single Image Post */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Single Image Post</h3>
            </div>

            <form onSubmit={handlePublishImage} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Image URL / Path</label>
                <input
                  type="text"
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Caption</label>
                <textarea
                  rows={3}
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/55 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs outline-none resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={imagePostMutation.isPending || !postImage}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-500 text-white font-semibold text-xs active:scale-[0.98] transition-all disabled:opacity-40"
              >
                {imagePostMutation.isPending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing Image...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Image</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result alerts */}
          {imagePostMutation.isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Published! Media ID: {imagePostMutation.data.mediaId}</span>
            </div>
          )}
          {imagePostMutation.isError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/10 text-rose-500 text-xs font-semibold flex items-start gap-1.5">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>Publish failed: {imagePostMutation.error.message}</span>
            </div>
          )}
        </div>

        {/* Form 2: Carousel Post */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Carousel Slide Post</h3>
            </div>

            <form onSubmit={handlePublishCarousel} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Image URLs (Line separated)</label>
                <textarea
                  rows={2}
                  value={carouselImages}
                  onChange={(e) => setCarouselImages(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/55 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs outline-none resize-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Caption</label>
                <textarea
                  rows={3}
                  value={carouselCaption}
                  onChange={(e) => setCarouselCaption(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/55 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs outline-none resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={carouselPostMutation.isPending || !carouselImages.trim()}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-500 text-white font-semibold text-xs active:scale-[0.98] transition-all disabled:opacity-40"
              >
                {carouselPostMutation.isPending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing Carousel...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Carousel</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result alerts */}
          {carouselPostMutation.isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Published! Media ID: {carouselPostMutation.data.mediaId}</span>
            </div>
          )}
          {carouselPostMutation.isError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/10 text-rose-500 text-xs font-semibold flex items-start gap-1.5">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>Publish failed: {carouselPostMutation.error.message}</span>
            </div>
          )}
        </div>

        {/* Form 3: Reel Post */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
                <Video className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Reel Video Post</h3>
            </div>

            <form onSubmit={handlePublishReel} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Video URL / Local Path</label>
                <input
                  type="text"
                  value={reelVideo}
                  onChange={(e) => setReelVideo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Caption</label>
                <textarea
                  rows={3}
                  value={reelCaption}
                  onChange={(e) => setReelCaption(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/55 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs outline-none resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={reelPostMutation.isPending || !reelVideo}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-500 text-white font-semibold text-xs active:scale-[0.98] transition-all disabled:opacity-40"
              >
                {reelPostMutation.isPending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing Reel...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Reel</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result alerts */}
          {reelPostMutation.isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Published! Media ID: {reelPostMutation.data.mediaId}</span>
            </div>
          )}
          {reelPostMutation.isError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/10 text-rose-500 text-xs font-semibold flex items-start gap-1.5">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>Publish failed: {reelPostMutation.error.message}</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
