import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const PatientRegistration = () => {
	const [user, setUser] = useState([]);
	const [profile, setProfile] = useState([]);

	const [name, setName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [birthdate, setBirthdate] = useState('');
	const [educationLevel, setEducationLevel] = useState('');
	const [gender, setGender] = useState('');
	const [location, setLocation] = useState('');
	const [healthProblems, setHealthProblems] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission here
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
				console.log({
			name,
			phoneNumber,
			birthdate,
			educationLevel,
			gender,
			location,
			healthProblems,
		});
	};

	useEffect(() => {
		if (user) {
			axios
				.get(
					`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
					{
						headers: {
							Authorization: `Bearer ${user.access_token}`,
							Accept: 'application/json',
						},
					},
				)
				.then((res) => {
					setProfile(res.data);
				})
				.catch((err) => console.log(err));
		}
	}, [user]);

	return (
		<div className='container mx-auto h-screen p-16'>
			<h1 className='mb-6 font-bold text-2xl'>Cadastro paciente</h1>
			<form
				onSubmit={handleSubmit}
				className='h-[80vh] space-y-8 overflow-auto'
			>
				<div>
					<Label htmlFor="name">Nome</Label>
					<Input
						id="name"
						placeholder="Nome"
						value={profile.name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div>
					<Label htmlFor="phoneNumber">Telefone</Label>
					<Input
						id="phoneNumber"
						placeholder="(00) 00000-0000"
						type="tel"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
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
				<div>
					<Label htmlFor="educationLevel">Escolaridade</Label>
					<Select value={educationLevel} onValueChange={setEducationLevel}>
						<SelectTrigger>
							<SelectValue placeholder="Selecione seu nível de escolaridade" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="educationLevel1">Sem escolaridade</SelectItem>
							<SelectItem value="educationLevel2">Educação Infantil</SelectItem>
							<SelectItem value="educationLevel3">
								Ensino Fundamental Completo
							</SelectItem>
							<SelectItem value="educationLevel4">
								Ensino Fundamental Incompleto
							</SelectItem>
							<SelectItem value="educationLevel5">
								Ensino Médio Completo
							</SelectItem>
							<SelectItem value="educationLevel6">
								Ensino Médio Incompleto
							</SelectItem>
							<SelectItem value="educationLevel7">
								Ensino Superior Completo
							</SelectItem>
							<SelectItem value="educationLevel8">
								Ensino Superior Incompleto
							</SelectItem>
							<SelectItem value="educationLevel9">
								Pós-graduação (Especialização)
							</SelectItem>
							<SelectItem value="educationLevel10">Mestrado</SelectItem>
							<SelectItem value="educationLevel11">Doutorado</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label htmlFor="gênder">Genero</Label>
					<Select value={gender} onValueChange={setGender}>
						<SelectTrigger>
							<SelectValue placeholder="Selecione seu gênero" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="gender1">Masculino</SelectItem>
							<SelectItem value="gender2">Feminino</SelectItem>
							<SelectItem value="gender3">Não-binário</SelectItem>
							<SelectItem value="gender4">Transgênero</SelectItem>
							<SelectItem value="gender5">Gênero Fluido</SelectItem>
							<SelectItem value="gender6">Outro</SelectItem>
							<SelectItem value="gender7">Prefiro não dizer</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label htmlFor="location">CEP/Localização</Label>
					<Input
						id="location"
						placeholder="Digite seu CEP"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						required
					/>
				</div>
				<div>
					<Label htmlFor="healthProblems">Problemas de saúde</Label>
					<Textarea
						id="healthProblems"
						placeholder="Digite aqui"
						value={healthProblems}
						onChange={(e) => setHealthProblems(e.target.value)}
					/>
				</div>
				<div className="flex flex-col items-center justify-center">
					<Button type="submit" className="mt-8">
						Cadastrar
					</Button>
				</div>
			</form>
		</div>
	);
};

export default PatientRegistration;
