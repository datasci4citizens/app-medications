import './Login.css';
import { useState } from 'react';
import { FaApple, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../viewmodel/contexts/AuthContext';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { loginWithGoogle, login } = useAuth();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/home');
    } catch (err) {
      setError('Erro ao fazer login com Google. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const appleUser = {
        id: 'apple-' + Date.now(),
        name: 'Usuário Apple',
        email: 'apple@example.com',
      };
      login(appleUser, 'apple-mock-token');
      navigate('/home');
    }, 2000);
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'guest',
      name: 'Visitante',
      email: 'guest@local.com',
    };
    login(guestUser, 'guest-token');
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg w-full max-w-md flex flex-col gap-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Bem Vindo</h1>
          <p className="text-gray-500 text-sm mt-2">Faça Login no LembraMed</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          disabled={isLoading}
          onClick={handleGoogleLogin}
          className="flex items-center bg-white justify-center gap-3 w-full border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <FaGoogle size={24} />
          <span className="font-medium text-gray-700">
            {isLoading ? 'Carregando...' : 'Entrar com Google'}
          </span>
        </button>

        {/* Botão Apple - Mock */}
        <button
          disabled={isLoading}
          onClick={handleAppleLogin}
          className="text-white flex items-center bg-black justify-center gap-3 w-full border border-gray-300 rounded-lg p-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <FaApple size={24} />
          <span className="font-medium text-white">
            {isLoading ? 'Carregando...' : 'Entrar com Apple'}
          </span>
        </button>

        <button
          disabled={isLoading}
          onClick={handleGuestLogin}
          className="text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
        >
          Entrar sem login
        </button>
      </div>
    </div>
  );
}

export default Login;