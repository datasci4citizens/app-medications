import type { Medication } from '../types';

export const mockMedication: Medication[] = [
  {
    id: '1',
    name: 'Losartana',
    brand: 'EMS',
    dosage: '50mg',
    time: '08:00',
    scheduledDate: '2026-02-09', // Hoje
    type: 'tablet',
    taken: false,
    status: 'pending',
  },
  {
    id: '2',
    name: 'Dipirona',
    brand: 'Medley',
    dosage: '1g',
    time: '14:00',
    scheduledDate: '2026-02-09', // Hoje
    type: 'liquid',
    taken: false,
    status: 'pending',
  },
  {
    id: '3',
    name: 'Quetiapina',
    brand: 'Ache',
    dosage: '25mg',
    time: '20:00',
    scheduledDate: '2026-02-09', // Hoje
    type: 'tablet',
    taken: false,
    status: 'pending',
  },
  {
    id: '4',
    name: 'Vitamina D',
    brand: 'Addera',
    dosage: '2000UI',
    time: '09:00',
    scheduledDate: '2026-02-10', // Amanhã
    type: 'capsule',
    taken: false,
    status: 'pending',
  },
  {
    id: '5',
    name: 'Omeprazol',
    brand: 'Genérico',
    dosage: '20mg',
    time: '07:30',
    scheduledDate: '2026-02-08', // Ontem
    type: 'capsule',
    taken: true,
    status: 'taken',
  },
];
