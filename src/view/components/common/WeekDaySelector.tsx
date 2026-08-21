/**
 * WeekDaySelector
 *
 * A row of buttons representing the days of the week (Sun–Sat, index 0–6).
 * Selected days are filled in; supports read-only mode.
 *
 * Props:
 *   - values: array of selected day indexes (0 = Sunday, 6 = Saturday)
 *   - isReadOnly: when true, disables all toggles
 *   - onChange: called with the updated array whenever a day is toggled
 *
 * Usage:
 *   <WeekDaySelector values={[1, 3, 5]} isReadOnly={false} onChange={setDays} />
 *   <WeekDaySelector values={[2, 3]} isReadOnly={true} onChange={setDays} />
 */
interface WeekDaySelectorProps {
   values: number[];
   isReadOnly: boolean;
   onChange?: (days: number[]) => void;
}

const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const DAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export function WeekDaySelector({ values, isReadOnly, onChange }: WeekDaySelectorProps) {

   function handleToggle(index: number) {
      if (values.includes(index)) {
         onChange?.(values.filter(dia => dia !== index))
      } else {
         onChange?.([...values, index])
      }
   }

   return (
      <div className="flex justify-between gap-1.5 select-none">
         {DAYS.map((day, index) => {
            const isSelected = values.includes(index);
            return (
               <button
                  key={index}
                  onClick={() => handleToggle(index)}
                  disabled={isReadOnly}
                  aria-label={DAY_NAMES[index]}
                  aria-pressed={isSelected}
                  className={`flex-1 max-w-12 aspect-square rounded-full flex items-center justify-center
                     font-merriweather font-bold text-[20px] transition-colors duration-200
                     ${isSelected
                        ? 'bg-darkpurple text-offwhite shadow-[0_4px_12px_rgba(91,42,120,0.30)]'
                        : 'bg-offwhite text-ghost-gray border border-card-border'}`}
               >
                  {day}
               </button>
            );
         })}
      </div>
   );
}
