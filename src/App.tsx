import './App.css';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"google" | "apple" | null>(null);

  const navigate = useNavigate();

  function handleLogin(type: "google" | "apple") {
    setLoginType(type);
    setIsLoading(true); 

    setTimeout(() => {
      setIsLoading(false); 
      setLoginType(null);
      navigate('/home');
    }, 2000);
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg w-full max-w-md flex flex-col gap-4'>

        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'> Bem Vindo</h1>
          <p className='text-gray-500 text-sm mt-2'> Faça Login no LembraMed</p>
        </div>

        {/* Google Button */}
        <button
          disabled={isLoading}
          onClick={() => handleLogin("google")} 
          className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginType === 'google' ? (
             <span className="font-medium text-gray-700">Carregando...</span>
          ) : (
            <>
              <FcGoogle size={24} />
              <span className="font-medium text-gray-700">Entrar com Google</span>
            </>
          )}
        </button>

        {/* Apple Button */}
        <button
          disabled={isLoading}
          onClick={() => handleLogin("apple")}
          className="text-white flex items-center bg-black justify-center gap-3 w-full border border-gray-300 rounded-lg p-3 hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
           {loginType === 'apple' ? (
             <span className="font-medium text-white">Carregando...</span>
          ) : (
            <>
              <FaApple size={24} />
              <span className="font-medium text-white">Entrar com Apple</span>
            </>
          )}
        </button>

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