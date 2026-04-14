import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'sonner';
import { Agentation } from 'agentation';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" />
    {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
  </StrictMode>
);
