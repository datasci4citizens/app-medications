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
      className={`relative w-full rounded-[30px] border border-[rgba(133,133,133,0.5)] flex overflow-hidden cursor-pointer
        transition-all ease-in-out
        [&:not(:has(button:active)):active]:scale-95
        ${bgColor}`}
      style={{ boxShadow: '0 4px 3px rgba(0,0,0,0.25)' }}
    >
      {/* Barra lateral da marca */}
      <div
        className="w-5.25 shrink-0"
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
          <div className="flex justify-center
            transition-all ease-in-out
            active:scale-110 active:brightness-110">
            {(isPending || isUpcoming) && (
              <button
                onClick={e => { e.stopPropagation(); onTake(); }}
                className="bg-green-take text-offwhite font-merriweather font-semibold text-[24px] rounded-4xl px-8 py-2"
              >
                Tomar
              </button>
            )}

            {isLate && (
              <button
                onClick={e => { e.stopPropagation(); onTake(); }}
                className="bg-yellow-alert text-inkblack font-merriweather font-semibold text-[24px] rounded-4xl px-6 py-2"
              >
                Tomar com atraso
              </button>
            )}

            {isTaken && (
              <span className="font-merriweather font-bold text-[24px] text-green-taken">
                Tomei ✓
              </span>
            )}

            {isSkipped && (
              <span className="font-merriweather font-bold text-[24px] text-red-skip">
                Esquecido!
              </span>
            )}
          </div>
        </div>

        {/* Seta centralizada verticalmente à direita */}
        <FiChevronRight size={32} className={`shrink-0 ml-2 ${isSkipped ? 'text-offwhite' : 'text-darkpurple'}`} />

      </div>
    </div>
  );
}
