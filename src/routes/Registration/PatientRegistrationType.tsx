import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PatientRegistrationType = () => {
    const navigate = useNavigate();

    const navigateToPacientSignin = (e) => {
        navigate("/adicionar-paciente")
    };

    const navigateToPatientRegistration = (e) => {
        navigate("/registro-paciente")
    };

    return (
      <div className='flex flex-col items-center p-4'>
          <h1 className='mb-8 font-bold text-3xl'>
            Cadastro Paciente
          </h1>
          
          <p className='mb-16 font-semibold text-lg'>
          Seu paciente já possui cadastro conosco?
          </p>
  
          <div className="flex flex-col items-center space-y-8">
            <Button 
              type="submit"
              onClick={ navigateToPatientRegistration }
              className='flex w-full items-center p-8 text-lg'
            >
              Cadastrar novo
            </Button>

            <p className='text-2xl'>ou</p>
  
            <Button
              variant="secondary"
              onClick={ navigateToPacientSignin }
              className='flex w-full items-center p-8 text-lg'
            >
              Adicionar paciente existente
            </Button>
          </div>
      </div>
    );
  };

export default PatientRegistrationType;