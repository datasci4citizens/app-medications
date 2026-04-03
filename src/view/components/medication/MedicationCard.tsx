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

  const isTaken = status === 'taken';
  const isSkipped = status === 'skipped';
  const isLate = status === 'late';
  const isPending = status === 'pending';

  const isUpcoming = status === 'upcoming';

  const bgColor = isSkipped ? 'bg-bg-skipped' : isTaken ? 'bg-bg-taken' : 'bg-offwhite';
  const textColor = isSkipped ? 'text-offwhite' : 'text-inkblack';
  const subTextColor = isSkipped ? 'text-gray-300' : 'text-gray-600';

  const typeLabel = MEDICATION_TYPE_LABELS[medication.type] || 'Dose';

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-45 rounded-[30px] border border-[rgba(133,133,133,0.5)] flex overflow-hidden cursor-pointer 
        transition-all ease-in-out 
        [&:not(:has(button:active)):active]:scale-90 
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

        {/* Lado Esquerdo: Info + Botão */}
        <div className="flex flex-col flex-1">
          {/* Info */}
          <div>
            <h3 className={`font-merriweather font-bold text-[24px] leading-tight ${textColor}`}>
              <span className="uppercase">{medication.name}</span>{' '}
              <span className={`${isSkipped ? 'text-offwhite' : 'text-purple-dose'} lowercase`}>
                {medication.dosage}
              </span>
            </h3>
            <p className={`font-merriweather font-normal text-[20px] mt-1 ${subTextColor}`}>{typeLabel}</p>
            {medication.brand && (
              <p className={`text-sm ${subTextColor}`}>Marca: {medication.brand}</p>
            )}
          </div>

          {/* Botão centralizado em relação ao texto */}
          <div className="flex justify-center mt-3 
          
          transition-all ease-in-out
          active:scale-110 active:brightness-110">
            {(isPending || isUpcoming) && (
              <button
                onClick={e => { e.stopPropagation(); onTake(); }}
                className="bg-green-take text-offwhite font-merriweather font-semibold text-[28px] rounded-4xl"
                style={{ width: '175px', height: '57px' }}
              >
                Tomar
              </button>
            )}

            {isLate && (
              <button
                onClick={e => { e.stopPropagation(); onTake(); }}
                className="bg-amber-500 text-offwhite font-merriweather font-semibold text-[28px] rounded-4xl"
                style={{ width: '175px', height: '57px' }}
              >
                Tomar
              </button>
            )}
            {isTaken && (
              <button
                disabled
                className="bg-green-taken text-offwhite font-merriweather font-semibold text-[28px] rounded-full"
                style={{ width: '175px', height: '57px' }}
              >
                Tomei
              </button>
            )}
            {isSkipped && (
              <button
                disabled
                className="bg-red-skip text-offwhite font-merriweather font-semibold text-[28px] rounded-full"
                style={{ width: '175px', height: '57px' }}
              >
                Esqueci
              </button>
            )}
          </div>
        </div>

        {/* Seta centralizada verticalmente à direita */}
        <FiChevronRight size={32} className="text-darkpurple shrink-0 ml-2" />

      </div>
    </div>
  );
}
