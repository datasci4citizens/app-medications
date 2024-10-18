import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const PatientRegistration = () => {
	const [user, setUser] = useState([]);
	const [profile, setProfile] = useState([]);
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [birthdate, setBirthdate] = useState('');
	const [educationLevel, setEducationLevel] = useState('');
	const [gender, setGender] = useState('');
	const [location, setLocation] = useState('');
	const [healthProblems, setHealthProblems] = useState('');

	const educationLevels = [
		{ value: 'educationLevel1', label: 'Sem escolaridade' },
		{ value: 'educationLevel2', label: 'Educação Infantil' },
		{ value: 'educationLevel3', label: 'Ensino Fundamental Completo' },
		{ value: 'educationLevel4', label: 'Ensino Fundamental Incompleto' },
		{ value: 'educationLevel5', label: 'Ensino Médio Completo' },
		{ value: 'educationLevel6', label: 'Ensino Médio Incompleto' },
		{ value: 'educationLevel7', label: 'Ensino Superior Completo' },
		{ value: 'educationLevel8', label: 'Ensino Superior Incompleto' },
		{ value: 'educationLevel9', label: 'Pós-graduação (Especialização)' },
		{ value: 'educationLevel10', label: 'Mestrado' },
		{ value: 'educationLevel11', label: 'Doutorado' },
	];

	const genders = [
		{ value: 'gender1', label: 'Masculino' },
		{ value: 'gender2', label: 'Feminino' },
		{ value: 'gender3', label: 'Não-binário' },
		{ value: 'gender4', label: 'Transgênero' },
		{ value: 'gender5', label: 'Gênero Fluido' },
		{ value: 'gender6', label: 'Outro' },
		{ value: 'gender7', label: 'Prefiro não dizer' },
	];

	// const formSchema = z.object({
	// 	name: z.string().min(2, {
	// 		message: 'Nome muito pequeno.',
	// 	}),
	// 	phoneNumber: z.string().min(7, {
	// 		message: 'O telefone deve ter no mínimo 7 dígitos.',
	// 	}),
	// 	birthdate: z.date(),
	// 	educationLevel: z.enum(Object.values(educationLevels)),
	// 	genders: z.enum(Object.values(genders)),
	// 	state: z.string().min(2, {
	// 		message: 'Estado deve ter pelo menos duas letras.',
	// 	}),
	// 	city: z.string().min(2, {
	// 		message: 'Cidade deve ter pelo menos duas letras.',
	// 	}),
	// 	neighborhood: z.string().min(2, {
	// 		message: 'Estado deve ter pelo menos duas letras.',
	// 	}),
	// 	healthProblems: z.string().min(2, {
	// 		message: 'Estado deve ter pelo menos duas letras.',
	// 	})
	// });

	// const form = useForm<z.infer<typeof formSchema>>({resolver: zodResolver(formSchema)});

	// async function onSubmit(values: z.infer<typeof formSchema>) {
	// 	console.log('=== new values ===')
	// 	console.log(values)
	// 	const result = await trigger(values) 
	// 	console.log('=== result ===')
	// 	console.log(result)
	// }

	const handleSubmit = (e) => {
		// e.preventDefault();
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

		navigate("/registro-contato-de-emergencia");
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
		<div className="container mx-auto h-screen p-16">
			<h1 className="mb-6 font-bold text-2xl">Cadastro paciente</h1>
			<form
				onSubmit={handleSubmit}
				className="h-[80vh] space-y-8 overflow-auto"
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
					<Label htmlFor="phoneNumber">Telefone</Label>
					<Input
						id="phoneNumber"
						placeholder="(00) 00000-0000"
						type="tel"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor="birthdate">Data de nascimento</Label>
					<Input
						id="birthdate"
						type="date"
						value={birthdate}
						onChange={(e) => setBirthdate(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor="educationLevel">Escolaridade</Label>
					<Select value={educationLevel} onValueChange={setEducationLevel}>
						<SelectTrigger>
							<SelectValue placeholder="Selecione seu nível de escolaridade" />
						</SelectTrigger>
						<SelectContent>
							{educationLevels.map(({ value, label }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label htmlFor="gender">Gênero</Label>
					<Select value={gender} onValueChange={setGender}>
						<SelectTrigger>
							<SelectValue placeholder="Selecione seu gênero" />
						</SelectTrigger>
						<SelectContent>
							{genders.map(({ value, label }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label htmlFor="state">Estado</Label>
					<Input
						id="state"
						placeholder="Digite seu Estado"
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor="city">Cidade</Label>
					<Input
						id="city"
						placeholder="Digite sua cidade"
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor="neighborhood">Bairro</Label>
					<Input
						id="neighborhood"
						placeholder="Digite seu bairro"
						onChange={(e) => setName(e.target.value)}
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
