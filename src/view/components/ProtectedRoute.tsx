import { Navigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'
import { LoadingPage } from '../pages/LoadingPageAuth';

interface ProtectedRouteProps {
   children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
   const { isAuthenticated, isLoading } = useAuth();

   if (isLoading) {
      return <LoadingPage message="Verificando autenticação..." />;
   }

   if (!isAuthenticated) {
      return <Navigate to="/" replace />;//replace={true} não vai para o historico não permite o usuario voltar pra essa tela
   }

   return <>{children}</>;
}


// Rota para Registro de Usuario (ainda não logado porém criando usuario)
export function GuestRoute({ children }: ProtectedRouteProps) {
   const { isAuthenticated, isLoading } = useAuth();

   if (isLoading) {
      return <LoadingPage />;
   }

   // Se JÁ estiver logado, vai para home
   if (isAuthenticated) {
      return <Navigate to="/home" replace />;
   }

   // Se não estiver logado, mostra a página (login/registro)
   return <>{children}</>;
}