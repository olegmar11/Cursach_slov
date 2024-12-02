import '@mantine/carousel/styles.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/tiptap/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Profile from './pages/profile/Profile.tsx';
import CreateNewStory from './pages/stories/CreateNewStory.tsx';
import EditStory from './pages/stories/EditStory.tsx';
import Stories from './pages/stories/Stories.tsx';
import Story from './pages/stories/Story.tsx';
import './i18n';

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'stories',
        element: <Stories />,
      },
      {
        path: 'stories/new',
        element: <CreateNewStory />,
      },
      {
        path: 'stories/:storyId',
        element: <Story />,
      },

      {
        path: 'stories/:storyId/edit',
        element: <EditStory />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: '*',
        element: <Home />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>
);
