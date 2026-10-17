import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { WordlessPhone } from './Wordless';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {new URLSearchParams(window.location.search).has('wordless') ? <WordlessPhone /> : <App />}
  </StrictMode>
);
