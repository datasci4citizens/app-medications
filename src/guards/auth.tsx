import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/hooks/auth-context';

const AuthGuard: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;

