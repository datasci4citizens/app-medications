import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState } from "react";
import type { Medication } from "@/components/common/MedicationItem.tsx";
import MedicationItem from "@/components/common/MedicationItem.tsx";
import useSWRMutation from "swr/mutation";
import type { UserDrug } from "@/data/common/Mapper.ts";
import { mapUserDrugToMedications } from "@/data/common/Mapper.ts";
import { getRequest } from "@/data/common/HttpExtensions.ts";


export default function Profile() {
    const {data, trigger} = useSWRMutation<UserDrug[]>(`${import.meta.env.VITE_SERVER_URL}/drugs/1/`, getRequest);

    useEffect(() => {
        trigger();
    }, [trigger]);

    const medications: Medication[] = mapUserDrugToMedications(data);


    const [searchTerm, setSearchTerm] = useState('');

    const filteredMedications = medications.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='flex h-full w-full flex-col items-center px-8'>
            <div className='flex w-full flex-col items-center'>
                <h1 className='mb-4 font-bold text-2xl'>Meus Medicamentos</h1>
                <div className='relative mt-12 w-full'>
                    <Input
                        type="text"
                        placeholder="Pesquise o medicamento"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                    />
                    <Search className='absolute top-2.5 right-3 text-gray-400' size={20}/>
                </div>
            </div>
            <div className='mt-6 w-full flex-1 overflow-y-auto'>
                {filteredMedications.map((medication, index) => (
                    <MedicationItem key={index} id={medication.id}
                                    name={medication.name}
                                    dosageStrength={medication.dosageStrength}
                                    adultDosage={medication.adultDosage}
                                    onEdit={() => console.log(`onEdit item with id: ${medication.id}`)}
                                    onDelete={() => console.log(`onDelete item with id: ${medication.id}`)}/>
                ))}
            </div>

        </div>
    );
};