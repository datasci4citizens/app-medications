import { FiCheck, FiX } from 'react-icons/fi';
import type { DailyDose } from '../../../model/utils/medicationCalculations';
import { getBrandColor } from '../../../model/utils/brandColorHelper';
import { MEDICATION_TYPE_LABELS } from '../../../constants';

interface DoneRowProps {
  dose: DailyDose;
  onClick: () => void;
  delay?: number;
}

/**
 * Linha compacta para doses já resolvidas (tomadas ou esquecidas).
 * Ocupa bem menos espaço que o MedicationCard, que fica reservado
 * para as doses que ainda pedem uma ação do usuário.
 */
export function DoneRow({ dose, onClick, delay = 0 }: DoneRowProps) {
  const { medication, status } = dose;
  const isSkipped = status === 'skipped';
  const typeLabel = MEDICATION_TYPE_LABELS[medication.type] || 'Dose';

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 bg-white/80 rounded-2xl p-3 border border-black/5 cursor-pointer transition-transform active:scale-[0.98]"
      style={{ animation: `fadeSlideUp 320ms ease-out ${delay}ms both` }}
    >
      <div
        className="w-1.5 h-9 rounded-full shrink-0"
        style={{ backgroundColor: getBrandColor(medication.brand) }}
      />

      <div className="flex-1 min-w-0">
        <p
          className={`font-merriweather font-bold text-[18px] text-inkblack truncate ${isSkipped ? 'line-through opacity-60' : ''}`}
        >
          <span className="uppercase">{medication.name}</span>{' '}
          <span className="font-medium text-[15px] text-purple-dose lowercase">{medication.dosage}</span>
        </p>
        <p className="font-inter text-[14px] text-gray-500 mt-0.5">
          {dose.time} · {typeLabel}
        </p>
      </div>

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${isSkipped ? 'bg-red-skip' : 'bg-green-take'}`}
      >
        {isSkipped ? <FiX size={16} strokeWidth={3} /> : <FiCheck size={16} strokeWidth={3} />}
      </div>
    </div>
  );
}
