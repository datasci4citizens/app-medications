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

const RegisterPage = () => {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [birthdate, setBirthdate] = useState('');
	const [comorbidities, setComorbidities] = useState('');
	const [drinks, setDrinks] = useState(false);
	const [smokes, setSmokes] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission here
		console.log({ name, phone, birthdate, comorbidities, drinks, smokes });
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Cadastro paciente</h1>
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
					<Label htmlFor="birthdate">Data de Nascimento</Label>
					<Input
						id="birthdate"
						type="date"
						value={birthdate}
						onChange={(e) => setBirthdate(e.target.value)}
						required
					/>
				</div>
				<div>
					<Label htmlFor="comorbidities">Comorbidades</Label>
					<Textarea
						id="comorbidities"
						value={comorbidities}
						onChange={(e) => setComorbidities(e.target.value)}
					/>
				</div>
				<div className="flex items-center space-x-2">
					<Switch id="drinks" checked={drinks} onCheckedChange={setDrinks} />
					<Label htmlFor="drinks">Bebe</Label>
				</div>
				<div>
					<Label htmlFor="smokes">Fuma</Label>
					<Select value={smokes} onValueChange={setSmokes}>
						<SelectTrigger>
							<SelectValue placeholder="Selecione uma opção" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="quantidade1">Quantidade 1</SelectItem>
							<SelectItem value="quantidade2">Quantidade 2</SelectItem>
							<SelectItem value="quantidade3">Quantidade 3</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Button type="submit" className="w-full">
					Cadastrar
				</Button>
			</form>
		</div>
	);
};

export default RegisterPage;