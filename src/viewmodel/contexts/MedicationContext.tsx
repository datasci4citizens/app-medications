import { createContext, useEffect, useState } from 'react';
import type { Medication } from '../../types';
import { medicationStorage } from '../../model/repositories/MedicationRepository'

// ============================================
// TIPOS
// ============================================

interface MedicationContextType {
  medications: Medication[];
  isLoading: boolean;
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  markDoseAsTaken: (medicationId: string, occurrenceId: string, wasLate: boolean, takenAt?: string) => void;
  markDoseAsSkipped: (medicationId: string, occurrenceId: string) => void;
  clearDoseStatus: (medicationId: string, occurrenceId: string) => void;
  updateDoseTakenAt: (medicationId: string, occurrenceId: string, takenAt: string) => void;
  getMedicationById: (id: string) => Medication | undefined;
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
        // Quem entra pela primeira vez começa sem nada: o app pede que a
        // pessoa cadastre o primeiro medicamento em vez de inventar dados.
        setMedications(medicationStorage.getMedications() ?? []);
      } catch (error) {
        console.error('Erro ao carregar medicamentos:', error);
        setMedications([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedications();
  }, []);

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
      doseStatus: {},
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

  const markDoseAsTaken = (medicationId: string, occurrenceId: string, wasLate: boolean, takenAt?: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medicationId) {
        return {
          ...med,
          doseStatus: {
            ...med.doseStatus,
            [occurrenceId]: {
              status: wasLate ? 'taken_late' : 'taken',
              takenAt: takenAt ?? new Date().toISOString()
            }
          }
        };
      }
      return med;
    }));
  };

  const updateDoseTakenAt = (medicationId: string, occurrenceId: string, takenAt: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medicationId) {
        const existing = med.doseStatus[occurrenceId];
        if (!existing) return med;
        return {
          ...med,
          doseStatus: {
            ...med.doseStatus,
            [occurrenceId]: { ...existing, takenAt }
          }
        };
      }
      return med;
    }));
  };

  const markDoseAsSkipped = (medicationId: string, occurrenceId: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medicationId) {
        return {
          ...med,
          doseStatus: {
            ...med.doseStatus,
            [occurrenceId]: { status: 'skipped', takenAt: new Date().toISOString() }
          }
        };
      }
      return med;
    }));
  };

  const clearDoseStatus = (medicationId: string, occurrenceId: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medicationId) {
        const { [occurrenceId]: _removed, ...rest } = med.doseStatus;
        return { ...med, doseStatus: rest };
      }
      return med;
    }));
  };

  const getMedicationById = (id: string): Medication | undefined => {
    return medications.find((med) => med.id === id);
  };

  const value: MedicationContextType = {
    medications,
    isLoading,
    addMedication,
    updateMedication,
    deleteMedication,
    markDoseAsTaken,
    markDoseAsSkipped,
    clearDoseStatus,
    updateDoseTakenAt,
    getMedicationById,
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Carregando medicamentos...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return <MedicationContext.Provider value={value}>{children}</MedicationContext.Provider>;
}
