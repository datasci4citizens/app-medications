import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AddPatient = () => {
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const submitToken = (e) => {
        console.log("Should submit token");
        navigate("/");
    };

    return (
      <div className='flex flex-col items-center p-4'>

        <h1 className='mb-8 font-bold text-3xl'>
            Adicionar Paciente
        </h1>

        <div className="flex flex-col">
          <p className='mb-2 font-semibold text-lg'>
            Digite o token do paciente.
          </p>
          <p className='mb-8 text-lg'>
                Ele pode ser acessado no perfil do paciente
          </p>
                <Input
                    id="token"
                    placeholder="Digite o token"
                    value={token}
                    className='p-6'
                    onChange={(e) => setToken(e.target.value)}
			    />
            <div className="flex flex-colgap-6 items-center justify-center">
                <Button 
                onClick={ submitToken }
                className='mt-16 p-6 text-lg'
                >
                Enviar
                </Button>
            </div>
          </div>
      </div>
    );
  };

export default AddPatient;