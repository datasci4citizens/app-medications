import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmergencyContactRegistration = () => {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [birthdate, setBirthdate] = useState('');
	const [emergencyContact, setEmergencyContact] = useState('');
	const navigate = useNavigate();

	const handleGoToHome = (e) => {
		navigate("/");
	};

	const addCaregiver = (e) => {
		navigate("/registro-cuidador");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission here
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
				console.log({ name, phone, birthdate });
	};

	return (
		<div className='container mx-auto h-screen p-16'>
			<h1 className='mb-6 font-bold text-2xl'>Cadastro emergência</h1>
			<form
				onSubmit={handleSubmit}
				className='h-[80vh] space-y-8 overflow-auto'
			>
				<div>
					<Label htmlFor="name">Nome do contato de emergência</Label>
					<Input
						id="name"
						placeholder="Nome"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor="phone">Telefone do contato de emergência</Label>
					<Input
						id="phone"
						placeholder="(00) 00000-0000"
						type="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>
				<div className="flex flex-col items-center justify-center space-y-4">
					<Button className="mt-4" onClick={handleGoToHome}>Entrar</Button>
					<p>ou</p>
					<Button className="mt-4" onClick={addCaregiver}>
						Adicionar cuidador(a)
					</Button>
				</div>
			</form>
		</div>
	);
};

export default EmergencyContactRegistration;