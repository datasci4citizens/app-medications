export type ScheduleType = 'fixed' | 'interval';

export type DoseStatus = 'upcoming' | 'pending' | 'late' | 'taken' | 'taken_late' | 'skipped';

export interface DoseRecord {
  status: DoseStatus;
  takenAt?: string; // ISO timestamp
}

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=dom, 6=sab (convenção JS Date.getDay)

export interface Medication {
  id: string;

  // Basic Info
  name: string;
  brand?: string;
  dosage: string;
  type: 'capsule' | 'liquid' | 'injection' | 'tablet';
  medicationInfoId?: string;

  // Treatment Period
  startDate: string;
  endDate?: string;

  // Scheduling
  scheduleType: ScheduleType;
  weekDays: WeekDay[];  // [0,1,2,3,4,5,6] = todo dia

  // Schedules (depends on scheduleType)
  times?: string[];         // if fixed: ['08:00', '20:00']
  startTime?: string;       // if interval: '08:00'
  intervalHours?: number;   // if interval: 8

  // DoseStatus
  doseStatus: Record<string, DoseRecord>; // chave: 'medId-YYYY-MM-DD-HH:mm'

  /** Id do tratamento no servidor. Ausente = ainda só existe neste aparelho. */
  remoteId?: number;

  // Stock (optional)
  currentStock?: number;
  stockReminderEnabled?: boolean;
  stockReminderThreshold?: number;
}

export interface MedicationInfo {
  id: string;
  name: string;
  activeIngredient: string;
  type: 'Comprimido' | 'Cápsula' | 'Ampola' | 'Líquido' | 'Injeção';
  commonBrands?: string[];
  whenToTake?: 'Antes da Refeição' | 'Após Refeição' | 'Com Refeição' | 'Independente';
  canSplit?: boolean;
  instructions?: string;
  sideEffects?: string;
  contraindications?: string;
}

// AuthContext Types

export interface User {
   id: string;
   name: string;
   email: string;
}

export interface AuthContextType {
   user: User | null;
   token: string | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   login: (userData: User, authToken: string) => void;
   loginWithGoogle: () => Promise<void>;
   logout: () => void;
}

