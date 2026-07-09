window.addEventListener('error', (e) => {
  console.log('GLOBAL ERROR CAUGHT:', e.message, e.filename, e.lineno, e.colno);
});
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
