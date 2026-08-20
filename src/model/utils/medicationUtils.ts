import type { MedicationInfo } from "../../types";
import { medicationsDatabase } from "../data/mockMedicationsDatabase";


const POPULAR_IDS = ['2', '3', '5', '6', '10'];


export function searchMedication(query: string, type: string = 'all'): MedicationInfo[] {
  const searchTerm = query.toLowerCase().trim();

  // Future use Real API

  return medicationsDatabase.filter((med) => {
    if (type !== 'all' && med.type !== type) {
      return false;
    }

    if (searchTerm.length === 0) {
      return true;
    }

    const nameMatch = med.name.toLowerCase().includes(searchTerm);
    const ingredientMatch = med.activeIngredient.toLowerCase().includes(searchTerm);
    const brandMatch = med.commonBrands?.some((brand) => brand.toLowerCase().includes(searchTerm)) ?? false;
    return nameMatch || ingredientMatch || brandMatch;
  });
}

export function getPopularMedications(): MedicationInfo[] {
  return medicationsDatabase.filter((med) => POPULAR_IDS.includes(med.id));
}

export function getMedicationInfoById(id: string | undefined): MedicationInfo | undefined {
  if (!id) return undefined;
  return medicationsDatabase.find((med) => med.id === id);
}
