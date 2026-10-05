import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

// Safe auto-register PWA service worker (handles iframes and restricted contexts)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silently handle sandbox/iframe restrictions
      });
    } catch (_e) {
      // Ignore in restricted environments
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
