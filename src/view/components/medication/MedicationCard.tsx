import { useEffect, useRef, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import type { DailyDose } from '../../../model/utils/medicationCalculations';
import { getBrandColor } from '../../../model/utils/brandColorHelper';
import { MEDICATION_TYPE_LABELS } from '../../../constants';

interface MedicationCardProps {
  dose: DailyDose;
  onTake: () => void;
  onClick: () => void;
}

export function MedicationCard({ dose, onTake, onClick }: MedicationCardProps) {
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
          <div>
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

          {/* Footer: botão ou label de status */}
          <div key={status} className="animate-fade-slide-up">
            {(isPending || isUpcoming) && (
              <button
                onClick={e => { e.stopPropagation(); onTake(); }}
                className="btn-shine w-full h-[60px] rounded-full bg-green-take text-offwhite font-merriweather font-black text-[22px] tracking-[0.02em] transition-transform active:scale-[0.97]"
                style={{ animation: isPending ? 'pulseHalo 2.4s ease-in-out infinite' : 'none' }}
              >
                Tomar
              </button>
            )}

            {isLate && (
              <button
                onClick={e => { e.stopPropagation(); onTake(); }}
                className="btn-shine w-full h-[60px] rounded-full bg-yellow-alert text-deepplum font-merriweather font-black text-[22px] tracking-[0.02em] transition-transform active:scale-[0.97]"
                style={{ animation: 'pulseHaloAmber 2.2s ease-in-out infinite' }}
              >
                Tomar agora
              </button>
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
