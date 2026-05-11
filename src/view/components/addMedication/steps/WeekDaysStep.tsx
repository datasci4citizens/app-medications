import { WeekDaySelector } from "../../common/WeekDaySelector";
import type { WeekDay } from "../../../../types";

interface WeekDaysStepProps {
   value: WeekDay[];
   onChange: (days: WeekDay[]) => void;
}

const PRESETS: { label: string; days: WeekDay[] }[] = [
   { label: 'Todos os dias', days: [0, 1, 2, 3, 4, 5, 6] },
   { label: 'Dias úteis', days: [1, 2, 3, 4, 5] },
   { label: 'Fins de semana', days: [0, 6] },
];

export function WeekDaysStep({ value, onChange }: WeekDaysStepProps) {
   const isPresetActive = (preset: WeekDay[]) =>
      preset.length === value.length && preset.every(d => value.includes(d));

   return (
      <div className="flex flex-col gap-6">
         <WeekDaySelector
            isReadOnly={false}
            values={value as number[]}
            onChange={(days) => onChange(days as WeekDay[])}
         />

         <div className="flex flex-wrap gap-2">
            {PRESETS.map(preset => (
               <button
                  key={preset.label}
                  onClick={() => onChange(preset.days)}
                  className={`
                     px-4 py-2 rounded-full font-merriweather text-base
                     border-2 border-darkpurple
                     ${isPresetActive(preset.days) ? 'bg-darkpurple text-offwhite' : 'bg-transparent text-darkpurple'}
                  `}
               >
                  {preset.label}
               </button>
            ))}
         </div>
      </div>
   );
}
