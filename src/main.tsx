import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';
import '@fontsource-variable/inter';
import { App } from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Falha ao encontrar raiz do projeto.');
}

createRoot(root).render(
  <GoogleOAuthProvider clientId="699825449700-4m4blaklr11h2tjugdr650ibrqafus4u.apps.googleusercontent.com">
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>,
);
