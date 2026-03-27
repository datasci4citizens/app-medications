// src/hooks/useMedications.ts

/**
 * Custom Hook: useMedications
 * 
 * 
 */

import { useContext } from 'react';
import { MedicationContext } from '../contexts/MedicationContext';

export function useMedications() {
  const context = useContext(MedicationContext);

  if (!context) {
    throw new Error('useMedications deve ser usado dentro de um MedicationProvider');
  }

  return context;
}