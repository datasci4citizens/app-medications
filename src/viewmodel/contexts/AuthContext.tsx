import { createContext, useContext, useState, useEffect } from 'react'
import { LoadingPage } from '../../view/pages/LoadingPageAuth';
import { authStorage } from '../../model/repositories/AuthRepository';
import { authenticateWithGoogle } from '../../model/services/socialAuth';

import type { User, AuthContextType } from '../../types'
import { medicationStorage } from '../../model/repositories/MedicationRepository';

const AuthContext = createContext<AuthContextType>({} as AuthContextType); //alternativa mais segura é usar createContext<AuthContextType | undefined>(undefined) e depois tratar com useContext para garantir que o provider esteja presente.

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [token, setToken] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(true); // Mudar isso no futuro para uma abordagem mais segura

   useEffect(() => {
      const checkAuth = () => {
         try {
            const savedToken = authStorage.getToken();
            const savedUser = authStorage.getUser() as User | null;

            if (savedToken && savedUser) {
               setToken(savedToken);
               setUser(savedUser);
            }
         } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            authStorage.clearAuth();
         } finally {
            setIsLoading(false);
         }
      };

      checkAuth();
   }, []);

   const login = (userData: User, authToken: string) => {
      setUser(userData);
      setToken(authToken);
      authStorage.saveToken(authToken);
      authStorage.saveUser(userData);
   };

   const loginWithGoogle = async () => {
      const data = await authenticateWithGoogle();
      login(data.user, data.token);
   };

   const logout = () => {
      setUser(null);
      setToken(null);
      authStorage.clearAuth();
      medicationStorage.clear();
   };

   const value: AuthContextType = {
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithGoogle,
      logout,
   };

   // if (isLoading) {
   //    return <LoadingPage message="Carregando..." />;
   // }

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}


// Em vez de fazer: const auth = useContext(AuthContext)
// Você faz: const auth = useAuth() 

export function useAuth() {
   const context = useContext(AuthContext);

   // Verifica se está sendo usado dentro do Provider
   if (!context) {
      throw new Error('useAuth deve ser usado dentro de um AuthProvider');
   }

   return context;
}