import type { MedicationInfo } from "../../types";
import { medicationsDatabase } from "../data/mockMedicationsDatabase";



export function searchMedication(query: string): MedicationInfo[] {
  if (!query || query.trim().length == 0) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();

  // Future use Real API

  return medicationsDatabase.filter((med) => {
    const nameMatch = med.name.toLowerCase().includes(searchTerm);
    const ingredientMatch = med.activeIngredient.toLowerCase().includes(searchTerm);
    return nameMatch || ingredientMatch;
  });
}