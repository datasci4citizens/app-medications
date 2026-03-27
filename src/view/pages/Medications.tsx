import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateSelector } from '../components/medication/DateSelector.tsx';
import { Header } from '../components/layout/Header';
import { MedicationCard } from '../components/medication/MedicationCard';
import { useMedications } from '../hooks/useMedications.ts';
import { ConfirmModal } from '../components/common/Modal.tsx';
import { calculateDosesForDay, type DailyDose } from '../utils/medicationCalculations';


export function Medications() {
  const { medications, markDoseAsTaken } = useMedications();
  const [isFutureModalOpen, setIsFutureModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isEarlyModalOpen, setIsEarlyModalOpen] = useState(false);
  const [pendingEarlyDose, setPendingEarlyDose] = useState<{ medId: string, occurrenceId: string } | null>(null);

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
  const upcomingDoses = useMemo(() => dailyDoses.filter(d => d.status === 'upcoming'), [dailyDoses]);
  const lateDoses = useMemo(() => dailyDoses.filter(d => d.status === 'late'), [dailyDoses]);
  const pendingDoses = useMemo(() => dailyDoses.filter(d => d.status === 'pending'), [dailyDoses]);
  const takenDoses = useMemo(() => dailyDoses.filter(d => d.status === 'taken' || d.status === 'taken_late'), [dailyDoses]);
  const skippedDoses = useMemo(() => dailyDoses.filter(d => d.status === 'skipped'), [dailyDoses]);


  const groupedDoses = useMemo(() => {
    const activeDoses = [...lateDoses, ...pendingDoses, ...upcomingDoses];

    return activeDoses.reduce((acc, dose) => {
      const horario = dose.time;

      if (!acc[horario]) {
        acc[horario] = [];
      }
      acc[horario].push(dose);
      return acc;
    }, {} as Record<string, typeof pendingDoses>);
  }, [lateDoses, pendingDoses, upcomingDoses]);

  const isToday = useMemo(() => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  }, [selectedDate]);

  const isFutureDate = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return selectedDate > now;
  }, [selectedDate]);

  // Marcar como tomado (usando ID da ocorrência)
  const handleTake = (medId: string, occurrenceId: string, wasLate: boolean, isEarly: boolean) => {
    if (isFutureDate) {
      setIsFutureModalOpen(true);
      return;
    }

    if (isEarly) {
      setPendingEarlyDose({ medId, occurrenceId });
      setIsEarlyModalOpen(true);
      return;
    }

    markDoseAsTaken(medId, occurrenceId, wasLate);
  };


  const handleCardClick = (id: string) => {
    navigate(`/medication/${id}`);
  };

  return (
    <div className="min-h-screen bg-figmagray pb-20">
      <Header selectedDate={selectedDate} />

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <main className="max-w-md mx-auto px-4 py-6">

        {/* Lista de Medicamentos Pendentes */}
        <div className="flex flex-col gap-4 mb-10">
          {Object.entries(groupedDoses).map(([horario, doses], index) => {

            const hasLate = doses.some(d => d.status === 'late');

            return (
              <div key={horario}>

                {/* Label do horário */}
                <h2 className="font-merriweather font-bold text-[26px] text-inkblack mb-3">
                  {hasLate ? `Atrasado: ${horario}` :
                    index === 0 && isToday ? `Próximo horário: ${horario}`
                      : `Horário: ${horario}`}
                </h2>

                {/* Cards desse horário */}
                <div className="flex flex-col gap-3">
                  {doses.map((dose) => (
                    <MedicationCard
                      key={dose.occurrenceId}
                      dose={dose}
                      onTake={() => handleTake(dose.medication.id, dose.occurrenceId, dose.status === 'late', dose.status === 'upcoming')}
                      onClick={() => handleCardClick(dose.medication.id)}
                    />
                  ))}
                </div>

              </div>
            )
          })}
        </div>

        {/* Seção de Tomados */}
        {takenDoses.length > 0 && (
          <div className="mt-8">
            <h3 className="font-merriweather font-bold text-[26px] text-inkblack mb-3">
              Tomados
            </h3>
            <div className="flex flex-col gap-3">
              {takenDoses.map((dose) => (
                <MedicationCard
                  key={dose.occurrenceId}
                  dose={dose}
                  onTake={() => handleTake(dose.medication.id, dose.occurrenceId, false, false )}
                  onClick={() => handleCardClick(dose.medication.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Seção de Esquecidos */}
        {skippedDoses.length > 0 && (
          <div className="mt-8">
            <h3 className="font-merriweather font-bold text-[28px] text-inkblack mb-3">
              Esquecidos
            </h3>
            <div className="flex flex-col gap-3">
              {skippedDoses.map((dose) => (
                <MedicationCard
                  key={dose.occurrenceId}
                  dose={dose}
                  onTake={() => handleTake(dose.medication.id, dose.occurrenceId, false, false)}
                  onClick={() => handleCardClick(dose.medication.id)}
                />
              ))}
            </div>
          </div>
        )}
        {/* Estado vazio */}
        {dailyDoses.length === 0 && (
          <div className=" font-merriweather font-bold text-[28px] text-center mt-20 animate-fade-slide-up">
            <p className="text-gray-400 text-lg">Nenhum medicamento para este dia.</p>
          </div>
        )}
      </main>

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
      <ConfirmModal
        isOpen={isEarlyModalOpen}
        title="Está muito cedo!"
        message="Ainda não está na janela de horário desse medicamento. Tem certeza que quer tomar agora?"
        onClose={() => {
          setIsEarlyModalOpen(false);
          setPendingEarlyDose(null);
        }}
        onConfirm={() => {
          if (pendingEarlyDose) {
            markDoseAsTaken(pendingEarlyDose.medId, pendingEarlyDose.occurrenceId, false);
          }
          setIsEarlyModalOpen(false);
          setPendingEarlyDose(null);
        }}
        confirmText="Sim, tomar agora"
        cancelText="Cancelar"
        variant="warning"
      />
    </div>
  );
}
