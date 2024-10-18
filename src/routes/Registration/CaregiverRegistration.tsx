import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CaregiverRegistration = () => {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [emergencyContact, setEmergencyContact] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		navigate("/");
	};

	return (
		<div className='container mx-auto h-screen p-16'>
			<h1 className='mb-6 font-bold text-2xl'>Cadastro cuidador(a)</h1>
			<form
				onSubmit={handleSubmit}
				className='h-[80vh] space-y-4 overflow-auto'
			>
				<div>
					<Label htmlFor="name">Nome</Label>
					<Input
						id="name"
						placeholder="Nome"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor="phone">Telefone</Label>
					<Input
						id="phone"
						placeholder="(00) 00000-0000"
						type="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>
				<div className="flex items-center space-x-2">
					<Switch
						id="emergencyContact"
						checked={emergencyContact}
						onCheckedChange={setEmergencyContact}
					/>
					<Label htmlFor="emergencyContact">É o contato de emergência</Label>
				</div>
				<div className="flex flex-col items-center justify-center">
					<Button type="submit" className="mt-4">
						Cadastrar
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CaregiverRegistration;