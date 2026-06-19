import { useMutation } from '@tanstack/react-query';
import api from '../api';

export const instagramApi = {
  publishPost: async ({ imageUrl, caption, useDemo }) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { mediaId: '180293849992011' };
    }
    const { data } = await api.post('/instagram/post', { imageUrl, caption });
    return data.data;
  },
  publishCarousel: async ({ imageUrls, caption, useDemo }) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { mediaId: '180293849992022' };
    }
    const { data } = await api.post('/instagram/carousel', { imageUrls, caption });
    return data.data;
  },
  publishReel: async ({ videoUrl, caption, useDemo }) => {
    if (useDemo) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { mediaId: '180293849992033' };
    }
    const { data } = await api.post('/instagram/reel', { videoUrl, caption });
    return data.data;
  }
};

export const usePublishPost = (options = {}) => {
  return useMutation({
    mutationFn: instagramApi.publishPost,
    ...options
  });
};

export const usePublishCarousel = (options = {}) => {
  return useMutation({
    mutationFn: instagramApi.publishCarousel,
    ...options
  });
};

export const usePublishReel = (options = {}) => {
  return useMutation({
    mutationFn: instagramApi.publishReel,
    ...options
  });
};

