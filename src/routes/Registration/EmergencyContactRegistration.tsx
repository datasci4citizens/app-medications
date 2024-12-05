import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { getRequest, postRequest, putRequest } from "@/data/HttpExtensions.ts";
import useSWRMutation from "swr/mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fillForm } from "@/data/FormContextProvider";

export interface ContactPayload {
    name: string;
    phone_number?: string;
}

const EmergencyContactRegistration = () => {
	const navigate = useNavigate();
	const { formData, setFormData } = fillForm();

	const addCaregiver = (e) => {
		navigate("/registro-cuidador");
	};

	// Review route
	const {trigger: putTrigger} = useSWRMutation(`${import.meta.env.VITE_SERVER_URL}/user`, putRequest);

	const FormSchema = z.object({
		name: z.string().min(1, "Campo obrigatório"),
		phone_number: z.string().optional(),
	})

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
			name: "",
			phone_number: "",
        },
    })

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
			const registrationData = { 
                ...formData,
				emergency_contact_name: data.name,
				emergency_contact_number: data.phone_number,
            };

            console.log('Registration information:', JSON.stringify(registrationData));			
            await putTrigger(registrationData);
			navigate("/");
        } catch (error) {
            console.error('Error submitting form:', error);
            throw error;
        }
    };

	return (
		<div className='container mx-auto h-screen p-16'>
			<h1 className='mb-6 font-bold text-2xl'>Cadastro emergência</h1>

			<Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="flex-1 max-h-screen w-full mx-auto p-8 space-y-6 overflow-y-auto">
					<div className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({field}) => (
								<FormItem>
									<FormLabel>Nome do contato de emergência</FormLabel>
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
									<FormLabel>Telefone do contato de emergência</FormLabel>
									<FormControl>
										<Input {...field} placeholder="(00) 00000-0000"/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
					</div>

					<div className="flex flex-col items-center justify-center space-y-4">
						<Button type="submit" className="mt-4">Entrar</Button>
					</div>

                </form>
            </Form>
		</div>
	);
};

export default EmergencyContactRegistration;