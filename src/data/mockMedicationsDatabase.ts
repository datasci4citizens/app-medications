// src/data/mockMedicationsDatabase.ts

export interface MedicationInfo {
   id: string;
   name: string;
   activeIngredient: string;
   type: 'Comprimido' | 'Cápsula' | 'Ampola' | 'Líquido' | 'Injeção';
   commonBrands?: string[];
}


export const medicationsDatabase: MedicationInfo[] = [
  {
    id: '1',
    name: 'Buscopan',
    activeIngredient: 'butilbrometo de escopolamina',
    type: 'Ampola',
    commonBrands: ['Ache', 'Hyoscine'],
  },
  {
    id: '2',
    name: 'Dipirona',
    activeIngredient: 'metamizol sódico',
    type: 'Líquido',
    commonBrands: ['Novalgina', 'Medley'],
  },
  {
    id: '3',
    name: 'Paracetamol',
    activeIngredient: 'acetaminofeno',
    type: 'Comprimido',
    commonBrands: ['Tylenol', 'EMS'],
  },
  {
    id: '4',
    name: 'Amoxicilina',
    activeIngredient: 'amoxicilina tri-hidratada',
    type: 'Cápsula',
    commonBrands: ['Amoxil', 'Eurofarma'],
  },
  {
    id: '5',
    name: 'Losartana',
    activeIngredient: 'losartana potássica',
    type: 'Comprimido',
    commonBrands: ['Aradois', 'Neo Química'],
  },
  {
    id: '6',
    name: 'Omeprazol',
    activeIngredient: 'omeprazol',
    type: 'Cápsula',
    commonBrands: ['Losec', 'Prati-Donaduzzi'],
  },
  {
    id: '7',
    name: 'Simeticona',
    activeIngredient: 'simeticona',
    type: 'Líquido',
    commonBrands: ['Luftal', 'Cimed'],
  },
  {
    id: '8',
    name: 'Ibuprofeno',
    activeIngredient: 'ibuprofeno',
    type: 'Comprimido',
    commonBrands: ['Advil', 'Alivium'],
  },
  {
    id: '9',
    name: 'Insulina NPH',
    activeIngredient: 'insulina humana',
    type: 'Injeção',
    commonBrands: ['Novo Nordisk', 'Eli Lilly'],
  },
  {
    id: '10',
    name: 'Vitamina C',
    activeIngredient: 'ácido ascórbico',
    type: 'Comprimido',
    commonBrands: ['Cebion', 'Redoxon'],
  },
  // teste de outro composto ativo
  {
    id: '11',
    name: 'Tylenol',
    activeIngredient: 'acetaminofeno',
    type: 'Comprimido',
    commonBrands: ['Kenvue'],
  },
  {
    id: '12',
    name: 'Advil',
    activeIngredient: 'ibuprofeno',
    type: 'Cápsula',
    commonBrands: ['Haleon'],
  },
  {
    id: '13',
    name: 'Novalgina',
    activeIngredient: 'metamizol sódico',
    type: 'Comprimido',
    commonBrands: ['Sanofi'],
  },
];

// Sistema de Busca ficticio (tem que arrumar com o backend depois)

/**
 * Busca medicamentos por nome ou princípio ativo
 * @param query - Texto digitado pelo usuário
 * @returns Lista de medicamentos que combinam
 */

export function searchMedication(query: string) : MedicationInfo[] {
   
   if(!query || query.trim().length == 0) {
      return [];
   }

   const searchTerm = query.toLowerCase().trim();

   return medicationsDatabase.filter((med) => {
      const nameMatch = med.name.toLowerCase().includes(searchTerm);
      const ingredientMatch = med.activeIngredient.toLowerCase().includes(searchTerm);
      return nameMatch || ingredientMatch;
   })
}
