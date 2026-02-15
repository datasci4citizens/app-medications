// src/contexts/MedicationContext.tsx

import { createContext, useEffect, useState } from 'react';
import type { Medication } from '../types';
import { medicationStorage } from '../utils/storage';
import { mockMedication } from '../data/mockMedication';

// ============================================
// TIPOS
// ============================================

interface MedicationContextType {
  medications: Medication[];
  isLoading: boolean;
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  markAsTaken: (id: string) => void;
  markAsSkipped: (id: string) => void;
  getMedicationById: (id: string) => Medication | undefined;
  getMedicationsByDate: (date: Date) => Medication[];
}

// ============================================
// CONTEXT
// ============================================

export const MedicationContext = createContext<MedicationContextType>({} as MedicationContextType);

// ============================================
// PROVIDER
// ============================================

export function MedicationProvider({ children }: { children: React.ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================
  // CARREGAR MEDICAMENTOS DO LOCALSTORAGE
  // ============================================
  useEffect(() => {
    const loadMedications = () => {
      try {
        const saved = medicationStorage.getMedications<Medication>();
        
        if (saved && saved.length > 0) {
          setMedications(saved);
        } else {
          // Se não tem nada salvo, usa dados mock
          setMedications(mockMedication);
          medicationStorage.saveMedications(mockMedication);
        }
      } catch (error) {
        console.error('Erro ao carregar medicamentos:', error);
        setMedications(mockMedication);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedications();
  }, []);

  // ============================================
  // SALVAR NO LOCALSTORAGE QUANDO MUDAR
  // ============================================
  useEffect(() => {
    if (!isLoading) {
      medicationStorage.saveMedications(medications);
    }
  }, [medications, isLoading]);

  // ============================================
  // FUNÇÕES DE MANIPULAÇÃO
  // ============================================

  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString(),
      taken: false,
      status: 'pending',
    };

    setMedications((prev) => [...prev, newMedication]);
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updates } : med))
    );
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  const markAsTaken = (id: string) => {
    updateMedication(id, {
      status: 'taken',
      taken: true,
    });
  };

  const markAsSkipped = (id: string) => {
    updateMedication(id, {
      status: 'skipped',
      taken: false,
    });
  };

  const getMedicationById = (id: string): Medication | undefined => {
    return medications.find((med) => med.id === id);
  };

  const getMedicationsByDate = (date: Date): Medication[] => {
    return medications.filter((med) => {
      if (!med.scheduledDate) return true; // Mostra se não tem data
      
      const medDate = new Date(med.scheduledDate);
      return (
        medDate.getFullYear() === date.getFullYear() &&
        medDate.getMonth() === date.getMonth() &&
        medDate.getDate() === date.getDate()
      );
    });
  };

  // ============================================
  // VALOR DO CONTEXTO
  // ============================================

  const value: MedicationContextType = {
    medications,
    isLoading,
    addMedication,
    updateMedication,
    deleteMedication,
    markAsTaken,
    markAsSkipped,
    getMedicationById,
    getMedicationsByDate,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando medicamentos...</p>
        </div>
      </div>
    );
  }

  return <MedicationContext.Provider value={value}>{children}</MedicationContext.Provider>;
}