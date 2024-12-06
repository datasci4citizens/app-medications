import React, { useState, useEffect } from 'react';
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
import { getRequest, postRequest } from "@/data/HttpExtensions.ts";
import useSWRMutation from "swr/mutation";
import { useNavigate } from "react-router-dom";
import { fillForm } from "@/data/FormContextProvider";

// Local Data
import educationLevel from "@/localdata/education-level.json";
import genders from "@/localdata/genders.json";

const FormSchema = z.object({
    name: z.string().min(1, "Campo obrigatório"),
    phone_number: z.string().optional(),
    email: z.string().optional(),
	birthday: z.date().nullable().refine(date => date !== null, {message: "Campo obrigatório"}),
	education_level: z.string().min(1, "Campo obrigatório"),
    gender: z.string().min(1, "Campo obrigatório"),
	state: z.string().optional(),
	city: z.string().optional(),
	district: z.string().optional(),
    comorbidities:
        z.array(z.string()).optional(), // Ensure this matches your data type
    other_comorbidities:
        z.array(z.string()).optional(), // Ensure this matches your data type
})

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
	// Review route
	const {trigger: postTrigger} = useSWRMutation(`${import.meta.env.VITE_SERVER_URL}/create_user`, postRequest);
    const { formData, setFormData } = fillForm();

	const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
			name: "",
			phone_number: "",
            email: "",
			birthday: undefined,
			education_level: "",
			gender: "",
			state: "",
			city: "",
			district: "",
			comorbidities: [],
			comorbidities_to_add: [],
        },
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {

            // const userEmail: string = jwt !== undefined ? jwtDecode<JwtPayload>(jwt).email : "";

            setFormData({ 
                ...formData,
                name: data.name,
                email: data.email,
                birth_date: data.birthday ? data.birthday.toISOString().split('T')[0] : "",
                phone_number: data.phone_number,
                scholarship: data.education_level,
                accept_tcle: true,
                gender: data.gender,
                sex: data.gender,
                is_caretaker: false,
                state: data.state,
                city: data.city,
                district: data.district,
            });

            console.log("Filled informations: ", formData);

            return navigate("/registro-contato-de-emergencia")
        } catch (error) {
            console.error('Error submitting form:', error);
            throw error;
        }
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
                        <FormLabel>Telefone*</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="(00) 00000-0000"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>E-mail*</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="E-mail"/>
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
                name="education_level"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Nível de escolaridade*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione seu nível de escolaridade"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.entries(educationLevel).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}
            />

			<FormField
                control={form.control}
                name="gender"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Sexo*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione seu gênero"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.entries(genders).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                name="district"
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
										className='flex h-6 items-center space-x-2 rounded-full px-3 py-2 text-white'
									>
										<span className='font-normal text-xs'>{comorbidity}</span>
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