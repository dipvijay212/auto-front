import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export const topicApi = {
  getTopics: async () => {
    const { data } = await api.get('/topics');
    return data;
  },
  createTopic: async (topicData) => {
    const payload = typeof topicData === 'string' ? { text: topicData } : topicData;
    const { data } = await api.post('/topics', payload);
    return data;
  },
  updateTopic: async ({ id, ...updateData }) => {
    const { data } = await api.put(`/topics/${id}`, updateData);
    return data;
  },
  deleteTopic: async (id) => {
    const { data } = await api.delete(`/topics/${id}`);
    return data;
  },
  generateAITopics: async (niche) => {
    const { data } = await api.post('/topics/ai-generate', { niche });
    return data;
  },
  triggerPipeline: async () => {
    const { data } = await api.post('/topics/trigger');
    return data;
  }
};

export const useTopics = (options = {}) => {
  return useQuery({
    queryKey: ['topics'],
    queryFn: topicApi.getTopics,
    ...options
  });
};

export const useAddTopic = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topicApi.createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    ...options
  });
};

export const useUpdateTopic = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topicApi.updateTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    ...options
  });
};

export const useDeleteTopic = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topicApi.deleteTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    ...options
  });
};

export const useGenerateAITopics = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: topicApi.generateAITopics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    ...options
  });
};

export const useTriggerPipeline = (options = {}) => {
  return useMutation({
    mutationFn: topicApi.triggerPipeline,
    ...options
  });
};

