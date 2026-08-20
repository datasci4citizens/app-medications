import { useState } from "react";
import { ActionButton } from "../common/ActionButton";
import { NumberBox } from "../common/NumberBox";
import type { DoseRecord, DoseStatus } from "../../../types";

interface DoseActionPanelProps {
   effectiveStatus: DoseStatus | null;
   doseRecord: DoseRecord | undefined;
   onTake: () => void;
   onTakeNow: () => void;
   onTakeAtTime: (time: string) => void;
   onUpdateTakenAt: (time: string) => void;
   onClear: () => void;
}

function formatTakenTime(iso: string): string {
   const d = new Date(iso);
   const h = String(d.getHours()).padStart(2, '0');
   const m = String(d.getMinutes()).padStart(2, '0');
   return `${h}:${m}`;
}

export function DoseActionPanel({
   effectiveStatus,
   doseRecord,
   onTake,
   onTakeNow,
   onTakeAtTime,
   onUpdateTakenAt,
   onClear,
}: DoseActionPanelProps) {
   const [timeEditorOpen, setTimeEditorOpen] = useState(false);
   const [pendingTime, setPendingTime] = useState<string>(() =>
      doseRecord?.takenAt ? formatTakenTime(doseRecord.takenAt) : '08:00'
   );

   const isTaken = doseRecord?.status === 'taken' || doseRecord?.status === 'taken_late';
   const isSkipped = effectiveStatus === 'skipped';

   const handleConfirmTime = (mode: 'take' | 'update') => {
      if (mode === 'take') onTakeAtTime(pendingTime);
      else onUpdateTakenAt(pendingTime);
      setTimeEditorOpen(false);
   };

   // Estado: TOMADO
   if (isTaken && doseRecord?.takenAt) {
      const taken = formatTakenTime(doseRecord.takenAt);
      const [h, m] = taken.split(':');

      return (
         <div className="flex flex-col gap-3 items-center">
            <h2 className="font-merriweather text-2xl font-bold text-green-taken">
               Tomei ✓
            </h2>

            <div className="flex items-center gap-2 font-merriweather text-xl">
               <span>Tomei às</span>
               <NumberBox isReadOnly={true} value={Number(h)} />
               <span>h :</span>
               <NumberBox isReadOnly={true} value={Number(m)} />
               <span>min</span>
            </div>

            {timeEditorOpen ? (
               <div className="flex flex-col gap-2 w-full">
                  <input
                     type="time"
                     value={pendingTime}
                     onChange={(e) => setPendingTime(e.target.value)}
                     className="w-full h-12 px-3 rounded-[10px] bg-lilac text-inkblack text-2xl border-b-4 border-darkpurple font-merriweather outline-none"
                  />
                  <div className="flex gap-2">
                     <button
                        onClick={() => setTimeEditorOpen(false)}
                        className="flex-1 py-2 rounded-full border-2 border-ghostcolor text-ghostcolor font-merriweather"
                     >
                        Cancelar
                     </button>
                     <button
                        onClick={() => handleConfirmTime('update')}
                        className="flex-1 py-2 rounded-full bg-darkpurple text-offwhite font-merriweather"
                     >
                        Confirmar
                     </button>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col gap-2 w-full">
                  <button
                     onClick={onClear}
                     className="w-full py-2 rounded-full border-2 border-ghostcolor text-ghostcolor font-merriweather text-xl active:opacity-70"
                  >
                     Desfazer ↩
                  </button>
                  <button
                     onClick={() => {
                        setPendingTime(taken);
                        setTimeEditorOpen(true);
                     }}
                     className="w-full py-2 rounded-full bg-ghost-gray text-inkblack font-merriweather text-xl active:opacity-70"
                  >
                     Alterar horário que tomei
                  </button>
               </div>
            )}
         </div>
      );
   }

   // Estado: ESQUECIDO (skipped automático ou manual)
   if (isSkipped) {
      return (
         <div className="flex flex-col gap-3 items-center">
            <h2 className="font-merriweather text-2xl font-bold text-red-skip">
               Esquecido!
            </h2>

            {timeEditorOpen ? (
               <div className="flex flex-col gap-2 w-full">
                  <input
                     type="time"
                     value={pendingTime}
                     onChange={(e) => setPendingTime(e.target.value)}
                     className="w-full h-12 px-3 rounded-[10px] bg-lilac text-inkblack text-2xl border-b-4 border-darkpurple font-merriweather outline-none"
                  />
                  <div className="flex gap-2">
                     <button
                        onClick={() => setTimeEditorOpen(false)}
                        className="flex-1 py-2 rounded-full border-2 border-ghostcolor text-ghostcolor font-merriweather"
                     >
                        Cancelar
                     </button>
                     <button
                        onClick={() => handleConfirmTime('take')}
                        className="flex-1 py-2 rounded-full bg-darkpurple text-offwhite font-merriweather"
                     >
                        Confirmar
                     </button>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col gap-2 w-full">
                  <ActionButton label="Tomar agora" onClick={onTakeNow} variant="success" />
                  <button
                     onClick={() => setTimeEditorOpen(true)}
                     className="w-full py-2 rounded-full bg-ghost-gray text-inkblack font-merriweather text-xl active:opacity-70"
                  >
                     Registrar horário que tomei
                  </button>
                  {doseRecord && (
                     <button
                        onClick={onClear}
                        className="w-full py-2 rounded-full border-2 border-ghostcolor text-ghostcolor font-merriweather text-xl active:opacity-70 mt-2"
                     >
                        Desfazer ↩
                     </button>
                  )}
               </div>
            )}
         </div>
      );
   }

   // Estado: ATRASADO
   if (effectiveStatus === 'late') {
      return (
         <ActionButton label="Tomar com atraso" onClick={onTake} variant="warning" />
      );
   }

   // Estado: PRÓXIMO DE TOMAR
   if (effectiveStatus === 'pending') {
      return (
         <ActionButton label="Tomar" onClick={onTake} variant="success" />
      );
   }

   // Estado: AINDA NÃO É HORA (upcoming)
   if (effectiveStatus === 'upcoming') {
      return (
         <div className="text-center font-merriweather text-base text-ghostcolor py-2">
            Ainda não é horário desta dose.
         </div>
      );
   }

   return null;
}
