export interface Medication {
  id: string;
  name: string;
  brand?: string;
  dosage: string;
  time: string;
  scheduledDate: string;
  type: 'capsule' | 'liquid' | 'injection' | 'tablet';
  endDate?: string;
  taken: boolean;
  status?: 'pending' | 'taken' | 'skipped';
  medicationInfoId?: string;
}

export interface MedicationInfo {
  id: string;
  name: string;
  activeIngredient: string;
  type: 'Comprimido' | 'Cápsula' | 'Ampola' | 'Líquido' | 'Injeção';
  commonBrands?: string[];
  whenToTake?: 'Antes da Refeição' | 'Após Refeição' | 'Com Refeição' | 'Independente';
  canSplit?: boolean;
}