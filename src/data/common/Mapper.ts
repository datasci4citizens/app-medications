import type { Medication } from "@/components/common/MedicationItem.tsx";

export interface Drug {
    code: string
    comercial_name: string
    active_ingredients: ActiveIngredient[]
    presentations: Presentation[],
}

interface ActiveIngredient {
    id: number
    code: string
    active_ingredient: string
}

interface Presentation {
    id: number
    value: string
}

export function mapDrugsToMedications(data: Drug[] | undefined): Medication[] {
    return data?.flatMap((drug) =>
        drug.presentations.map((presentation) => ({
            id: `${drug.code}-${presentation.id}`,
            name: drug.comercial_name,
            dosageStrength: presentation.value,
        }))
    ) || [];
}

export interface UserDrug {
    id: number;
    start_date: string;
    end_date: string;
    observation: string;
    quantity: number;
    comercial_name: {
        id: number;
        comercial_name: string;
        active_principles: ActiveIngredient[];
    };
    presentation: Presentation;
}

export function mapUserDrugToMedications(data: UserDrug[] | undefined): Medication[] {
    return data?.map((item) => ({
        id: item.id.toString(),
        name: item.comercial_name.comercial_name,
        dosageStrength: item.presentation.value
    })) || [];
}