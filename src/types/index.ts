export interface Medication {
  id: string;
  name: string;
  brand?: string;
  dosage: string;
  time: string; // Horário da primeira dose
  scheduledDate: string; // Data de início (ISO YYYY-MM-DD)
  type: 'capsule' | 'liquid' | 'injection' | 'tablet';
  endDate?: string; // Data de fim (ISO YYYY-MM-DD)
  taken: boolean;
  status?: 'pending' | 'taken' | 'skipped';
  medicationInfoId?: string;
  dosageInterval?: number;
  doseStatus?: Record<string, 'pending' | 'taken' | 'skipped'>; // Chave: "YYYY-MM-DD HH:mm"
}

export interface MedicationInfo {
  id: string;
  name: string;
  activeIngredient: string;
  type: 'Comprimido' | 'Cápsula' | 'Ampola' | 'Líquido' | 'Injeção';
  commonBrands?: string[];
  whenToTake?: 'Antes da Refeição' | 'Após Refeição' | 'Com Refeição' | 'Independente';
  canSplit?: boolean;
  dosageInterval?: number;
}