import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { GoogleLogin } from '@react-oauth/google';

const EmergencyContactRegistration = () => {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [birthdate, setBirthdate] = useState('');
	const [emergencyContact, setEmergencyContact] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission here
		console.log({ name, phone, birthdate, comorbidities, drinks, smokes });
	};

	return (
		<div className="container mx-auto p-16  h-screen">
			<h1 className="text-2xl font-bold mb-6">Cadastro emergência</h1>
			<form
				onSubmit={handleSubmit}
				className="space-y-8 overflow-auto h-[80vh]"
			>
				<div>
					<Label htmlFor="name">Nome do contato de emergência</Label>
					<Input
						id="name"
						placeholder="Nome"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
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
						required
					/>
				</div>
				<div className="flex flex-col items-center justify-center space-y-4">
					<Button className="mt-4">Entrar</Button>
					<p>ou</p>
					<Button type="submit" className="mt-4">
						Adicionar cuidador(a)
					</Button>
				</div>
			</form>
		</div>
	);
};

export default EmergencyContactRegistration;