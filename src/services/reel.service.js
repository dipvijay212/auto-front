import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { DEMO_VIDEO_URL } from './demo.data';

export const reelApi = {
  generateVoice: async ({ script, useDemo }) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return 'generated/audio/mock_audio.wav';
    }
    const { data } = await api.post('/voice/generate', { script });
    return data.voicePath;
  },
  generateReel: async ({ topicId, script, voicePath, images, useDemo }) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 2500));
      return DEMO_VIDEO_URL;
    }
    const { data } = await api.post('/reels/generate', { topicId, script, voicePath, images });
    return data.videoPath;
  },
  getReels: async () => {
    const { data } = await api.get('/reels');
    return data;
  },
  deleteReel: async (id) => {
    const { data } = await api.delete(`/reels/${id}`);
    return data;
  },
  getLatestReel: async ({ useDemo } = {}) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { videoPath: DEMO_VIDEO_URL };
    }
    const { data } = await api.get('/reels/latest');
    return data;
  }
};

export const useGenerateVoice = (options = {}) => {
  return useMutation({
    mutationFn: reelApi.generateVoice,
    ...options
  });
};

export const useGenerateReel = (options = {}) => {
  return useMutation({
    mutationFn: reelApi.generateReel,
    ...options
  });
};

export const useReels = (options = {}) => {
  return useQuery({
    queryKey: ['reels'],
    queryFn: reelApi.getReels,
    ...options
  });
};

export const useLatestReel = (useDemo = false, options = {}) => {
  return useQuery({
    queryKey: ['reels', 'latest', useDemo],
    queryFn: () => reelApi.getLatestReel({ useDemo }),
    retry: false,
    ...options
  });
};

export const useDeleteReel = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reelApi.deleteReel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] });
      queryClient.invalidateQueries({ queryKey: ['reels', 'latest'] });
    },
    ...options
  });
};

