


/**
 * WeekDaySelector
 *
 * A row of buttons representing the days of the week (Sun–Sat, index 0–6).
 * Selected days are highlighted with a border. Supports read-only mode.
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

export function WeekDaySelector({ values, isReadOnly, onChange }: WeekDaySelectorProps) {

   const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

   function handleToggle(index: number) {
      if (values.includes(index)) {
         onChange?.(values.filter(dia => dia !== index))
      } else {
         onChange?.([...values, index])
      }
   }
   // Todo: bug distancia maior que 16px (gap)
   return (
      <div className="flex  bg-lightpurple rounded-4xl justify-around p-1  max-w-150 select-none">
         {days.map((day, index) =>
            <button key={index} onClick={() => handleToggle(index)} disabled={isReadOnly}
               className={`bg-offwhite  max-w-10.5  h-10.5 flex-1 rounded-full list-none flex items-center justify-center
       drop-shadow-lg font-merriweather text-2xl
                   ${values.includes(index) ? 'border-darkpurple border-3' : ''}
       `}
            >
               {day}
            </button>)
         }
      </div>
   );
}