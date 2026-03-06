import type { MedicationInfo } from "../types";

export const medicationsDatabase: MedicationInfo[] = [
  {
    id: '1',
    name: 'Buscopan',
    activeIngredient: 'butilbrometo de escopolamina',
    type: 'Ampola',
    commonBrands: ['Ache', 'Hyoscine'],
    whenToTake: 'Independente',
    canSplit: false,
    dosageInterval: 8,
  },
  {
    id: '2',
    name: 'Dipirona',
    activeIngredient: 'metamizol sódico',
    type: 'Líquido',
    commonBrands: ['Novalgina', 'Medley'],
    whenToTake: 'Independente',
    canSplit: false,
    dosageInterval: 6,
  },
  {
    id: '3',
    name: 'Paracetamol',
    activeIngredient: 'acetaminofeno',
    type: 'Comprimido',
    commonBrands: ['Tylenol', 'EMS'],
    whenToTake: 'Após Refeição',
    canSplit: true,
    dosageInterval: 6,
  },
  {
    id: '4',
    name: 'Amoxicilina',
    activeIngredient: 'amoxicilina tri-hidratada',
    type: 'Cápsula',
    commonBrands: ['Amoxil', 'Eurofarma'],
    whenToTake: 'Com Refeição',
    canSplit: false,
    dosageInterval: 8,
  },
  {
    id: '5',
    name: 'Losartana',
    activeIngredient: 'losartana potássica',
    type: 'Comprimido',
    commonBrands: ['Aradois', 'Neo Química'],
    whenToTake: 'Independente',
    canSplit: true,
    dosageInterval: 24,
  },
  {
    id: '6',
    name: 'Omeprazol',
    activeIngredient: 'omeprazol',
    type: 'Cápsula',
    commonBrands: ['Losec', 'Prati-Donaduzzi'],
    whenToTake: 'Antes da Refeição',
    canSplit: false,
    dosageInterval: 24,
  },
  {
    id: '7',
    name: 'Simeticona',
    activeIngredient: 'simeticona',
    type: 'Líquido',
    commonBrands: ['Luftal', 'Cimed'],
    whenToTake: 'Após Refeição',
    canSplit: false,
    dosageInterval: 6,
  },
  {
    id: '8',
    name: 'Ibuprofeno',
    activeIngredient: 'ibuprofeno',
    type: 'Comprimido',
    commonBrands: ['Advil', 'Alivium'],
    whenToTake: 'Com Refeição',
    canSplit: true,
    dosageInterval: 12,
  },
  {
    id: '9',
    name: 'Insulina NPH',
    activeIngredient: 'insulina humana',
    type: 'Injeção',
    commonBrands: ['Novo Nordisk', 'Eli Lilly'],
    whenToTake: 'Independente',
    canSplit: false,
    dosageInterval: 12,
  },
  {
    id: '10',
    name: 'Vitamina C',
    activeIngredient: 'ácido ascórbico',
    type: 'Comprimido',
    commonBrands: ['Cebion', 'Redoxon'],
    whenToTake: 'Com Refeição',
    canSplit: true,
    dosageInterval: 24,
  },
  {
    id: '11',
    name: 'Tylenol',
    activeIngredient: 'acetaminofeno',
    type: 'Comprimido',
    commonBrands: ['Kenvue'],
    whenToTake: 'Após Refeição',
    canSplit: true,
    dosageInterval: 6,
  },
  {
    id: '12',
    name: 'Advil',
    activeIngredient: 'ibuprofeno',
    type: 'Cápsula',
    commonBrands: ['Haleon'],
    whenToTake: 'Com Refeição',
    canSplit: false,
    dosageInterval: 12,
  },
  {
    id: '13',
    name: 'Novalgina',
    activeIngredient: 'metamizol sódico',
    type: 'Comprimido',
    commonBrands: ['Sanofi'],
    whenToTake: 'Independente',
    canSplit: true,
    dosageInterval: 6,
  },
];

export function searchMedication(query: string): MedicationInfo[] {
  if (!query || query.trim().length == 0) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();

  return medicationsDatabase.filter((med) => {
    const nameMatch = med.name.toLowerCase().includes(searchTerm);
    const ingredientMatch = med.activeIngredient.toLowerCase().includes(searchTerm);
    return nameMatch || ingredientMatch;
  });
}