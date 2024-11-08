import type { Medication } from "@/components/common/MedicationItem.tsx";

export interface Drug {
    id: number
    comercial_name: string
    active_ingredients: ActiveIngredient[]
    presentations: Presentation[],
}

interface ActiveIngredient {
    id: number
    code: string
    active_ingredient: string
}

export interface Presentation {
    id: number
    value: string
}

export function mapDrugsToMedications(data: Drug[] | undefined): Medication[] {
    return data?.flatMap((drug) =>
        drug.presentations.map((presentation) => ({
            id: `${drug.id}-${presentation.id}`,
            comercialNameId: drug.id,
            presentationId: presentation.id,
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
    return Array.isArray(data)
        ? data.flatMap((item) => ({
            id: item.id.toString(),
            name: item.comercial_name.comercial_name,
            dosageStrength: item.presentation.value,
        }))
        : [];
}