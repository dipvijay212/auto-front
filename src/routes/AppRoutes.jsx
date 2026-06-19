import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SidebarLayout from '../layouts/SidebarLayout';
import Dashboard from '../pages/Dashboard';
import ContentPlanner from '../pages/ContentPlanner';
import Scenes from '../pages/Scenes';
import ImageGenerator from '../pages/ImageGenerator';
import Captions from '../pages/Captions';
import Reels from '../pages/Reels';
import Publishing from '../pages/Publishing';
import Automation from '../pages/Automation';
import Queue from '../pages/Queue';
import Media from '../pages/Media';
import Logs from '../pages/Logs';
import Settings from '../pages/Settings';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="planner" element={<ContentPlanner />} />
          <Route path="scenes" element={<Scenes />} />
          <Route path="images" element={<ImageGenerator />} />
          <Route path="captions" element={<Captions />} />
          <Route path="reels" element={<Reels />} />
          <Route path="publish" element={<Publishing />} />
          <Route path="automation" element={<Automation />} />
          <Route path="queue" element={<Queue />} />
          <Route path="media" element={<Media />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
