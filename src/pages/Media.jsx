import React, { useState } from 'react';
import { 
  FolderHeart, 
  Image as ImageIcon, 
  Video, 
  Download, 
  Trash2, 
  Play, 
  Maximize2, 
  X, 
  RefreshCw, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { useImages, useDeleteImage, useReels, useDeleteReel } from '../services';

export default function Media() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'images', 'reels'
  const [previewItem, setPreviewItem] = useState(null); // { type: 'image'|'reel', url: string, title?: string }

  // Queries
  const { data: images = [], isLoading: isImagesLoading, isError: isImagesError, refetch: refetchImages } = useImages();
  const { data: reels = [], isLoading: isReelsLoading, isError: isReelsError, refetch: refetchReels } = useReels();

  // Mutations
  const deleteImageMutation = useDeleteImage();
  const deleteReelMutation = useDeleteReel();

  const handleRefresh = () => {
    refetchImages();
    refetchReels();
  };

  const handleDeleteImage = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImageMutation.mutateAsync(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteReel = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this compiled Reel video?')) {
      try {
        await deleteReelMutation.mutateAsync(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDownload = async (url, filename, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  // Format paths/urls to absolute
  const resolveAssetUrl = (pathOrUrl) => {
    if (!pathOrUrl) return '';
    if (pathOrUrl.startsWith('http')) return pathOrUrl;
    return `http://localhost:5000/${pathOrUrl}`;
  };

  const isLoading = isImagesLoading || isReelsLoading;
  const isError = isImagesError || isReelsError;

  // Filter lists
  const displayImages = images.map(img => ({
    id: img._id,
    type: 'image',
    url: resolveAssetUrl(img.imageUrl || img.localPath),
    prompt: img.promptId?.promptText || 'Generated Image Prompt',
    createdAt: img.createdAt
  }));

  const displayReels = reels.map(reel => ({
    id: reel._id,
    type: 'reel',
    url: resolveAssetUrl(reel.cloudinaryUrl || reel.videoPath),
    title: reel.topicId?.title || reel.topicId?.text || 'Instagram Reel',
    duration: reel.duration,
    createdAt: reel.createdAt
  }));

  const combinedMedia = [
    ...(activeTab === 'all' || activeTab === 'images' ? displayImages : []),
    ...(activeTab === 'all' || activeTab === 'reels' ? displayReels : [])
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Asset Repository</span>
          </div>
          <button 
            onClick={handleRefresh}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Refresh assets"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <h2 className="text-2xl font-bold mt-1">Media Library</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review, preview, download, and manage all your generated assets.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-3 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            All Assets
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'images'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Images
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'reels'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Reels
          </button>
        </div>
        
        <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold font-sans">
          Showing {combinedMedia.length} assets
        </span>
      </div>

      {/* Status Messages */}
      {isLoading && combinedMedia.length === 0 && (
        <div className="text-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Scanning database assets...</p>
        </div>
      )}

      {isError && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Failed to retrieve assets</h4>
            <p className="mt-0.5 text-rose-700/80 dark:text-rose-400/80">Check connection to backend server and try refreshing.</p>
          </div>
        </div>
      )}

      {!isLoading && combinedMedia.length === 0 && (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <FolderHeart className="w-12 h-12 text-slate-350 dark:text-slate-800 mx-auto mb-4" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Generated Media Found</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't run any pipeline generation tasks yet. Head over to the dashboard to begin creating visual assets.
          </p>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {combinedMedia.map((item) => (
          <div 
            key={item.id}
            onClick={() => setPreviewItem(item)}
            className="relative rounded-2xl bg-white dark:bg-slate-955 border border-slate-100 dark:border-slate-800/60 shadow-sm overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            {/* Visual Canvas aspect container */}
            <div className="relative aspect-[4/5] bg-slate-950 flex items-center justify-center overflow-hidden">
              {item.type === 'image' ? (
                <img 
                  src={item.url} 
                  alt="Asset Preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-tr from-slate-950 via-purple-950/40 to-slate-900 text-white relative">
                  <Play className="w-10 h-10 text-white fill-current opacity-70 group-hover:opacity-100 transition-opacity absolute inset-0 m-auto" />
                  <span className="text-[9px] uppercase tracking-widest font-bold bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded border border-pink-500/20 w-fit shrink-0">
                    Compiled Reel
                  </span>
                  <div className="space-y-1 z-10">
                    <span className="text-[8px] text-slate-400 font-semibold block uppercase">Duration</span>
                    <span className="text-xs font-extrabold">{item.duration ? `${Math.round(item.duration)}s` : 'Unknown'}</span>
                  </div>
                </div>
              )}

              {/* Hover overlay actions */}
              <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-white dark:bg-slate-955">
              <div className="space-y-1">
                <span className="text-[8px] uppercase tracking-wider font-bold text-indigo-500 font-sans">
                  {item.type === 'image' ? 'Visual Frame' : 'Instagram Reel'}
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 line-clamp-2 leading-relaxed font-sans" title={item.type === 'image' ? item.prompt : item.title}>
                  {item.type === 'image' ? item.prompt : item.title}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-2 border-t border-slate-50 dark:border-slate-800/40 pt-3">
                <span className="text-[9px] text-slate-400 font-semibold">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDownload(item.url, item.type === 'image' ? `image_${item.id}.jpg` : `reel_${item.id}.mp4`, e)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border border-slate-200/50 dark:border-slate-800/60 transition-all"
                    title="Download asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => item.type === 'image' ? handleDeleteImage(item.id, e) : handleDeleteReel(item.id, e)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-500/10 dark:bg-slate-900 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-all border border-slate-200/50 dark:border-slate-800/60"
                    title="Delete asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview Overlay */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-slate-900 dark:bg-slate-955 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                {previewItem.type === 'image' ? <ImageIcon className="w-4.5 h-4.5 text-indigo-400" /> : <Video className="w-4.5 h-4.5 text-pink-400" />}
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  {previewItem.type === 'image' ? 'Image Zoom Preview' : 'Reel Video Playback'}
                </span>
              </div>
              <button 
                onClick={() => setPreviewItem(null)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Visual center) */}
            <div className="flex-1 overflow-auto bg-black flex items-center justify-center relative min-h-[300px]">
              {previewItem.type === 'image' ? (
                <img 
                  src={previewItem.url} 
                  alt="Zoom Preview" 
                  className="max-w-full max-h-[60vh] object-contain"
                />
              ) : (
                <video 
                  src={previewItem.url} 
                  controls 
                  autoPlay
                  loop
                  className="max-w-full max-h-[60vh]"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-900 dark:bg-slate-950 border-t border-slate-800 flex justify-between items-center gap-4 flex-wrap text-white">
              <p className="text-xs text-slate-400 font-sans flex-1 line-clamp-2">
                {previewItem.type === 'image' ? previewItem.prompt : previewItem.title}
              </p>
              
              <button
                onClick={(e) => handleDownload(previewItem.url, previewItem.type === 'image' ? `image_${previewItem.id}.jpg` : `reel_${previewItem.id}.mp4`, e)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs active:scale-95 transition-all shadow-md"
              >
                <Download className="w-4 h-4" /> Download File
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
