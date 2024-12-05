import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from "lucide-react";
import { Button } from '@/components/ui/button';

const ProfileSelection = () => {
    const navigate = useNavigate();

    const navigateToPacientSignin = (e) => {
        navigate("/cadastro-paciente-tipo")
    };

    const navigateToCaregiverSignin = (e) => {
        navigate("/registro-contato-de-emergencia")
    };

    return (
      <div className='flex flex-col items-center p-4'>
          <h1 className='mb-8 font-bold text-3xl'>
            Cadastro
          </h1>
          
          <p className='mb-16 font-semibold text-lg'>
            Escolha em que modalidade você deseja entrar no app
          </p>
  
          <div className="space-y-8">
            <Button 
              type="submit"
              onClick={ navigateToCaregiverSignin }
              className='flex w-full items-center justify-center gap-2 py-8 text-lg'
            >
            <Mail />
              Entrar como cuidador
            </Button>
  
            <Button 
              type="submit"
              onClick={ navigateToPacientSignin }
              className='flex w-full items-center justify-center gap-2 py-8 text-lg'
            >
            <Mail />
              Entrar como paciente
            </Button>
          </div>
      </div>
    );
  };
  

export default ProfileSelection;