import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
import { getDemoScenes } from './demo.data';

export const sceneApi = {
  createScenes: async ({ contentPlanId, topic, useDemo }) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const demo = getDemoScenes();
      return {
        success: true,
        slides: demo.scenes.map((text, idx) => ({
          slideNumber: idx + 1,
          title: `Slide ${idx + 1} Concept`,
          description: `Key insight for topic slide ${idx + 1}.`,
          imagePrompt: text
        }))
      };
    }
    const { data } = await api.post('/scenes', { contentPlanId, topic });
    return data;
  },
  getLatestScenes: async ({ useDemo } = {}) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const demo = getDemoScenes();
      return {
        success: true,
        slides: demo.scenes.map((text, idx) => ({
          slideNumber: idx + 1,
          title: `Slide ${idx + 1} Concept`,
          description: `Key insight for topic slide ${idx + 1}.`,
          imagePrompt: text
        }))
      };
    }
    const { data } = await api.get('/scenes/latest');
    return data;
  }
};

export const useCreateScenes = (options = {}) => {
  return useMutation({
    mutationFn: sceneApi.createScenes,
    ...options
  });
};

export const useLatestScenes = (useDemo = false, options = {}) => {
  return useQuery({
    queryKey: ['scenes', 'latest', useDemo],
    queryFn: () => sceneApi.getLatestScenes({ useDemo }),
    retry: false,
    staleTime: 15000,
    ...options
  });
};

