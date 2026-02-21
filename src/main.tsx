import { GoogleOAuthProvider } from '@react-oauth/google';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';

// Protected Routes
import { GuestRoute, ProtectedRoute } from './utils/ProtectedRoute.tsx';

// Contexts
import { AuthProvider } from './contexts/AuthContext.tsx';
import { MedicationProvider } from './contexts/MedicationContext.tsx';


// Pages
import Login from './pages/Auth/Login.tsx';
import { Home } from './pages/Home.tsx';
import { AddMedication } from './pages/AddMedication.tsx';



const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AuthProvider>
          <MedicationProvider>
            <Routes>
              <Route path="/" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/add" element={<ProtectedRoute><AddMedication /></ProtectedRoute>} />
              <Route path="/edit/:id" element={<ProtectedRoute><AddMedication /></ProtectedRoute>} />
            </Routes>
          </MedicationProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);
