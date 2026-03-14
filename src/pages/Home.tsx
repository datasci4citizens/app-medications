import { useMemo, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { DateSelector } from '../components/medication/DateSelector.tsx';
import { Header } from '../components/layout/Header';
import { MedicationCard } from '../components/medication/MedicationCard';
import { useMedications } from '../hooks/useMedications.ts';
import { ConfirmModal } from '../components/common/Modal.tsx';
import { calculateDosesForDay, type DailyDose } from '../utils/medicationCalculations';


export function Home() {
  const { medications, markDoseAsTaken, markDoseAsSkipped, deleteMedication } = useMedications();
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFutureModalOpen, setIsFutureModalOpen] = useState(false);
  const navigate = useNavigate();

  // BUG 3: Normalizar selectedDate para meia-noite ao inicializar
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Calcula todas as doses (ocorrências) para o dia selecionado
  const dailyDoses = useMemo(() => {
    const allDoses: DailyDose[] = [];
    medications.forEach(med => {
      const doses = calculateDosesForDay(med, selectedDate);
      allDoses.push(...doses);
    });
    
    // Ordena por horário
    return allDoses.sort((a, b) => a.time.localeCompare(b.time));
  }, [medications, selectedDate]);

  // Divide entre pendentes e concluídos (tomados/esquecidos)
  const pendingDoses = useMemo(() => dailyDoses.filter(d => d.status === 'pending'), [dailyDoses]);
  const completedDoses = useMemo(() => dailyDoses.filter(d => d.status !== 'pending'), [dailyDoses]);

  const isToday = useMemo(() => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  }, [selectedDate]);

  // BUG 16: Encontrar o próximo medicamento pendente considerando o horário atual se for HOJE
  const nextDose = useMemo(() => {
    if (!isToday) return null; // Só mostra banner se for hoje
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return pendingDoses.find(dose => {
      const [h, m] = dose.time.split(':').map(Number);
      return (h * 60 + m) >= currentTime;
    }) || pendingDoses[0];
  }, [pendingDoses, isToday]);

  const isFutureDate = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return selectedDate > now;
  }, [selectedDate]);

  // Marcar como tomado (usando ID da ocorrência)
  const handleTake = (medId: string, occurrenceId: string) => {
    if (isFutureDate) {
      setIsFutureModalOpen(true);
      return;
    }
    markDoseAsTaken(medId, occurrenceId);
  };

  // BUG 15: handleSkip agora também tem guard de data futura
  const handleSkip = (medId: string, occurrenceId: string) => {
    if (isFutureDate) {
      setIsFutureModalOpen(true);
      return;
    }
    markDoseAsSkipped(medId, occurrenceId)
  };

  const editMedication = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleCardClick = (id: string) => {
    navigate(`/medication/user/${id}`);
  };

  const handleDelete = (id: string) => {
    setMedicationToDelete(id);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-figmagray pb-20">
      <Header selectedDate={selectedDate}  />

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <main className="max-w-md mx-auto px-4 py-6">
        {/* PRÓXIMO HORÁRIO (BUG 16: Apenas hoje) */}
        {isToday && nextDose && (
          <div className="mb-6 animate-fade-slide-up">
            <h2 className="text-purple-600 font-bold text-lg uppercase tracking-wide">
              Próximo Horário: {nextDose.time}
            </h2>
          </div>
        )}

        {/* Lista de Medicamentos Pendentes */}
        <div className="flex flex-col gap-4 mb-10">
          {pendingDoses.map((dose) => (
            <MedicationCard
              key={dose.occurrenceId}
              medication={{
                ...dose.medication,
                time: dose.time,
                status: dose.status,
                taken: dose.status === 'taken'
              }}
              // BUG 11: Padronizado callback sem parâmetro id desnecessário
              onTake={() => handleTake(dose.medication.id, dose.occurrenceId)}
              onSkip={() => handleSkip(dose.medication.id, dose.occurrenceId)}
              onDelete={() => handleDelete(dose.medication.id)}
              onEdit={() => editMedication(dose.medication.id)}
              onClick={() => handleCardClick(dose.medication.id)}
            />
          ))}
        </div>

        {/* Seção de Tomados */}
        {completedDoses.length > 0 && (
          <div className="mt-8 animate-fade-slide-up">
            <h3 className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-4 px-2">
              Tomados / Concluídos
            </h3>
            <div className="flex flex-col gap-4 opacity-60 grayscale-[0.5]">
              {completedDoses.map((dose) => (
                <MedicationCard
                  key={dose.occurrenceId}
                  medication={{
                    ...dose.medication,
                    time: dose.time,
                    status: dose.status,
                    taken: dose.status === 'taken'
                  }}
                  onTake={() => handleTake(dose.medication.id, dose.occurrenceId)}
                  onSkip={() => handleSkip(dose.medication.id, dose.occurrenceId)}
                  onDelete={() => handleDelete(dose.medication.id)}
                  onEdit={() => editMedication(dose.medication.id)}
                  onClick={() => handleCardClick(dose.medication.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {dailyDoses.length === 0 && (
          <div className="text-center mt-20 animate-fade-slide-up">
            <p className="text-gray-400 text-lg">Nenhum medicamento para este dia.</p>
          </div>
        )}
      </main>

      <button
        onClick={() => navigate('/search')}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all hover:scale-110 active:scale-95"
      >
        <FiPlus size={24} />
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Excluir tratamento?"
        message="Isso removerá todas as doses futuras deste medicamento."
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          if (medicationToDelete) {
            deleteMedication(medicationToDelete);
            setIsModalOpen(false);
          }
        }}
      />

      <ConfirmModal
        isOpen={isFutureModalOpen}
        title="Data Futura"
        message="Você não pode interagir com um medicamento de uma data futura."
        onClose={() => setIsFutureModalOpen(false)}
        onConfirm={() => setIsFutureModalOpen(false)}
        confirmText="Entendi"
        cancelText="Voltar"
        variant="info"
      />
    </div>
  );
}
