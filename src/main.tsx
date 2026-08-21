import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './view/styles/index.css';

// Social Logins
import { InitLogin } from './model/services/socialAuth.ts';

// Preferências de acessibilidade
import { initAccessibility } from './viewmodel/hooks/useAccessibility.ts';

// Protected Routes
import { GuestRoute, ProtectedRoute } from './view/components/ProtectedRoute.tsx';

// Contexts
import { AuthProvider } from './viewmodel/contexts/AuthContext.tsx';
import { MedicationProvider } from './viewmodel/contexts/MedicationContext.tsx';


// Pages
import Login from './view/pages/Auth/Login.tsx';
import { Home } from './view/pages/Home.tsx';
import { Medications } from './view/pages/Medications.tsx';
import { AddMedication } from './view/pages/AddMedication.tsx';
import { SearchMedication } from './view/pages/SearchMedication.tsx';
import { MedicationDetails } from './view/pages/MedicationDetails.tsx';
import { Profile } from './view/pages/Profile.tsx';
import { SplashScreen } from './view/pages/SplashScreen.tsx';
import { Navigate } from 'react-router-dom';
import { Register } from './view/pages/Auth/Register.tsx';


// Sem await: se o SDK do Google demorar ou nunca responder, a interface
// ainda monta. Nada da tela depende dessa inicialização terminar.
InitLogin().catch((e) => {
  console.warn("Error: InitLogin not works: ", e)
})

initAccessibility()



createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <BrowserRouter>
      <AuthProvider>
        <SplashScreen />
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

            <Route path='/register' element={<GuestRoute><Register /></GuestRoute>} />

            {/* Redireciona /profile antigo  */}
            <Route path="/profile" element={<Navigate to="/home/profile" replace />} />
          </Routes>
        </MedicationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
