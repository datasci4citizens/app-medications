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
    const {data, trigger} = useSWRMutation<UserDrug[]>('http://localhost:8000/drugs/1/', getRequest);

    useEffect(() => {
        trigger();
    }, [trigger]);

    const medications: Medication[] = mapUserDrugToMedications(data);


    const [searchTerm, setSearchTerm] = useState('');

    const filteredMedications = medications.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full w-full items-center px-8">
            <div className="flex flex-col items-center w-full">
                <h1 className="text-2xl font-bold mb-4">Meus Medicamentos</h1>
                <div className="relative w-full mt-12">
                    <Input
                        type="text"
                        placeholder="Pesquise o medicamento"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={20}/>
                </div>
            </div>
            <div className="flex-1 w-full overflow-y-auto mt-6">
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