// import { useState, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { useNavigate } from 'react-router-dom';
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import axios from 'axios';
// import z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';

// const PatientRegistration = () => {
// 	const [user, setUser] = useState([]);
// 	const [profile, setProfile] = useState([]);
// 	const navigate = useNavigate();

// 	const [name, setName] = useState('');
// 	const [phoneNumber, setPhoneNumber] = useState('');
// 	const [birthdate, setBirthdate] = useState('');
// 	const [educationLevel, setEducationLevel] = useState('');
// 	const [gender, setGender] = useState('');
// 	const [location, setLocation] = useState('');
// 	const [healthProblems, setHealthProblems] = useState('');

// 	const educationLevels = [
// 		{ value: 'educationLevel1', label: 'Sem escolaridade' },
// 		{ value: 'educationLevel2', label: 'Educação Infantil' },
// 		{ value: 'educationLevel3', label: 'Ensino Fundamental Completo' },
// 		{ value: 'educationLevel4', label: 'Ensino Fundamental Incompleto' },
// 		{ value: 'educationLevel5', label: 'Ensino Médio Completo' },
// 		{ value: 'educationLevel6', label: 'Ensino Médio Incompleto' },
// 		{ value: 'educationLevel7', label: 'Ensino Superior Completo' },
// 		{ value: 'educationLevel8', label: 'Ensino Superior Incompleto' },
// 		{ value: 'educationLevel9', label: 'Pós-graduação (Especialização)' },
// 		{ value: 'educationLevel10', label: 'Mestrado' },
// 		{ value: 'educationLevel11', label: 'Doutorado' },
// 	];

// 	const genders = [
// 		{ value: 'gender1', label: 'Masculino' },
// 		{ value: 'gender2', label: 'Feminino' },
// 		{ value: 'gender3', label: 'Não-binário' },
// 		{ value: 'gender4', label: 'Transgênero' },
// 		{ value: 'gender5', label: 'Gênero Fluido' },
// 		{ value: 'gender6', label: 'Outro' },
// 		{ value: 'gender7', label: 'Prefiro não dizer' },
// 	];

// 	// const formSchema = z.object({
// 	// 	name: z.string().min(2, {
// 	// 		message: 'Nome muito pequeno.',
// 	// 	}),
// 	// 	phoneNumber: z.string().min(7, {
// 	// 		message: 'O telefone deve ter no mínimo 7 dígitos.',
// 	// 	}),
// 	// 	birthdate: z.date(),
// 	// 	educationLevel: z.enum(Object.values(educationLevels)),
// 	// 	genders: z.enum(Object.values(genders)),
// 	// 	state: z.string().min(2, {
// 	// 		message: 'Estado deve ter pelo menos duas letras.',
// 	// 	}),
// 	// 	city: z.string().min(2, {
// 	// 		message: 'Cidade deve ter pelo menos duas letras.',
// 	// 	}),
// 	// 	neighborhood: z.string().min(2, {
// 	// 		message: 'Estado deve ter pelo menos duas letras.',
// 	// 	}),
// 	// 	healthProblems: z.string().min(2, {
// 	// 		message: 'Estado deve ter pelo menos duas letras.',
// 	// 	})
// 	// });

// 	// const form = useForm<z.infer<typeof formSchema>>({resolver: zodResolver(formSchema)});

// 	// async function onSubmit(values: z.infer<typeof formSchema>) {
// 	// 	console.log('=== new values ===')
// 	// 	console.log(values)
// 	// 	const result = await trigger(values) 
// 	// 	console.log('=== result ===')
// 	// 	console.log(result)
// 	// }

// 	const handleSubmit = (e) => {
// 		// e.preventDefault();
// 		// Handle form submission here
// 		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
// 		console.log({
// 			name,
// 			phoneNumber,
// 			birthdate,
// 			educationLevel,
// 			gender,
// 			location,
// 			healthProblems,
// 		});

// 		navigate("/registro-contato-de-emergencia");
// 	};

// 	useEffect(() => {
// 		if (user) {
// 			axios
// 				.get(
// 					`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
// 					{
// 						headers: {
// 							Authorization: `Bearer ${user.access_token}`,
// 							Accept: 'application/json',
// 						},
// 					},
// 				)
// 				.then((res) => {
// 					setProfile(res.data);
// 				})
// 				.catch((err) => console.log(err));
// 		}
// 	}, [user]);	
	
