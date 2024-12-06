import { useFieldArray, useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import DatePicker from "@/components/common/DatePicker.tsx";
import { isAfter, isBefore } from "date-fns";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import useSWRMutation from "swr/mutation";
import type { Drug } from "@/data/common/Mapper.ts";
import { mapDrugsToMedications } from "@/data/common/Mapper.ts";
import { getRequest, postRequest } from "@/data/common/HttpExtensions.ts";
import { useEffect, useState } from "react";
import type { Medication } from "@/components/common/MedicationItem.tsx";
import { Plus } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface FormValues {
    medication: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    dosage: string;
    frequency: string;
    quantity: string;
    selectedDays: string[];
    observations: string;
    times: { time: string }[];
}

interface MedicationPayload {
    comercial_name_id: number;
    presentation_id: number;
    start_date: string;
    end_date: string;
    observation: string;
    quantity: number;
    status: string;
}

export default function AddMedication() {
    const form = useForm<FormValues>({
        defaultValues: {
            medication: "",
            startDate: undefined,
            endDate: undefined,
            dosage: "",
            frequency: "",
            quantity: "",
            selectedDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            observations: "",
            times: []
        },
    });

    const [isMedicationSelected, setIsMedicationSelected] = useState(false);

    const {data, trigger} = useSWRMutation<Drug[]>(`${import.meta.env.VITE_SERVER_URL}/drugs/all`, getRequest);
    useEffect(() => {
        trigger();
    }, [trigger]);
    const medications: Medication[] = mapDrugsToMedications(data);

    const daysOfWeek = [
        {label: 'D', fullName: 'sunday', id: '0'},
        {label: 'S', fullName: 'monday', id: '1'},
        {label: 'T', fullName: 'tuesday', id: '2'},
        {label: 'Q', fullName: 'wednesday', id: '3'},
        {label: 'Q', fullName: 'thursday', id: '4'},
        {label: 'S', fullName: 'friday', id: '5'},
        {label: 'S', fullName: 'saturday', id: '6'}
    ];

    const {fields, append} = useFieldArray<FormValues>({
        control: form.control,
        name: "times",
    });

    const {trigger: postTrigger} = useSWRMutation(`${import.meta.env.VITE_SERVER_URL}/drugs`, postRequest);
    const {trigger: postScheculeTrigger} = useSWRMutation(`${import.meta.env.VITE_SERVER_URL}/schedule/schedule`, postRequest);

    const postSchedule = async (drugUseId: number, selectedDays: string[], times: { time: string }[]) => {
        try {
            const dayPromises = selectedDays.map(selectedDay => {
                const dayPayload = {
                    drug_use_id: drugUseId,
                    type: "D",
                    value: daysOfWeek.find(day => day.fullName === selectedDay)?.id,
                };
                return postScheculeTrigger(dayPayload);
            });

            const timePromises = times.map(time => {
                const timePayload = {
                    drug_use_id: drugUseId,
                    type: "H",
                    value: parseInt(time.time, 10) || 0,
                };
                return postScheculeTrigger(timePayload);
            });
            const results = await Promise.all([...dayPromises, ...timePromises]);

            console.log('All day and time data posted successfully:', results);
            return results;
        } catch (error) {
            console.error('Error posting day and time data:', error);
            throw error;
        }
    };

    const onSubmit = async (data: FormValues) => {
        try {
            const medication = medications.find(medication => medication.id === data.medication);
            if (!medication) {
                throw new Error('Medication not found');
            }

            const payload: MedicationPayload = {
                comercial_name_id: medication.comercialNameId || 0,
                presentation_id: medication.presentationId || 0,
                start_date: data.startDate ? data.startDate.toISOString() : "",
                end_date: data.endDate ? data.endDate.toISOString() : "",
                observation: data.observations || "",
                quantity: Math.max(parseInt(data.quantity, 10) || 1, 1),
                status: 'active',
            };

            console.log('Sending payload:', payload);
            const result = await postTrigger(payload);
            console.log('Result:', result);

            if (result && result.id) {
                await postSchedule(result.id, data.selectedDays, data.times);
            } else {
                throw new Error('No drug use ID returned');
            }

            return result;
        } catch (error) {
            console.error('Error submitting form:', error);
            throw error;
        }
    };

    return (
        <div className="flex flex-col w-full h-full items-center">
            <div className="text-black text-2xl font-semibold leading-loose">Adicionar medicamento</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="flex-1 max-h-screen w-full mx-auto p-8 space-y-6 overflow-y-auto">
                    <FormField
                        control={form.control}
                        name="medication"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Medicamento</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setIsMedicationSelected(!!value);
                                    }}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o medicamento"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {medications.map((medication, index) => (
                                            <SelectItem key={index} value={medication.id}>
                                                {medication.name} - {medication.dosageStrength}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <div className="w-full grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Data de início</FormLabel>
                                    <DatePicker
                                        field={field}
                                        onSelect={(date) => {
                                            field.onChange(date);
                                            const endDate = form.getValues("endDate");
                                            if (endDate && date && isAfter(date, endDate)) {
                                                form.setValue("endDate", undefined);
                                            }
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Data de término</FormLabel>
                                    <DatePicker
                                        field={field}
                                        onSelect={field.onChange}
                                        disabled={(date) => {
                                            const startDate = form.getValues("startDate");
                                            return !!(startDate && isBefore(date, startDate));
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="dosage"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Dosagem</FormLabel>
                                <div className="flex items-center space-x-2">
                                    <FormControl>
                                        <Input
                                            placeholder="Dosagem"
                                            {...field}
                                            value={field.value as string}
                                            disabled={!isMedicationSelected}
                                        />
                                    </FormControl>
                                    <span className="text-black text-base font-medium">Unidade</span>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="frequency"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Frequência</FormLabel>
                                <div className="flex items-center space-x-2">
                                    <FormControl>
                                        <Input
                                            placeholder="Frequência"
                                            {...field}
                                            value={field.value as string}
                                            disabled={!isMedicationSelected}
                                        />
                                    </FormControl>
                                    <span className="text-black text-base font-medium">Unidade</span>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Quantidade</FormLabel>
                                <div className="flex items-center space-x-2">
                                    <FormControl>
                                        <Input
                                            placeholder="Quantidade"
                                            {...field}
                                            value={field.value as string}
                                            disabled={!isMedicationSelected}
                                        />
                                    </FormControl>
                                    <span className="text-black text-base font-medium">Unidade</span>
                                </div>
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="selectedDays"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Dias da semana</FormLabel>
                                <FormControl>
                                    <ToggleGroup
                                        type="multiple"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={!isMedicationSelected}
                                        className="flex gap-2"
                                    >
                                        {daysOfWeek.map((day, index) => (
                                            <ToggleGroupItem
                                                key={index}
                                                value={day.fullName} // Use full name to identify the day
                                                className="w-10 h-10 rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                            >
                                                {day.label}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="observations"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Observações do médico</FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={!isMedicationSelected}
                                        placeholder="Observações"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4 inline-flex flex-col items-start">
                        <div>
                            <FormLabel>Horários</FormLabel>
                        </div>
                        {fields.map((field, index) => (
                            <FormField
                                key={field.id}
                                control={form.control}
                                name={`times.${index}.time`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Horário</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={!isMedicationSelected}
                                                type="time"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        ))}

                        <Button
                            type="button"
                            variant="ghost"
                            className="flex items-center justify-start p-0"
                            disabled={!isMedicationSelected}
                            onClick={() => append({time: ""})}
                        >
                            <div
                                className={`border border-gray-300 rounded items-center justify-center mr-2`}>
                                <Plus className="text-black p-2" size={32}/>
                            </div>
                            Adicionar horário
                        </Button>
                    </div>

                    <Button type="submit" className="w-full bg-sky-900" disabled={!isMedicationSelected}>
                        Adicionar
                    </Button>
                </form>
            </Form>
        </div>
    );
}