import { ToggleSwitch } from "../../common/ToggleSwitch";
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

   const handleTimeChange = (index: number, value: string) => {
      const next = [...times];
      next[index] = value;
      onChangeTimes(next);
   };

   const handleAddTime = () => {
      onChangeTimes([...times, '12:00']);
   };

   const handleRemoveTime = (index: number) => {
      if (times.length === 1) return;
      onChangeTimes(times.filter((_, i) => i !== index));
   };

   return (
      <div className="flex flex-col gap-6">
         <ToggleSwitch
            label={isFixed ? 'Horários fixos' : 'Por intervalo'}
            value={!isFixed}
            onClick={() => onChangeScheduleType(isFixed ? 'interval' : 'fixed')}
         />

         {isFixed ? (
            <div className="flex flex-col gap-3">
               {times.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                     <input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                        className="flex-1 h-12 px-3 rounded-[10px] bg-lilac text-inkblack text-2xl border-b-4 border-darkpurple font-merriweather outline-none"
                     />
                     {times.length > 1 && (
                        <button
                           onClick={() => handleRemoveTime(index)}
                           className="w-12 h-12 rounded-full bg-red-skip text-offwhite font-bold active:scale-90"
                        >
                           ×
                        </button>
                     )}
                  </div>
               ))}
               <button
                  onClick={handleAddTime}
                  className="self-start font-merriweather text-base text-darkpurple underline"
               >
                  + Adicionar horário
               </button>
            </div>
         ) : (
            <div className="flex flex-col gap-4">
               <div>
                  <label className="font-merriweather text-base text-ghostcolor mb-1 block">Primeira dose</label>
                  <input
                     type="time"
                     value={startTime}
                     onChange={(e) => onChangeStartTime(e.target.value)}
                     className="w-full h-12 px-3 rounded-[10px] bg-lilac text-inkblack text-2xl border-b-4 border-darkpurple font-merriweather outline-none"
                  />
               </div>
               <div>
                  <label className="font-merriweather text-base text-ghostcolor mb-1 block">A cada quantas horas</label>
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
