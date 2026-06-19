// Local and external services (e.g. storage, formatting)
export const StorageService = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return localStorage.getItem(key);
    }
  },
  set: (key, value) => {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  },
  remove: (key) => {
    localStorage.removeItem(key);
  }
};

export * from './content.service';
export * from './scene.service';
export * from './image.service';
export * from './caption.service';
export * from './reel.service';
export * from './instagram.service';
export * from './automation.service';
export * from './topic.service';

