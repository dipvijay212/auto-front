import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api';
import { INITIAL_DEMO_AUTOMATION } from './demo.data';

const getLocalDemoState = () => {
  const stored = localStorage.getItem('demo_automation_config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_DEMO_AUTOMATION;
    }
  }
  localStorage.setItem('demo_automation_config', JSON.stringify(INITIAL_DEMO_AUTOMATION));
  return INITIAL_DEMO_AUTOMATION;
};

const setLocalDemoState = (state) => {
  localStorage.setItem('demo_automation_config', JSON.stringify(state));
};

export const automationApi = {
  getConfig: async ({ useDemo } = {}) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getLocalDemoState();
    }
    const { data } = await api.get('/automation');
    return data;
  },
  updateConfig: async ({ enabled, schedule, useDemo }) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const current = getLocalDemoState();
      const next = { ...current, enabled, schedule };
      setLocalDemoState(next);
      return { success: true };
    }
    const { data } = await api.post('/automation', { enabled, schedule });
    return data;
  },
  getPipelineLogs: async () => {
    const { data } = await api.get('/logs');
    return data.data;
  }
};

export const useAutomationConfig = (useDemo = false, options = {}) => {
  return useQuery({
    queryKey: ['automation', useDemo],
    queryFn: () => automationApi.getConfig({ useDemo }),
    ...options
  });
};

export const useUpdateAutomationConfig = (options = {}) => {
  return useMutation({
    mutationFn: automationApi.updateConfig,
    ...options
  });
};

export const usePipelineLogs = (options = {}) => {
  return useQuery({
    queryKey: ['pipelineLogs'],
    queryFn: automationApi.getPipelineLogs,
    ...options
  });
};

