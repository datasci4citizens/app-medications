import './App.css';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential  // ID Token (JWT)
        })
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (response.ok) {
        // tem que arrumar isso depois não é seguro
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log("✅ Login bem-sucedido!");
        navigate('/home');
      } else {
        console.error("❌ Erro do backend:", data);
        alert('Erro no login: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('❌ Erro de rede:', error);
      alert('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Google Login Error');
    alert('Erro ao fazer login com Google');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg w-full max-w-md flex flex-col gap-4'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'>Bem Vindo</h1>
          <p className='text-gray-500 text-sm mt-2'>Faça Login no LembraMed</p>
        </div>

        {/* Google Login Button - Componente Oficial */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%"
          ux_mode='redirect'
        />

        {/* Botão Apple - Mock */}
        <button
          disabled={isLoading}
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              navigate('/home');
            }, 2000);
          }}
          className="text-white flex items-center bg-black justify-center gap-3 w-full border border-gray-300 rounded-lg p-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <FaApple size={24} />
          <span className="font-medium text-white">
            {isLoading ? 'Carregando...' : 'Entrar com Apple'}
          </span>
        </button>

        {/* Entrar sem login */}
        <button
          disabled={isLoading}
          onClick={() => navigate('/home')}
          className="text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
        >
          Entrar sem login
        </button>
      </div>
    </div>
  );
}

export default App;