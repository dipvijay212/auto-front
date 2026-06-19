import React, { createContext, useContext, useState } from 'react';

const PersistentStateContext = createContext();

export const PersistentStateProvider = ({ children }) => {
  const [plannerState, setPlannerState] = useState({
    topic: '',
    useDemo: false,
    planData: null,
  });

  const [scenesState, setScenesState] = useState({
    topic: '',
    useDemo: false,
    scenesData: null,
  });

  const [imagesState, setImagesState] = useState({
    prompts: [
      "Minimalist workspace with warm sunset lighting, high resolution product shot",
      "Close up of neon coding dashboard screen showing javascript array manipulation",
      "Isometric design representing server scale, cloud network connections, blue and purple lighting"
    ],
    useDemo: false,
    imagesData: null,
  });

  const [captionsState, setCaptionsState] = useState({
    topic: '',
    audience: 'Business owners, entrepreneurs, marketing leads',
    benefits: 'Increased online credibility, 24/7 client generation',
    useDemo: false,
    captionData: null,
  });

  const [reelsState, setReelsState] = useState({
    hook: "Stop wasting hours typing repetitive commands in VS Code! 🛑",
    body: "Here are 3 shortcuts that will double your coding speed: 1) Ctrl+P to search any file instantly, 2) Alt+Up/Down to shift lines, and 3) Ctrl+D to select multiple occurrences. Try these today!",
    cta: "Comment SHORTCUTS below and I'll DM you my master cheat-sheet! 🚀",
    useDemo: false,
    voiceStatus: 'idle',
    voicePath: '',
    reelData: null,
  });

  return (
    <PersistentStateContext.Provider
      value={{
        plannerState,
        setPlannerState,
        scenesState,
        setScenesState,
        imagesState,
        setImagesState,
        captionsState,
        setCaptionsState,
        reelsState,
        setReelsState,
      }}
    >
      {children}
    </PersistentStateContext.Provider>
  );
};

export const usePersistentState = () => {
  const context = useContext(PersistentStateContext);
  if (!context) {
    throw new Error('usePersistentState must be used within a PersistentStateProvider');
  }
  return context;
};