// 	return (
// 		<div className="container mx-auto h-screen p-16">
// 			<h1 className="mb-6 font-bold text-2xl">Cadastro paciente</h1>
// 			<form
// 				onSubmit={handleSubmit}
// 				className="h-[80vh] space-y-8 overflow-auto"
// 			>
// 				<div>
// 					<Label htmlFor="name">Nome</Label>
// 					<Input
// 						id="name"
// 						placeholder="Nome"
// 						value={name}
// 						onChange={(e) => setName(e.target.value)}
// 					/>
// 				</div>
// 				<div>
// 					<Label htmlFor="phoneNumber">Telefone</Label>
// 					<Input
// 						id="phoneNumber"
// 						placeholder="(00) 00000-0000"
// 						type="tel"
// 						value={phoneNumber}
// 						onChange={(e) => setPhoneNumber(e.target.value)}
// 					/>
// 				</div>
// 				<div>
// 					<Label htmlFor="birthdate">Data de nascimento</Label>
// 					<Input
// 						id="birthdate"
// 						type="date"
// 						value={birthdate}
// 						onChange={(e) => setBirthdate(e.target.value)}
// 					/>
// 				</div>
// 				<div>
// 					<Label htmlFor="educationLevel">Escolaridade</Label>
// 					<Select value={educationLevel} onValueChange={setEducationLevel}>
// 						<SelectTrigger>
// 							<SelectValue placeholder="Selecione seu nível de escolaridade" />
// 						</SelectTrigger>
// 						<SelectContent>
// 							{educationLevels.map(({ value, label }) => (
// 								<SelectItem key={value} value={value}>
// 									{label}
// 								</SelectItem>
// 							))}
// 						</SelectContent>
// 					</Select>
// 				</div>
// 				<div>
// 					<Label htmlFor="gender">Gênero</Label>
// 					<Select value={gender} onValueChange={setGender}>
// 						<SelectTrigger>
// 							<SelectValue placeholder="Selecione seu gênero" />
// 						</SelectTrigger>
// 						<SelectContent>
// 							{genders.map(({ value, label }) => (
// 								<SelectItem key={value} value={value}>
// 									{label}
// 								</SelectItem>
// 							))}
// 						</SelectContent>
// 					</Select>
// 				</div>
// 				<div>
// 					<Label htmlFor="state">Estado</Label>
// 					<Input
// 						id="state"
// 						placeholder="Digite seu Estado"
// 						onChange={(e) => setName(e.target.value)}
// 					/>
// 				</div>
// 				<div>
// 					<Label htmlFor="city">Cidade</Label>
// 					<Input
// 						id="city"
// 						placeholder="Digite sua cidade"
// 						onChange={(e) => setName(e.target.value)}
// 					/>
// 				</div>
// 				<div>
// 					<Label htmlFor="neighborhood">Bairro</Label>
// 					<Input
// 						id="neighborhood"
// 						placeholder="Digite seu bairro"
// 						onChange={(e) => setName(e.target.value)}
// 					/>
// 				</div>
// 				<div>
// 					<Label htmlFor="healthProblems">Problemas de saúde</Label>
// 					<Textarea
// 						id="healthProblems"
// 						placeholder="Digite aqui"
// 						value={healthProblems}
// 						onChange={(e) => setHealthProblems(e.target.value)}
// 					/>
// 				</div>
// 				<div className="flex flex-col items-center justify-center">
// 					<Button type="submit" className="mt-8">
// 						Cadastrar
// 					</Button>
// 				</div>
// 			</form>
// 		</div>
// 	);
// };

// export default PatientRegistration;

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import DatePicker from "@/components/common/DatePicker.tsx";
import { isAfter, isBefore, startOfDay } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils.ts";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"

// Import the frequency data
import smokeFrequency from '@/localdata/smoke-frequency.json';
import drinkFrequency from '@/localdata/drink-frequency.json';

const FormSchema = z.object({
    name: z.string().min(1, "Campo obrigatório"),
    phone_number: z.string().optional(),
    sex: z.string().min(1, "Campo obrigatório"),
    email: z.string().min(1, "Campo obrigatório").email("Endereço de e-mail inválido"),
    birthday: z.date().nullable().refine(date => date !== null, {message: "Campo obrigatório"}),
    hospital_id:
        z.string().optional(),
    height:
        z.string().optional(),
    weight:
        z.string().optional(),
    comorbidities:
        z.array(z.string()).optional(), // Ensure this matches your data type
    other_comorbidities:
        z.array(z.string()).optional(), // Ensure this matches your data type
    smoker:
        z.string().optional(),
    drink_frequency:
        z.string().optional()
})

