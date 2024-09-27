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

const CaregiverRegistration = () => {
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
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Cadastro cuidador(a)</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<Label htmlFor="name">Nome</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div>
					<Label htmlFor="phone">Telefone</Label>
					<Input
						id="phone"
						type="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						required
					/>
				</div>
				<div>
					<Label htmlFor="birthdate">Data de nascimento</Label>
					<Input
						id="birthdate"
						type="date"
						value={birthdate}
						onChange={(e) => setBirthdate(e.target.value)}
						required
					/>
				</div>
                <div className="flex items-center space-x-2">
					<Switch id="emergencyContact" checked={emergencyContact} onCheckedChange={setEmergencyContact} />
					<Label htmlFor="emergencyContact">É o contato de emergência</Label>
				</div>
                <div className="flex flex-col items-center justify-center">
					<Button className="mt-8">
						Não tenho cuidador(a)
					</Button>
					<Button type="submit" className="mt-4">
						Cadastrar
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CaregiverRegistration;