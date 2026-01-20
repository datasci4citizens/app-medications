export interface Medication {
   id: string;
   name: string;
   brand?: string; // "?" Opcional
   dosage: string;
   time: string;
   scheduledDate: string;
   type: 'capsule' | 'liquid' | 'injection' | 'tablet'; 
   taken: boolean,
   status?: 'pending' | 'taken' | 'skipped';
}