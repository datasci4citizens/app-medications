import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import DatePicker from "@/components/DatePicker.tsx";
import { isAfter, isBefore } from "date-fns";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

interface FormValues {
    medication: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    dosage: string;
    frequency: string;
    quantity: string;
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
        },
    });

    const onSubmit = (data: FormValues) => {
        console.log(data);
        // Handle form submission
    };

    return (
        <div className="flex flex-col w-full h-full items-center">
            <div className="text-black text-2xl font-semibold leading-loose">Adicionar medicamento</div>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 max-h-screen w-full mx-auto p-8 space-y-6 overflow-y-auto">
                    <FormField
                        control={form.control}
                        name="medication"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Medicamento</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o medicamento"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="med1">Medicamento 1</SelectItem>
                                        <SelectItem value="med2">Medicamento 2</SelectItem>
                                        <SelectItem value="med3">Medicamento 3</SelectItem>
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
                                            if (isBefore(date, new Date("1900-01-01"))) return true;
                                            return !!(startDate && isBefore(date, startDate));
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name={"dosage"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Dosagem</FormLabel>
                                <div className="flex items-center space-x-2">
                                    <FormControl>
                                        <Input
                                            placeholder="Dosagem"
                                            {...field}
                                            value={field.value as string}
                                        />
                                    </FormControl>
                                    <span className="text-black text-base font-medium">Unidade</span>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={"frequency"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Dosagem</FormLabel>
                                <div className="flex items-center space-x-2">
                                    <FormControl>
                                        <Input
                                            placeholder="Frequência"
                                            {...field}
                                            value={field.value as string}
                                        />
                                    </FormControl>
                                    <span className="text-black text-base font-medium">Unidade</span>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={"quantity"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Quantidade</FormLabel>
                                <div className="flex items-center space-x-2">
                                    <FormControl>
                                        <Input
                                            placeholder="Quantidade"
                                            {...field}
                                            value={field.value as string}
                                        />
                                    </FormControl>
                                    <span className="text-black text-base font-medium">Unidade</span>
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-sky-900">
                        Adicionar
                    </Button>
                </form>
            </Form>
        </div>
    );
};