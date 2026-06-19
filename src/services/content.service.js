import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
import { getDemoPlan } from './demo.data';

export const contentPlanApi = {
  createPlan: async ({ topic, useDemo }) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return getDemoPlan(topic);
    }
    const { data } = await api.post('/content-plan', { topic });
    return {
      ...data.data,
      contentType: data.data?.format,
      visualConcepts: data.data?.visualScript,
      contentPlanId: data.contentPlanId
    };
  },
  getLatestPlan: async () => {
    const { data } = await api.get('/content-plan/latest');
    return {
      ...data,
      contentType: data?.format,
      visualConcepts: data?.visualScript,
      contentPlanId: data?._id
    };
  }
};

export const useCreateContentPlan = (options = {}) => {
  return useMutation({
    mutationFn: contentPlanApi.createPlan,
    ...options
  });
};

export const useLatestContentPlan = (options = {}) => {
  return useQuery({
    queryKey: ['contentPlan', 'latest'],
    queryFn: contentPlanApi.getLatestPlan,
    retry: false,
    ...options
  });
};

