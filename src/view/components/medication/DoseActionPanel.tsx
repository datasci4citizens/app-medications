import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import type { DoseRecord, DoseStatus } from "../../../types";

interface DoseActionPanelProps {
   effectiveStatus: DoseStatus | null;
   doseRecord: DoseRecord | undefined;
   onTake: () => void;
   onTakeNow: () => void;
   onTakeAtTime: (time: string) => void;
   onUpdateTakenAt: (time: string) => void;
   onSkip: () => void;
   onClear: () => void;
}

function formatTakenTime(iso: string): string {
   const d = new Date(iso);
   const h = String(d.getHours()).padStart(2, '0');
   const m = String(d.getMinutes()).padStart(2, '0');
   return `${h}:${m}`;
}

/** Faixa de estado: o resultado da dose, alto e sem ação embutida. */
function StatusBar({ tone, children }: { tone: 'taken' | 'skipped'; children: React.ReactNode }) {
   return (
      <div
         className={`h-16 rounded-full flex items-center justify-center gap-2.5 text-white
            font-merriweather font-extrabold text-[22px] animate-scale-in
            ${tone === 'taken'
               ? 'bg-green-taken shadow-[0_10px_24px_rgba(36,189,118,0.30)]'
               : 'bg-red-skip shadow-[0_10px_24px_rgba(211,34,49,0.30)]'}`}
      >
         {children}
      </div>
   );
}

/** Ação principal da dose: o alvo mais fácil de acertar da tela. */
function PrimaryAction({ label, tone, onClick }: { label: string; tone: 'green' | 'amber'; onClick: () => void }) {
   return (
      <button
         onClick={onClick}
         className={`btn-shine h-16 rounded-full flex items-center justify-center gap-2.5
            font-merriweather font-extrabold text-[22px] tracking-[0.02em]
            transition-transform active:scale-95
            ${tone === 'amber' ? 'bg-yellow-alert text-deepplum' : 'bg-green-take text-white'}`}
         style={{ animation: tone === 'amber' ? 'pulseHaloAmber 2.2s ease-in-out infinite' : 'pulseHalo 2.4s ease-in-out infinite' }}
      >
         <FiCheck size={24} strokeWidth={3} /> {label}
      </button>
   );
}

/** Ação secundária, sem peso visual para não competir com a principal. */
function TextAction({ label, onClick, tone = 'purple' }: { label: string; onClick: () => void; tone?: 'purple' | 'red' }) {
   return (
      <button
         onClick={onClick}
         className={`h-13 rounded-full font-merriweather font-bold text-[17px] transition-colors
            ${tone === 'red'
               ? 'border-2 border-red-skip text-red-skip active:bg-red-skip active:text-white'
               : 'text-darkpurple underline underline-offset-4 active:opacity-60'}`}
      >
         {label}
      </button>
   );
}

function TimeEditor({ value, onChange, onCancel, onConfirm }: {
   value: string;
   onChange: (v: string) => void;
   onCancel: () => void;
   onConfirm: () => void;
}) {
   return (
      <div className="flex flex-col gap-3">
         <input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-center
               font-merriweather font-black text-[56px] text-darkpurple"
         />
         <div className="flex gap-2.5">
            <button
               onClick={onCancel}
               className="flex-1 h-13 rounded-full border-2 border-ghost-gray text-ghostcolor font-merriweather font-bold text-[17px] active:opacity-70"
            >
               Cancelar
            </button>
            <button
               onClick={onConfirm}
               className="flex-1 h-13 rounded-full bg-darkpurple text-offwhite font-merriweather font-bold text-[17px] active:scale-95 transition-transform"
            >
               Confirmar
            </button>
         </div>
      </div>
   );
}

export function DoseActionPanel({
   effectiveStatus,
   doseRecord,
   onTake,
   onTakeNow,
   onTakeAtTime,
   onUpdateTakenAt,
   onSkip,
   onClear,
}: DoseActionPanelProps) {
   const [timeEditorOpen, setTimeEditorOpen] = useState(false);
   const [pendingTime, setPendingTime] = useState<string>(() =>
      doseRecord?.takenAt ? formatTakenTime(doseRecord.takenAt) : '08:00'
   );

   const isTaken = doseRecord?.status === 'taken' || doseRecord?.status === 'taken_late';
   const isSkipped = effectiveStatus === 'skipped';

   const confirmTime = (mode: 'take' | 'update') => {
      if (mode === 'take') onTakeAtTime(pendingTime);
      else onUpdateTakenAt(pendingTime);
      setTimeEditorOpen(false);
   };

   // TOMADO
   if (isTaken && doseRecord?.takenAt) {
      const taken = formatTakenTime(doseRecord.takenAt);

      return (
         <div className="flex flex-col gap-3">
            <StatusBar tone="taken">
               <FiCheck size={26} strokeWidth={3} /> Tomado às {taken}
            </StatusBar>

            {timeEditorOpen ? (
               <TimeEditor
                  value={pendingTime}
                  onChange={setPendingTime}
                  onCancel={() => setTimeEditorOpen(false)}
                  onConfirm={() => confirmTime('update')}
               />
            ) : (
               <div className="flex flex-col gap-1">
                  <TextAction label="Desfazer" onClick={onClear} />
                  <TextAction
                     label="Alterar o horário"
                     onClick={() => { setPendingTime(taken); setTimeEditorOpen(true); }}
                  />
               </div>
            )}
         </div>
      );
   }

   // ESQUECIDO
   if (isSkipped) {
      return (
         <div className="flex flex-col gap-3">
            <StatusBar tone="skipped">Dose esquecida</StatusBar>

            {timeEditorOpen ? (
               <TimeEditor
                  value={pendingTime}
                  onChange={setPendingTime}
                  onCancel={() => setTimeEditorOpen(false)}
                  onConfirm={() => confirmTime('take')}
               />
            ) : (
               <div className="flex flex-col gap-2.5">
                  <PrimaryAction label="Tomar agora" tone="green" onClick={onTakeNow} />
                  <TextAction label="Tomei em outro horário" onClick={() => setTimeEditorOpen(true)} />
                  {doseRecord && <TextAction label="Desfazer" onClick={onClear} />}
               </div>
            )}
         </div>
      );
   }

   // ATRASADO e NA HORA compartilham o par: tomar, ou assumir que não tomou
   if (effectiveStatus === 'late' || effectiveStatus === 'pending') {
      const isLate = effectiveStatus === 'late';
      return (
         <div className="flex flex-col gap-2.5">
            <PrimaryAction
               label={isLate ? 'Tomar agora' : 'Tomar'}
               tone={isLate ? 'amber' : 'green'}
               onClick={onTake}
            />
            <TextAction label="Não tomei / Esqueci" tone="red" onClick={onSkip} />
         </div>
      );
   }

   // AINDA NÃO É HORA
   if (effectiveStatus === 'upcoming') {
      return (
         <div className="h-16 rounded-full bg-ghostwhite flex items-center justify-center
            font-merriweather font-bold text-[18px] text-ghostcolor">
            Ainda não é hora desta dose
         </div>
      );
   }

   return null;
}