const educationLevels = [
	{ id: 'educationLevel_1', label: 'Sem escolaridade' },
	{ id: 'educationLevel_2', label: 'Educação Infantil' },
	{ id: 'educationLevel_3', label: 'Ensino Fundamental Completo' },
	{ id: 'educationLevel_4', label: 'Ensino Fundamental Incompleto' },
	{ id: 'educationLevel_5', label: 'Ensino Médio Completo' },
	{ id: 'educationLevel_6', label: 'Ensino Médio Incompleto' },
	{ id: 'educationLevel_7', label: 'Ensino Superior Completo' },
	{ id: 'educationLevel_8', label: 'Ensino Superior Incompleto' },
	{ id: 'educationLevel_9', label: 'Pós-graduação (Especialização)' },
	{ id: 'educationLevel_10', label: 'Mestrado' },
	{ id: 'educationLevel_11', label: 'Doutorado' },
];

const genders = [
	{ id: 'male', label: 'Masculino' },
	{ id: 'female', label: 'Feminino' },
	{ id: 'na', label: 'Prefiro não dizer' },
];

const comorbidities = [
    {id: "diabetes_1", label: "Diabete tipo 1"},
    {id: "high_blood_pressure", label: "Hipertensão"},
    {id: "diabetes_2", label: "Diabete tipo 2"},
    {id: "obesity", label: "Obesidade"},
    {id: "hyperlipoproteinemia", label: "Hiperlipoproteinemia"},
    {id: "avc", label: "AVC"},
] as const

const otherComorbiditiesInitialValue = [
    {id: "asthma", label: "Asma"},
    {id: "chronic_kidney_disease", label: "Doença renal crônica"},
    {id: "copd", label: "DPOC (Doença Pulmonar Obstrutiva Crônica)"},
    {id: "heart_failure", label: "Insuficiência cardíaca"},
    {id: "arthritis", label: "Artrite"},
];

const PatientRegistration = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            phone_number: "",
            sex: "",
            birthday: null,
            education_levels: [],
            other_comorbidities: [],
        },
    })

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        console.log(data);
        // Handle form submission
    };

    return (
        <div className="flex flex-col w-full h-full items-center">
            <div className="text-black text-2xl font-semibold leading-loose">Cadastro de paciente</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="flex-1 max-h-screen w-full mx-auto p-8 space-y-6 overflow-y-auto">
                    <PatientInfoFields form={form}/>
                    <Button type="submit" className="w-full bg-sky-900">
                        Cadastrar
                    </Button>
                </form>
            </Form>
        </div>
    );
};

