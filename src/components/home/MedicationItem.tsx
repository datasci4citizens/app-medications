import type { Medication, MedicationTime } from "@/data/medicationListFake.ts";
import { Check } from "lucide-react";

export function MedicationTimeGroup({time, medications}: MedicationTime) {
    return (
        <div className={"mb-16 w-full"}>
            <div className="text-black text-xl font-semibold mb-8 columns-1">{time}</div>
            {medications.map((med, index) => (
                <MedicationItem key={index} {...med} />
            ))}
        </div>
    );
}

function MedicationItem({name, dosageStrength, adultDosage}: Medication) {
    return (
        <div className="mb-4 p-3 w-full bg-white rounded-lg shadow-lg inline-flex justify-between items-start">
            <div className="flex-1">
                <div className="text-base font-semibold text-black mb-1">{name}</div>
                <div className="text-sm text-gray-500">Dosagem: {dosageStrength}</div>
                <div className="text-sm text-gray-500">Quantidade: {adultDosage}</div>
            </div>
            <div className="w-6 h-6 border border-gray-300 rounded-sm justify-center items-center">
                {<Check className="text-black"/>}
            </div>
        </div>
    );
}
