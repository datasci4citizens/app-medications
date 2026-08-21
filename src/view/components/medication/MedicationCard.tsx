import { useEffect, useRef, useState } from 'react';
import { FiChevronRight, FiClock, FiMinusCircle } from 'react-icons/fi';
import { parseOccurrenceId, type DailyDose } from '../../../model/utils/medicationCalculations';
import { formatTimeUntil } from '../../../model/utils/dateHelpers';
import { getBrandColor } from '../../../model/utils/brandColorHelper';
import { MEDICATION_TYPE_LABELS } from '../../../constants';

/** A partir de quantas horas de distância a dose deixa de oferecer ação. */
const FAR_AWAY_HOURS = 12;

interface MedicationCardProps {
  dose: DailyDose;
  onTake: () => void;
  onSkip: () => void;
  onClick: () => void;
}

export function MedicationCard({ dose, onTake, onSkip, onClick }: MedicationCardProps) {
  const { medication, status } = dose;
  const prevStatusRef = useRef(status);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const wasNotTaken = prevStatusRef.current !== 'taken' && prevStatusRef.current !== 'taken_late';
    const isNowTaken = status === 'taken' || status === 'taken_late';
    if (wasNotTaken && isNowTaken) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 700);
      prevStatusRef.current = status;
      return () => clearTimeout(t);
    }
    prevStatusRef.current = status;
  }, [status]);

  const isTaken = status === 'taken' || status === 'taken_late';
  const isSkipped = status === 'skipped';
  const isLate = status === 'late';
  const isPending = status === 'pending';
  const isUpcoming = status === 'upcoming';

  const bgColor = isSkipped ? 'bg-bg-skipped' : isTaken ? 'bg-bg-taken' : 'bg-offwhite';
  const textColor = isSkipped ? 'text-offwhite' : 'text-inkblack';
  const subTextColor = isSkipped ? 'text-gray-300' : 'text-gray-600';
  const dosageColor = isSkipped ? 'text-offwhite' : 'text-purple-dose';

  const typeLabel = MEDICATION_TYPE_LABELS[medication.type] || 'Dose';

  // Dose muito distante não oferece ação: um botão verde "Tomar" às 8h da
  // manhã para uma dose das 22h convida ao registro errado, e "esquecer"
  // algo que ainda nem chegou não faz sentido.
  const doseDate = (() => {
    const parsed = parseOccurrenceId(dose.occurrenceId);
    if (!parsed) return null;
    const [h, m] = parsed.time.split(':').map(Number);
    const d = new Date(`${parsed.date}T00:00:00`);
    d.setHours(h, m, 0, 0);
    return d;
  })();

  const now = new Date();
  const hoursAway = doseDate ? (doseDate.getTime() - now.getTime()) / 3600000 : 0;
  const isFarAway = isUpcoming && hoursAway > FAR_AWAY_HOURS;
  const timeUntil = doseDate ? formatTimeUntil(doseDate, now) : null;

  const timeChipColor = isLate
    ? 'bg-[rgba(211,34,49,0.10)] text-red-skip'
    : 'bg-[rgba(91,42,120,0.08)] text-darkpurple';

  return (
    <div
      onClick={onClick}
      className={`stagger-item animate-fade-slide-up relative w-full rounded-[30px] border border-[rgba(133,133,133,0.5)] flex overflow-hidden cursor-pointer
        [&:not(:has(button:active)):active]:scale-95
        ${bgColor}
        ${pulse ? 'animate-pulse-success' : ''}`}
      style={{ boxShadow: '0 4px 3px rgba(0,0,0,0.25)', transition: 'background-color 500ms ease-out, transform 200ms ease-out' }}
    >
      {/* Barra lateral da marca */}
      <div
        className="brand-strip w-5.25 shrink-0"
        style={{ backgroundColor: getBrandColor(medication.brand) }}
      />

      {/* Conteúdo */}
      <div className="flex flex-1 items-center py-4 px-5">

        {/* Lado Esquerdo: Info + Footer */}
        <div className="flex flex-col flex-1 gap-3">
          {/* Info */}
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className={`font-merriweather font-bold text-[22px] leading-tight ${textColor}`}>
                <span className="uppercase">{medication.name}</span>{' '}
                <span className={`${dosageColor} lowercase`}>
                  {medication.dosage}
                </span>
              </h3>
              <p className={`font-merriweather font-normal text-[18px] mt-1 ${subTextColor}`}>{typeLabel}</p>
              {medication.brand && (
                <p className={`font-merriweather text-[16px] ${subTextColor}`}>Marca: {medication.brand}</p>
              )}
            </div>

            {/* Chip de horário */}
            <span
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-inter font-bold text-[15px] ${isSkipped ? 'bg-white/15 text-offwhite' : timeChipColor}`}
            >
              <FiClock size={16} />
              {dose.time}
            </span>
          </div>

          {/* Footer: botão ou label de status */}
          <div key={status} className="animate-fade-slide-up">
            {isFarAway && (
              <div className="w-full h-[56px] rounded-full bg-ghostwhite flex items-center justify-center gap-2 text-darkpurple">
                <FiClock size={20} />
                <span className="font-merriweather font-bold text-[19px]">
                  {timeUntil ? `Daqui a ${timeUntil}` : `Às ${dose.time}`}
                </span>
              </div>
            )}

            {!isFarAway && (isPending || isUpcoming || isLate) && (
              <div className="flex items-center gap-2">
                <button
                  onClick={e => { e.stopPropagation(); onTake(); }}
                  aria-label={`Marcar ${medication.name} ${medication.dosage} como ${isLate ? 'tomado agora' : 'tomado'}`}
                  className={`btn-shine flex-1 h-[60px] rounded-full font-merriweather font-black text-[22px] tracking-[0.02em] transition-transform active:scale-[0.97] ${isLate ? 'bg-yellow-alert text-deepplum' : 'bg-green-take text-offwhite'}`}
                  style={{
                    animation: isLate
                      ? 'pulseHaloAmber 2.2s ease-in-out infinite'
                      : isPending ? 'pulseHalo 2.4s ease-in-out infinite' : 'none',
                  }}
                >
                  {isLate ? 'Tomar agora' : 'Tomar'}
                </button>

                <button
                  onClick={e => { e.stopPropagation(); onSkip(); }}
                  aria-label={`Marcar ${medication.name} como esquecida`}
                  title="Marcar como esquecida"
                  className="shrink-0 w-[60px] h-[60px] rounded-full border-2 border-black/10 text-gray-500 flex items-center justify-center transition-colors duration-150 active:border-red-skip active:text-red-skip"
                >
                  <FiMinusCircle size={24} />
                </button>
              </div>
            )}

            {isTaken && (
              <div className="w-full h-[56px] rounded-full bg-bg-taken flex items-center justify-center gap-2">
                <span className="font-merriweather font-bold text-[24px] text-green-taken">Tomado ✓</span>
              </div>
            )}

            {isSkipped && (
              <div className="w-full h-[56px] flex items-center justify-center">
                <span className="font-merriweather font-bold text-[24px] text-red-skip">Esquecido!</span>
              </div>
            )}
          </div>
        </div>

        {/* Seta centralizada verticalmente à direita */}
        <FiChevronRight size={32} className={`shrink-0 ml-2 ${isSkipped ? 'text-offwhite' : 'text-darkpurple'}`} />

      </div>
    </div>
  );
}
