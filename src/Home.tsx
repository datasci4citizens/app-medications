import { useEffect, useMemo, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { DateSelector } from './components/DateSelector.tsx';
import { Header } from './components/Header';
import { MedicationCard } from './components/MedicationCard';
import { mockMedication } from './data/mockMedication';
import type { Medication } from './types';
import { isSameDay } from './utils/dateHelpers';


export function Home() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [medications, setMedications] = useState<Medication[]>(() => {
    const savedData = localStorage.getItem('my_medications');
    return savedData ? JSON.parse(savedData) : mockMedication;
  });

  // Persiste no localStorage sempre que a lista de medicamentos mudar
  useEffect(() => {
    localStorage.setItem('my_medications', JSON.stringify(medications));
  }, [medications]);

  // Filtrar medicamentos pela data selecionada
  const filteredMedications = useMemo(() => {
    return medications.filter((med) => {
      if (!med.scheduledDate) return true; // Mostra se não tem data
      const medDate = new Date(med.scheduledDate);
      return isSameDay(medDate, selectedDate);
    });
  }, [medications, selectedDate]);

  // Encontrar o próximo medicamento pendente
  const nextMedication = useMemo(() => {
    const pending = filteredMedications
      .filter((med) => med.status === 'pending')
      .sort((a, b) => a.time.localeCompare(b.time));
    return pending[0];
  }, [filteredMedications]);

  // Marcar como tomado
  const handleTake = (id: string) => {
    setMedications((currentList) => {
      return currentList.map((med) =>
        med.id === id ? { ...med, status: 'taken' as const, taken: true } : med,
      );
    });
  };

  // Marcar como esquecido
  const handleSkip = (id: string) => {
    setMedications((currentList) => {
      return currentList.map((med) =>
        med.id === id ? { ...med, status: 'skipped' as const, taken: false } : med,
      );
    });
  };

  const editMedication = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const deleteMedication = (id: string) => {
    if (!confirm('Tem certeza?')) return;

    setMedications((currentList) => {
      return currentList.filter((med) => med.id !== id);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header onTitleClick={() => navigate('/home')} />

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <main className="max-w-md mx-auto px-4 py-6">
        {/* PRÓXIMO HORÁRIO */}
        {nextMedication && (
          <div className="mb-6">
            <h2 className="text-purple-600 font-bold text-lg uppercase tracking-wide">
              Próximo Horário: {nextMedication.time}
            </h2>
          </div>
        )}

        {/* Lista de Medicamentos */}
        <div className="flex flex-col gap-4">
          {filteredMedications.map((med) => (
            <MedicationCard
              key={med.id}
              medication={med}
              onTake={handleTake}
              onSkip={handleSkip}
              onDelete={deleteMedication}
              onEdit={editMedication}
            />
          ))}
        </div>

        {/* Estado vazio */}
        {filteredMedications.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Nenhum medicamento para este dia.</p>
        )}
      </main>

      <button
        onClick={() => navigate('/add')}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      >
        <FiPlus size={24} />
      </button>
    </div>
  );
}
