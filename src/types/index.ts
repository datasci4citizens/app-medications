export interface Medication {
   id: string;
   name: string;
   dosage: string;
   time: string;
   type: 'capsule' | 'liquid' | 'injection' | 'tablet'; 
   taken: boolean
}