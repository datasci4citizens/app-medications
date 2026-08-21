import { FiPlus, FiX } from "react-icons/fi";
import { NumberInput } from "../../common/InputBar";

interface ScheduleStepProps {
   scheduleType: 'fixed' | 'interval';
   times: string[];
   startTime: string;
   intervalHours: number;
   onChangeScheduleType: (type: 'fixed' | 'interval') => void;
   onChangeTimes: (times: string[]) => void;
   onChangeStartTime: (time: string) => void;
   onChangeIntervalHours: (hours: number) => void;
}

/** Horários comuns de tomada, para não obrigar a girar o relógio. */
const PRESETS = ['07:00', '12:00', '18:00', '22:00'];

/** Campo de horário grande e centralizado, como na referência. */
function BigTimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
   return (
      <input
         type="time"
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className="w-full bg-transparent border-none outline-none text-center
            font-merriweather font-black text-[56px] text-darkpurple"
      />
   );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
   return (
      <button
         onClick={onClick}
         aria-pressed={active}
         className={`px-4 py-3 rounded-full font-inter font-bold text-[16px]
            transition-colors duration-150 active:scale-95
            ${active ? 'bg-darkpurple text-offwhite' : 'bg-ghostwhite text-darkpurple'}`}
      >
         {label}
      </button>
   );
}

export function ScheduleStep({
   scheduleType,
   times,
   startTime,
   intervalHours,
   onChangeScheduleType,
   onChangeTimes,
   onChangeStartTime,
   onChangeIntervalHours,
}: ScheduleStepProps) {
   const isFixed = scheduleType === 'fixed';

   const changeTime = (index: number, value: string) => {
      const next = [...times];
      next[index] = value;
      onChangeTimes(next);
   };

   const removeTime = (index: number) => {
      if (times.length === 1) return;
      onChangeTimes(times.filter((_, i) => i !== index));
   };

   /** Um horário já na lista é removido pelo mesmo toque que o adicionou. */
   const togglePreset = (preset: string) => {
      if (times.includes(preset)) {
         if (times.length > 1) onChangeTimes(times.filter(t => t !== preset));
         return;
      }
      onChangeTimes([...times, preset].sort());
   };

   return (
      <div className="flex flex-col gap-6">

         {/* Duas opções lado a lado deixam claro qual está ativa */}
         <div className="flex gap-2">
            <Chip label="Horários fixos" active={isFixed} onClick={() => onChangeScheduleType('fixed')} />
            <Chip label="De X em X horas" active={!isFixed} onClick={() => onChangeScheduleType('interval')} />
         </div>

         {isFixed ? (
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-2.5">
                  {times.map((time, index) => (
                     <div
                        key={index}
                        className="flex items-center gap-2 bg-ghostwhite rounded-[20px] px-4 py-2"
                     >
                        <BigTimeInput value={time} onChange={(v) => changeTime(index, v)} />
                        {times.length > 1 && (
                           <button
                              onClick={() => removeTime(index)}
                              aria-label={`Remover horário ${time}`}
                              className="w-10 h-10 rounded-full bg-black/6 text-ghostcolor flex items-center justify-center shrink-0 active:bg-red-skip active:text-white transition-colors"
                           >
                              <FiX size={20} strokeWidth={3} />
                           </button>
                        )}
                     </div>
                  ))}
               </div>

               <button
                  onClick={() => onChangeTimes([...times, '12:00'])}
                  className="self-start flex items-center gap-2 px-4 py-3 rounded-full bg-ghostwhite text-darkpurple font-inter font-bold text-[16px] active:scale-95 transition-transform"
               >
                  <FiPlus size={18} strokeWidth={3} /> Adicionar horário
               </button>

               <div>
                  <p className="font-inter text-[15px] text-ghostcolor mb-2">Horários comuns</p>
                  <div className="flex gap-2 flex-wrap">
                     {PRESETS.map(preset => (
                        <Chip
                           key={preset}
                           label={preset}
                           active={times.includes(preset)}
                           onClick={() => togglePreset(preset)}
                        />
                     ))}
                  </div>
               </div>
            </div>
         ) : (
            <div className="flex flex-col gap-5">
               <div>
                  <p className="font-inter text-[15px] text-ghostcolor mb-1">Primeira dose do dia</p>
                  <div className="bg-ghostwhite rounded-[20px] px-4 py-2">
                     <BigTimeInput value={startTime} onChange={onChangeStartTime} />
                  </div>
               </div>

               <div>
                  <p className="font-inter text-[15px] text-ghostcolor mb-1">Repetir a cada</p>
                  <NumberInput
                     value={intervalHours}
                     onChange={(v) => onChangeIntervalHours(typeof v === 'number' ? v : 0)}
                     label="horas"
                     example="8"
                  />
               </div>
            </div>
         )}
      </div>
   );
}
