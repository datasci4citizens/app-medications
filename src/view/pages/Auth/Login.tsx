import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../viewmodel/contexts/AuthContext';

 import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail } from 'react-icons/md';


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

  return (
    <div className="min-h-screen bg-[#f6f2fb] relative overflow-hidden pb-10 flex flex-col">

      {/* Gradientes */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 360, background:
          'radial-gradient(120% 100% at 50% 0%, rgba(91,42,120,0.55), rgba(91,42,120,0) 70%)', pointerEvents:
          'none'
      }} />
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius:
          '50%', background: 'radial-gradient(circle, rgba(255,194,73,0.18), transparent 60%)', pointerEvents:
          'none'
      }} />
      <div style={{
        position: 'absolute', top: 120, left: -40, width: 160, height: 160, borderRadius:
          '50%', background: 'radial-gradient(circle, rgba(146,84,173,0.20), transparent 60%)', pointerEvents:
          'none'
      }} />

      {/* Brand */}
      <div className="relative z-10 pt-40 text-center px-7">
        <h1 className="font-merriweather text-[38px] font-black text-darkpurle tracking-[-0.02em]">
          LembraMed
        </h1>
        <p className="font-inter text-base font-medium mt-2 leading-snug px-7" style={{
          color:
            '#6b4e85'
        }}>
          Nunca mais esqueça uma dose
        </p>
      </div>

      {/* Botões */}
      <div className="relative z-10 flex flex-col gap-3 px-6 mt-26">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          disabled={isLoading}
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 h-[60px] w-full bg-white border
          border-gray-200 rounded-[18px] font-inter font-bold text-[17px] text-gray-800 disabled:opacity-50  
            shadow-[0_6px_16px_rgba(0,0,0,0.08)]
            transition-transform
            active:scale-[0.97]
            btn-shine"
        >
          <FcGoogle size={22} />
          {isLoading ? 'Carregando...' : 'Continuar com Google'}
        </button>

        <button
          disabled={isLoading}
          onClick={handleAppleLogin}
          className="flex items-center justify-center gap-3 h-[60px] w-full bg-black rounded-[18px] 
          font-inter font-bold text-[17px] text-white disabled:opacity-50   shadow-[0_6px_16px_rgba(0,0,0,0.08)]
           transition-transform
            active:scale-[0.97]
            btn-shine"
        >
          <FaApple size={22} />
          {isLoading ? 'Carregando...' : 'Continuar com Apple'}
        </button>

        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-black/10" />
          <span className="font-inter text-xs font-semibold text-gray-400 uppercase 
            tracking-widest">ou</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <button
          className="flex items-center justify-center gap-3 h-[60px] w-full bg-white border-2 
          border-darkpurple/15 rounded-[18px] font-inter font-bold text-[17px] text-darkpurple   
          shadow-[0_6px_16px_rgba(0,0,0,0.08)]
          transition-transform
          active:scale-[0.97]
          btn-shine"
        >
          <MdEmail />
          Entrar com e-mail
        </button>
      </div>

      <div className="relative z-10 mt-auto pb-8 text-center">
        <p className="font-inter text-sm text-gray-500 mb-1">
          Primeira vez no LembraMed?
        </p>
        <button onClick={() => navigate('/register')} 
        className="font-merriweather font-extrabold text-[17px] text-darkpurple underline underline-offset-4">
          Criar uma conta
        </button>
          <p className="font-inter text-[11px] text-gray-400 leading-relaxed px-4 mt-4">
        Ao continuar, você concorda com os{' '}
        <u>Termos</u> e a <u>Política de Privacidade</u>.
      </p>
      </div>
    


    </div>
  );

}

export default Login;