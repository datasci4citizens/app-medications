import { FiX } from 'react-icons/fi';
import CapsuleIcon from '../../../assets/icons/svgs/capsule.svg?react';
import type { Medication } from '../../../types';

interface LowStockAlertProps {
   medications: Medication[];
   onDismiss: () => void;
}

/** Limite usado quando o medicamento não define o seu. */
const DEFAULT_THRESHOLD = 5;

export function isLowStock(medication: Medication): boolean {
   if (medication.currentStock === undefined) return false;
   return medication.currentStock <= (medication.stockReminderThreshold ?? DEFAULT_THRESHOLD);
}

/**
 * Aviso de reposição no topo da lista.
 *
 * Fala de um medicamento por vez: um alerta com quatro nomes vira parede de
 * texto e some da atenção, que é o oposto do que ele existe para fazer.
 */
export function LowStockAlert({ medications, onDismiss }: LowStockAlertProps) {
   const low = medications.filter(isLowStock);
   if (low.length === 0) return null;

   const first = low[0];
   const others = low.length - 1;

   return (
      <div
         className="flex items-center gap-3 mx-1 mb-4 px-4 py-3.5 rounded-[20px] border-2 border-yellow-alert bg-yellow-alert/20 animate-fade-slide-up"
      >
         <span className="w-11.5 h-11.5 rounded-full bg-yellow-alert text-deepplum flex items-center justify-center shrink-0">
            <CapsuleIcon className="w-6 h-6" />
         </span>

         <div className="flex-1 min-w-0">
            <p className="font-merriweather font-extrabold text-[18px] text-[#7a5000] leading-tight">
               {first.name} está acabando
            </p>
            <p className="font-inter text-[15px] text-[#6b5a2e] mt-0.5">
               {first.currentStock === 0
                  ? 'Acabou — peça na farmácia'
                  : `Restam ${first.currentStock} · peça na farmácia`}
               {others > 0 && ` · e mais ${others}`}
            </p>
         </div>

         <button
            onClick={onDismiss}
            aria-label="Dispensar aviso"
            className="w-10 h-10 rounded-full bg-deepplum text-white flex items-center justify-center shrink-0 active:scale-90 transition-transform"
         >
            <FiX size={20} strokeWidth={3} />
         </button>
      </div>
   );
}
