import { GoogleOAuthProvider } from '@react-oauth/google';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { AddMedication } from './AddMedication.tsx';
import App from './App.tsx';
import { Home } from './Home.tsx';
// controle de login
import { AuthProvider } from './contexts/AuthContext.tsx';
import { GuestRoute, ProtectedRoute } from './utils/ProtectedRoute.tsx';



const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<GuestRoute><App /></GuestRoute>} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><AddMedication /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><AddMedication /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);
