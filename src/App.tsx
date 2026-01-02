import './App.css';
import { FcGoogle } from "react-icons/fc";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleLogin() {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      navigate('/home')
    }, 2000)
  }


  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg w-full max-w-md'>

        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'> Bem Vindo</h1>
          <p className='text-gray-500 text-sm mt-2'> Faça Login no LembraMed</p>
        </div>

        <button
          disabled={isLoading}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleLogin}
        >
          {!isLoading && <FcGoogle size={24} />}
          <span className="font-medium text-gray-700">
            {isLoading ? "Carregando..." : "Entrar com Google"}
          </span>
        </button>

      </div>
    </div>
  );
}

export default App;
