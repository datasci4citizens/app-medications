import type { Medication, MedicationTime } from "@/data/medicationListFake.ts";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { useState } from "react";

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
    const [isChecked, setIsChecked] = useState(false)

    return (
        <Card className="mb-4 w-full shadow-sm border-b border-gray-200">
            <CardContent className="p-4 flex justify-between items-center">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
                    <p className="text-sm text-gray-500">Dosagem: {dosageStrength}</p>
                    <p className="text-sm text-gray-500">Quantidade: {adultDosage}</p>
                </div>
                <div
                    className={`border border-gray-300 rounded flex items-center justify-center cursor-pointer  ${isChecked ? 'bg-blue-500' : 'bg-white'}`}
                    onClick={() => setIsChecked(!isChecked)}>
                    <Check className="text-black" size={32}/>
                </div>
            </CardContent>
        </Card>
    )
}