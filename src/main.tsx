import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { Home } from './Home.tsx'
import { AddMedication } from './AddMedication.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/home' element={<Home />} />
        <Route path="/add" element={<AddMedication />} />
        <Route path="/edit/:id" element={<AddMedication />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