function PatientInfoFields({form}) {
	const [educationLevel, setEducationLevel] = useState(educationLevels);
    const [selectedEducationLevel, setSelectedEducationLevel] = useState([]);
    const [educationLevelOpen, setEducationLevelOpen] = useState(false); // Local state for popover open/close

	const handleEducationLevelSelection = (educationLevel) => {
        if (!selectedEducationLevel.includes(educationLevel)) {
            setSelectedEducationLevel([...selectedEducationLevel, educationLevel]);
        }
    };

	const [otherComorbidities, setOtherComorbidities] = useState(otherComorbiditiesInitialValue);
    const [selectedComorbidity, setSelectedComorbidity] = useState([]);
    const [otherComorbitiesInputValue, setOtherComorbitiesInputValue] = useState("");
    const [otherComorbitiesOpen, setOtherComorbitiesOpen] = useState(false); // Local state for popover open/close

    const handleSelect = (comorbidity) => {
        if (!selectedComorbidity.includes(comorbidity)) {
            setSelectedComorbidity([...selectedComorbidity, comorbidity]);
        }
    };

    const handleRemove = (comorbidityToRemove) => {
        setSelectedComorbidity((prevSelected) =>
            prevSelected.filter((comorbidity) => comorbidity !== comorbidityToRemove)
        );
    };

    const handleAddComorbidity = () => {
        const newComorbidity = {
            id: otherComorbitiesInputValue.toLowerCase().replace(/\s+/g, "_"),
            label: otherComorbitiesInputValue,
        };

        setOtherComorbidities([...otherComorbidities, newComorbidity]);
        handleSelect(otherComorbitiesInputValue);
        setOtherComorbitiesInputValue(""); // Clear the input value after adding
    };

    return (
        <div className="space-y-6">
            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Nome*</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Nome"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="phone_number"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="(00) 00000-0000"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="birthday"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Data de nascimento*</FormLabel>
                        <DatePicker
                            field={field}
                            disabled={(date) => {
                                const today = startOfDay(new Date());
                                return (isBefore(date, new Date("1900-01-01")) || isAfter(date, today));
                                // isAfter(date, subYears(today, 18))
                            }}
                        />
                        <FormMessage/>
                    </FormItem>
                )}
            />

			<FormField
					control={form.control}
					name="education_levels"
					render={({field}) => (
						<FormItem className="flex flex-col">
							<FormLabel>Nível de escolaridade</FormLabel>
							<Popover open={educationLevelOpen}
									onOpenChange={setEducationLevelOpen}>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											type="button"
											variant="outline"
											role="combobox"
											className={cn(
												"justify-between",
												!field.value && "text-muted-foreground"
											)}
										>
											Selecione seu nível de escolaridade
											<ChevronDown
												className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-screen px-6 z-30" align="start">
									<Command>
										<CommandList>
											<CommandGroup>
												{educationLevel.map((educationLevel) => (
													<CommandItem
														value={educationLevel.label}
														key={educationLevel.id}
														onSelect={() => {
															const currentValues = form.getValues("education_levels") || [];
															const newValue = currentValues.includes(educationLevel.id)
																? currentValues.filter((id) => id !== educationLevel.id)
																: [...currentValues, educationLevel.id];

															form.setValue("education_levels", newValue);
															handleSelect(educationLevel.label);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																selectedEducationLevel.includes(educationLevel.label)
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														{educationLevel.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage/>
						</FormItem>
					)}
				/>

            <FormField
                control={form.control}
                name="state"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Digite seu Estado"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

			<FormField
                control={form.control}
                name="city"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Digite sua cidade"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

			<FormField
                control={form.control}
                name="neighborhood"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Digite seu bairro"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

			<div className="space-y-6">
				<FormField
					control={form.control}
					name="comorbities"
					render={() => (
						<FormItem>
							<div className="mb-4">
								<FormLabel>Comorbidades</FormLabel>
							</div>
							<div className="grid grid-cols-2 gap-2">
								{comorbidities.map((comorbidity) => (
									<FormField
										key={comorbidity.id}
										control={form.control}
										name="comorbidities"
										render={({field}) => {
											return (
												<FormItem
													key={comorbidity.id}
													className="flex flex-row items-start space-x-3 space-y-0"
												>
													<FormControl>
														<Checkbox
															checked={field.value?.includes(comorbidity.id)}
															onCheckedChange={(checked) => {
																return checked
																	? field.onChange([...field.value, comorbidity.id])
																	: field.onChange(
																		field.value?.filter(
																			(value) => value !== comorbidity.id
																		)
																	)
															}}
														/>
													</FormControl>
													<FormLabel className="font-normal">
														{comorbidity.label}
													</FormLabel>
												</FormItem>
											)
										}}
									/>
								))}
							</div>
							<FormMessage/>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="other_comorbidities"
					render={({field}) => (
						<FormItem className="flex flex-col">
							<FormLabel>Outras Comorbidades</FormLabel>
							<Popover open={otherComorbitiesOpen}
									onOpenChange={setOtherComorbitiesOpen}>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											type="button"
											variant="outline"
											role="combobox"
											className={cn(
												"justify-between",
												!field.value && "text-muted-foreground"
											)}
										>
											Selecione uma comorbidade
											<ChevronDown
												className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-screen px-6 z-30" align="start">
									<Command>
										<CommandInput
											placeholder="Procure comorbidades"
											value={otherComorbitiesInputValue}
											onValueChange={setOtherComorbitiesInputValue}
										/>
										<CommandList>
											<CommandEmpty>
												<Button
													type="button"
													variant="outline"
													size="icon"
													onClick={() => {
														handleAddComorbidity(otherComorbitiesInputValue)
													}}
													className="flex w-full items"
												>
													<Plus className="h-4 w-4"/>
													<span
														className="ms-2">Adicionar {otherComorbitiesInputValue}</span>
												</Button>
											</CommandEmpty>
											<CommandGroup>
												{otherComorbidities.map((comorbidity) => (
													<CommandItem
														value={comorbidity.label}
														key={comorbidity.id}
														onSelect={() => {
															const currentValues = form.getValues("other_comorbidities") || [];
															const newValue = currentValues.includes(comorbidity.id)
																? currentValues.filter((id) => id !== comorbidity.id)
																: [...currentValues, comorbidity.id];

															form.setValue("other_comorbidities", newValue);
															handleSelect(comorbidity.label);
															// setOpen(false)
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																selectedComorbidity.includes(comorbidity.label)
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														{comorbidity.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<div className="mt-2 flex flex-wrap gap-2">
								{selectedComorbidity.map((comorbidity) => (
									<Button
										type="button"
										onClick={() => {
											handleRemove(comorbidity)
										}}
										className="text-white h-6 rounded-full px-3 py-2 flex items-center space-x-2"
									>
										<span className="text-xs font-normal">{comorbidity}</span>
										<X className="h-4 w-4"/>
									</Button>
								))}
							</div>
							<FormMessage/>
						</FormItem>
					)}
				/>
			</div>


        </div>
    )
}

export default PatientRegistration;