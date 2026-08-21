import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiChevronRight, FiPlus } from 'react-icons/fi';
import { DateSelector } from '../components/medication/DateSelector.tsx';
import { Header } from '../components/layout/Header';
import { MedicationCard } from '../components/medication/MedicationCard';
import { DoneRow } from '../components/medication/DoneRow.tsx';
import { LowStockAlert } from '../components/medication/LowStockAlert.tsx';
import { useMedications } from '../../viewmodel/hooks/useMedications.ts';
import { ConfirmModal } from '../components/common/Modal.tsx';
import { calculateDosesForDay, type DailyDose } from '../../model/utils/medicationCalculations';
import { buildDoseDate, formatTimeUntil } from '../../model/utils/dateHelpers.ts';

interface DoseConfirm {
  kind: 'taken' | 'skipped';
  name: string;
  dosage: string;
  time: string;
  medId: string;
  occurrenceId: string;
}

export function Medications() {
  const { medications, isLoading, markDoseAsTaken, markDoseAsSkipped, clearDoseStatus } = useMedications();
  const [doseConfirm, setDoseConfirm] = useState<DoseConfirm | null>(null);
  const [showDone, setShowDone] = useState(true);
  const [stockAlertDismissed, setStockAlertDismissed] = useState(false);
  const [isFutureModalOpen, setIsFutureModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isEarlyModalOpen, setIsEarlyModalOpen] = useState(false);
  const [pendingEarlyDose, setPendingEarlyDose] = useState<{ medId: string, occurrenceId: string, time: string } | null>(null);

  // BUG 3: Normalizar selectedDate para meia-noite ao inicializar
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Tick a cada minuto para recalcular status das doses (pending → late → skipped)
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Calcula todas as doses (ocorrências) para o dia selecionado
  const dailyDoses = useMemo(() => {
    const allDoses: DailyDose[] = [];
    medications.forEach(med => {
      const doses = calculateDosesForDay(med, selectedDate);
      allDoses.push(...doses);
    });

    // Ordena por horário
    return allDoses.sort((a, b) => a.time.localeCompare(b.time));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medications, selectedDate, now]);



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

  // Dia concluído: existem doses e nenhuma está em aberto
  const allDosesDone = dailyDoses.length > 0
    && upcomingDoses.length === 0 && lateDoses.length === 0 && pendingDoses.length === 0;

  // Doses já resolvidas no dia — tomadas e esquecidas juntas, em ordem de horário
  const doneDoses = useMemo(
    () => [...takenDoses, ...skippedDoses].sort((a, b) => a.time.localeCompare(b.time)),
    [takenDoses, skippedDoses]
  );

  // Próxima dose em aberto e quanto falta para ela
  const nextDose = useMemo(() => lateDoses[0] ?? pendingDoses[0] ?? upcomingDoses[0], [lateDoses, pendingDoses, upcomingDoses]);

  const countdownLabel = useMemo(() => {
    if (!nextDose || !isToday) return null;
    if (nextDose.status === 'late') return 'tome agora';
    return formatTimeUntil(buildDoseDate(selectedDate, nextDose.time), now);
  }, [nextDose, isToday, selectedDate, now]);

  const showDoseConfirm = (kind: DoseConfirm['kind'], medId: string, occurrenceId: string, time: string) => {
    const med = medications.find(m => m.id === medId);
    setDoseConfirm({ kind, name: med?.name ?? '', dosage: med?.dosage ?? '', time, medId, occurrenceId });
  };

  // Marcar como tomado (usando ID da ocorrência)
  const handleTake = (medId: string, occurrenceId: string, time: string, wasLate: boolean, isEarly: boolean) => {
    if (isFutureDate) {
      setIsFutureModalOpen(true);
      return;
    }

    if (isEarly) {
      setPendingEarlyDose({ medId, occurrenceId, time });
      setIsEarlyModalOpen(true);
      return;
    }

    markDoseAsTaken(medId, occurrenceId, wasLate);
    showDoseConfirm('taken', medId, occurrenceId, time);
  };

  // Marcar como esquecida
  const handleSkip = (medId: string, occurrenceId: string, time: string) => {
    if (isFutureDate) {
      setIsFutureModalOpen(true);
      return;
    }

    markDoseAsSkipped(medId, occurrenceId);
    showDoseConfirm('skipped', medId, occurrenceId, time);
  };


  const handleCardClick = (id: string, occurrenceId: string, wasLate: boolean ) => {
    navigate(`/medication/user/${id}`, { state: {
      occurrenceId: occurrenceId,
      wasLate: wasLate
    }});
  };

  return (
    <div className="min-h-screen bg-figmagray pb-20">
      <Header selectedDate={selectedDate} doses={dailyDoses} />

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <main className="max-w-md mx-auto px-4 py-6">

        {!stockAlertDismissed && (
          <LowStockAlert medications={medications} onDismiss={() => setStockAlertDismissed(true)} />
        )}

        {/* Lista de Medicamentos Pendentes */}
        <div className="flex flex-col gap-4 mb-10">
          {Object.entries(groupedDoses).map(([horario, doses], index) => {

            const hasLate = doses.some(d => d.status === 'late');

            return (
              <div key={horario}>

                {/* Label do horário + quanto falta */}
                <div className="flex justify-between items-baseline gap-3 mb-3">
                  <h2 className="font-merriweather font-bold text-[26px] text-inkblack">
                    {hasLate ? `Atrasado: ${horario}` :
                      index === 0 && isToday ? `Próximo horário: ${horario}`
                        : `Horário: ${horario}`}
                  </h2>

                  {index === 0 && countdownLabel && (
                    <span
                      className={`shrink-0 font-inter font-bold text-[15px] px-3 py-1.5 rounded-full ${hasLate ? 'bg-[rgba(211,34,49,0.10)] text-red-skip' : 'bg-[rgba(146,84,173,0.10)] text-purple-dose'}`}
                      style={{ animation: hasLate ? 'shakeGentle 2.4s ease-in-out infinite' : 'none' }}
                    >
                      {hasLate ? countdownLabel : `em ${countdownLabel}`}
                    </span>
                  )}
                </div>

                {/* Cards desse horário */}
                <div className="flex flex-col gap-3">
                  {doses.map((dose) => (
                    <MedicationCard
                      key={dose.occurrenceId}
                      dose={dose}
                      onTake={() => handleTake(dose.medication.id, dose.occurrenceId, dose.time, dose.status === 'late', dose.status === 'upcoming')}
                      onSkip={() => handleSkip(dose.medication.id, dose.occurrenceId, dose.time)}
                      onClick={() => handleCardClick(dose.medication.id, dose.occurrenceId, dose.status === 'late')}
                    />
                  ))}
                </div>

              </div>
            )
          })}
        </div>

        {allDosesDone && (
          <div className="flex flex-col items-center text-center py-8 animate-fade-slide-up">
            <div className="w-20 h-20 rounded-full bg-green-take flex items-center justify-center text-white mb-4 shadow-[0_10px_24px_rgba(36,189,118,0.35)]">
              <FiCheck size={40} strokeWidth={3} />
            </div>
            <p className="font-merriweather font-extrabold text-[24px] text-inkblack leading-tight">
              {takenDoses.length === dailyDoses.length
                ? 'Tudo certo por hoje!'
                : 'Dia encerrado'}
            </p>
            <p className="font-inter text-[16px] text-ghostcolor mt-2 max-w-xs">
              {takenDoses.length === dailyDoses.length
                ? `Você tomou ${dailyDoses.length === 1 ? 'sua dose' : `todas as ${dailyDoses.length} doses`}.`
                : `${takenDoses.length} de ${dailyDoses.length} doses tomadas.`}
            </p>
          </div>
        )}

        {/* Doses já resolvidas — recolhidas por padrão, para o foco ficar no que falta */}
        {doneDoses.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowDone(s => !s)}
              aria-expanded={showDone}
              className="w-full flex items-center gap-2.5 py-3 px-3.5 rounded-[18px] bg-white/55 border border-black/5 font-merriweather font-bold text-[18px] text-gray-600"
            >
              <span className="inline-flex w-6.5 h-6.5 rounded-full bg-green-take items-center justify-center text-white shrink-0">
                <FiCheck size={14} strokeWidth={3} />
              </span>
              <span className="flex-1 text-left">Registradas hoje · {doneDoses.length}</span>
              <span
                className="text-gray-400 transition-transform duration-200"
                style={{ transform: showDone ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                <FiChevronRight size={18} />
              </span>
            </button>

            {showDone && (
              <div className="flex flex-col gap-2 mt-2.5 animate-fade-slide-up">
                {doneDoses.map((dose, i) => (
                  <DoneRow
                    key={dose.occurrenceId}
                    dose={dose}
                    delay={i * 40}
                    onClick={() => handleCardClick(dose.medication.id, dose.occurrenceId, false)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        {/* Enquanto os tratamentos do servidor não chegam, não dá para dizer
            que a pessoa não tem nada: seria um convite falso a começar. */}
        {isLoading && dailyDoses.length === 0 && (
          <div className="flex flex-col gap-3 mt-4">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-full h-[150px] rounded-[30px] bg-offwhite/70 border border-card-border animate-pulse"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        )}

        {/* Estado vazio: distingue "ainda não cadastrou nada" de
            "cadastrou, mas nada cai neste dia" — a ação certa é diferente */}
        {!isLoading && dailyDoses.length === 0 && (
          medications.length === 0 ? (
            <div className="flex flex-col items-center text-center mt-16 px-4 animate-fade-slide-up">
              <div className="w-24 h-24 rounded-full bg-lightpurple flex items-center justify-center text-darkpurple mb-6">
                <FiPlus size={44} />
              </div>
              <h2 className="font-merriweather font-extrabold text-[26px] text-inkblack leading-tight">
                Vamos começar?
              </h2>
              <p className="font-inter text-[17px] text-ghostcolor leading-relaxed mt-3 max-w-xs">
                Cadastre seu primeiro medicamento para o Lembramed avisar na hora certa.
              </p>
              <button
                onClick={() => navigate('/search')}
                className="mt-7 h-14 px-7 rounded-full bg-darkpurple text-offwhite font-merriweather font-extrabold text-[19px] flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(91,42,120,0.45)] transition-transform active:scale-95"
              >
                <FiPlus size={22} /> Adicionar medicamento
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center mt-16 px-4 animate-fade-slide-up">
              <div className="w-20 h-20 rounded-full bg-lightpurple flex items-center justify-center text-darkpurple mb-5">
                <FiCheck size={38} strokeWidth={2.5} />
              </div>
              <p className="font-merriweather font-bold text-[22px] text-inkblack">
                Nada marcado para este dia
              </p>
              <p className="font-inter text-[16px] text-ghostcolor mt-2">
                Seus medicamentos não têm dose prevista aqui.
              </p>
            </div>
          )
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
            showDoseConfirm('taken', pendingEarlyDose.medId, pendingEarlyDose.occurrenceId, pendingEarlyDose.time);
          }
          setIsEarlyModalOpen(false);
          setPendingEarlyDose(null);
        }}
        confirmText="Sim, tomar agora"
        cancelText="Cancelar"
        variant="warning"
      />

      {/* Confirmação da dose registrada, com desfazer */}
      <ConfirmModal
        isOpen={!!doseConfirm}
        title={doseConfirm?.kind === 'skipped' ? 'Marcada como esquecida' : 'Dose registrada!'}
        message={doseConfirm ? `${doseConfirm.name} ${doseConfirm.dosage} · ${doseConfirm.time}` : ''}
        variant={doseConfirm?.kind === 'skipped' ? 'danger' : 'success'}
        confirmText="Ok"
        cancelText="Desfazer"
        dismissOnBackdrop={false}
        onConfirm={() => setDoseConfirm(null)}
        onClose={() => {
          if (doseConfirm) clearDoseStatus(doseConfirm.medId, doseConfirm.occurrenceId);
          setDoseConfirm(null);
        }}
      />
    </div>
  );
}
