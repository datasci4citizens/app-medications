import { createContext, useContext, useState, useEffect } from 'react'
import { LoadingPage } from '../pages/LoadingPageAuth';


interface User {
   id: string;
   name: string;
   email: string;
   // Teste, tem que adicionar outros tipos depois
}

interface AuthContextType {
   user: User | null; // null = deslogado
   token: string | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   login: (userData: User, authToken: string) => void;
   logout: () => void; // Ajustar o logout depois que implementamos sistema com backend 
}


const AuthContext = createContext<AuthContextType>({} as AuthContextType); //alternativa mais segura é usar createContext<AuthContextType | undefined>(undefined) e depois tratar com useContext para garantir que o provider esteja presente.

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [token, setToken] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(true); // Mudar isso no futuro para uma abordagem mais segura

   // Verificar se esta logado
   useEffect(() => {
      // Tem que mudar depois que não usar mais o LocalStorage, usar Cookies (mais seguro)
      const checkAuth = () => {
         try {

            const savedToken = localStorage.getItem('auth_token');
            const savedUser = localStorage.getItem('user');

            if (savedToken && savedUser) {
               setToken(savedToken);
               setUser(JSON.parse(savedUser))
            }
         } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            // Se der erro, limpa tudo
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
         } finally {
            setIsLoading(false);
         }
      };

      checkAuth();
   }, []) // [] => executa só quando o componente monta




   // Implementaçõs do Sistema de Login extramamente simplificados até o backend cuidar disso
   const login = (userData: User, authToken: string) => {
      setUser(userData);
      setToken(authToken);

      // Lembrar de Arrumar isso quando houver um backend (não é seguro o uso de LocalStorage)
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
   }

   const logout = () => {
      setUser(null);
      setToken(null);

      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('my_medications'); // Se não criar outro usuario ele mantem os mesmos medicamentos
   };

   const value: AuthContextType = {
      user,
      token,
      isAuthenticated: !!user, // !! converte para boolean (null = false, objeto = true)
      isLoading,
      login,
      logout,
   };

   if (isLoading) {
      return <LoadingPage message="Carregando..." />;
   }

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