import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register service worker for full offline capability & automatic updates
if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onOfflineReady() {
      // App shell and assets are cached and ready for offline learning
    },
  });
}

createRoot(document.getElementById('root')!).render(<App />);
