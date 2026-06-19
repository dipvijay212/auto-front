import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
import { getDemoCaption } from './demo.data';

export const captionApi = {
  generateCaption: async ({ topic, audience, benefits, useDemo }) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return getDemoCaption();
    }
    const { data } = await api.post('/captions/generate', { topic, audience, benefits });
    return data;
  },
  getLatestCaption: async () => {
    const { data } = await api.get('/captions/latest');
    return data;
  }
};

export const useGenerateCaption = (options = {}) => {
  return useMutation({
    mutationFn: captionApi.generateCaption,
    ...options
  });
};

export const useLatestCaption = (options = {}) => {
  return useQuery({
    queryKey: ['captions', 'latest'],
    queryFn: captionApi.getLatestCaption,
    retry: false,
    ...options
  });
};

