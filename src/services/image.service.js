import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export const imageApi = {
  generateImages: async ({ contentPlanId, prompts, useDemo }) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return prompts.map((promptText, idx) => {
        const seed = Math.floor(Math.random() * 1000000) + idx;
        const encoded = encodeURIComponent(promptText);
        const url = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=640&nologo=true&private=true&seed=${seed}`;
        return {
          localPath: url,
          cloudinaryUrl: url,
          prompt: promptText
        };
      });
    }
    const { data } = await api.post('/images/generate', { contentPlanId });
    return data;
  },
  getImages: async () => {
    const { data } = await api.get('/images');
    return data;
  },
  deleteImage: async (id) => {
    const { data } = await api.delete(`/images/${id}`);
    return data;
  },
  getLatestPrompts: async () => {
    const { data } = await api.get('/image-prompts/latest');
    return data;
  },
  getLatestImages: async () => {
    const { data } = await api.get('/images/latest');
    return data;
  },
  compilePrompts: async ({ contentPlanId }) => {
    const { data } = await api.post('/image-prompts', { contentPlanId });
    return data;
  }
};

export const useGenerateImages = (options = {}) => {
  return useMutation({
    mutationFn: imageApi.generateImages,
    ...options
  });
};

export const useImages = (options = {}) => {
  return useQuery({
    queryKey: ['images'],
    queryFn: imageApi.getImages,
    ...options
  });
};

export const useLatestPrompts = (options = {}) => {
  return useQuery({
    queryKey: ['imagePrompts', 'latest'],
    queryFn: imageApi.getLatestPrompts,
    retry: false,
    ...options
  });
};

export const useLatestImages = (options = {}) => {
  return useQuery({
    queryKey: ['images', 'latest'],
    queryFn: imageApi.getLatestImages,
    retry: false,
    ...options
  });
};

export const useCompilePrompts = (options = {}) => {
  return useMutation({
    mutationFn: imageApi.compilePrompts,
    ...options
  });
};

export const useDeleteImage = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: imageApi.deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['images', 'latest'] });
    },
    ...options
  });
};
