import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/index.css';

// Social Logins
import { InitLogin } from './services/socialAuth.ts';

// Protected Routes
import { GuestRoute, ProtectedRoute } from './utils/ProtectedRoute.tsx';

// Contexts
import { AuthProvider } from './contexts/AuthContext.tsx';
import { MedicationProvider } from './contexts/MedicationContext.tsx';


// Pages
import Login from './pages/Auth/Login.tsx';
import { Home } from './pages/Home.tsx';
import { Medications } from './pages/Medications.tsx';
import { AddMedication } from './pages/AddMedication.tsx';
import { SearchMedication } from './pages/SearchMedication.tsx';
import { MedicationDetails } from './pages/MedicationDetails.tsx';
import { Profile } from './pages/Profile.tsx';
import { Navigate } from 'react-router-dom';


await InitLogin()


createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <BrowserRouter>
      <AuthProvider>
        <MedicationProvider>
          <Routes>
            <Route path="/" element={<GuestRoute><Login /></GuestRoute>} />

            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}>
              <Route index element={<Navigate to="medications" replace />} />
              <Route path="medications" element={<Medications />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/add" element={<ProtectedRoute><AddMedication /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><AddMedication /></ProtectedRoute>} />
            <Route path='/search' element={<ProtectedRoute> <SearchMedication /> </ProtectedRoute>} />
            <Route path='/medication/user/:id' element={<ProtectedRoute> <MedicationDetails /></ProtectedRoute>} />
            <Route path='/medication/search/:id' element={<ProtectedRoute> <MedicationDetails /></ProtectedRoute>} />

            {/* Redireciona /profile antigo para a nova estrutura se necessário, ou apenas remove */}
            <Route path="/profile" element={<Navigate to="/home/profile" replace />} />
          </Routes>
        </MedicationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
