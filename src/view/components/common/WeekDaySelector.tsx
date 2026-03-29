


interface WeekDaySelectorProps {
   values: number[];
   isReadOnly: boolean;
   onChange?: (days: number[]) => void;
}

export function WeekDaySelector({ values, isReadOnly, onChange }: WeekDaySelectorProps) {

   const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

   function handleToggle(index: number) {
      console.log(index)
      console.log(values)
      if (values.includes(index)) {
         onChange?.(values.filter(dia => dia !== index))
      } else {
         onChange?.([...values, index])
      }
   }
   // Todo: bug distancia maior que 16px (gap)
   return (
      <div className="flex  bg-lightpurple rounded-4xl justify-around p-1  max-w-150">
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