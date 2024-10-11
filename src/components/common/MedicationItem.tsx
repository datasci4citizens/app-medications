import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Check, Edit, Trash } from "lucide-react";

export interface Medication {
    id: string;
    name: string;
    dosageStrength?: string;
    adultDosage?: string;
    pediatric_dosage?: string;
    onCheck?: (isChecked: boolean) => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function MedicationItem({id, name, dosageStrength, adultDosage, onCheck, onEdit, onDelete}: Medication) {
    const [isChecked, setIsChecked] = useState(false)

    const handleCheck = () => {
        if (onCheck) {
            onCheck(!isChecked)
            setIsChecked(!isChecked);
        }
    };

    return (
        <Card className="mb-4 w-full shadow-sm border-b border-gray-200">
            <CardContent className="p-4 flex justify-between items-center">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
                    {dosageStrength && <p className="text-sm text-gray-500">Dosagem: {dosageStrength}</p>}
                    {adultDosage && <p className="text-sm text-gray-500">Quantidade: {adultDosage}</p>}
                </div>
                {onCheck &&
                    <div
                        className={`border border-gray-300 rounded flex items-center justify-center cursor-pointer  ${isChecked ? 'bg-blue-500' : 'bg-white'}`}
                        onClick={handleCheck}>
                        <Check className="text-black p-2" size={32}/>
                    </div>
                }
                {onEdit &&
                    <div

                        className={`border border-gray-300 rounded flex items-center justify-center cursor-pointer ms-1.5`}
                        onClick={() => onEdit?.()}>
                        <Edit className="text-black p-2" size={32}/>
                    </div>
                }
                {onDelete &&
                    <div
                        className={`border border-gray-300 rounded flex items-center justify-center cursor-pointer ms-1.5`}
                        onClick={() => onDelete?.()}>
                        <Trash className="text-black p-2" size={32}/>
                    </div>
                }
            </CardContent>
        </Card>
    )
}