interface PeriodStepProps {
   startDate: string;
   endDate: string | null;
   onChangeStartDate: (date: string) => void;
   onChangeEndDate: (date: string | null) => void;
}

/** Durações comuns de tratamento, para não obrigar a calcular a data final. */
const DURATIONS = [
   { label: '7 dias', days: 7 },
   { label: '15 dias', days: 15 },
   { label: '30 dias', days: 30 },
];

function addDays(iso: string, days: number): string {
   const date = new Date(`${iso}T00:00:00`);
   date.setDate(date.getDate() + days);
   return date.toISOString().slice(0, 10);
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

function DateField({ label, value, min, onChange }: {
   label: string;
   value: string;
   min?: string;
   onChange: (v: string) => void;
}) {
   return (
      <div>
         <p className="font-inter text-[15px] text-ghostcolor mb-1">{label}</p>
         <div className="bg-ghostwhite rounded-[20px] px-5 py-4">
            <input
               type="date"
               value={value}
               min={min}
               onChange={(e) => onChange(e.target.value)}
               className="w-full bg-transparent border-none outline-none
                  font-merriweather font-bold text-[24px] text-darkpurple"
            />
         </div>
      </div>
   );
}

export function PeriodStep({ startDate, endDate, onChangeStartDate, onChangeEndDate }: PeriodStepProps) {
   const isContinuous = endDate === null;

   const matchesDuration = (days: number) =>
      endDate !== null && endDate === addDays(startDate, days);

   return (
      <div className="flex flex-col gap-6">

         <DateField label="Começa em" value={startDate} onChange={onChangeStartDate} />

         <div>
            <p className="font-inter text-[15px] text-ghostcolor mb-2">Por quanto tempo</p>
            <div className="flex gap-2 flex-wrap">
               <Chip
                  label="Sem data para acabar"
                  active={isContinuous}
                  onClick={() => onChangeEndDate(null)}
               />
               {DURATIONS.map(duration => (
                  <Chip
                     key={duration.days}
                     label={duration.label}
                     active={matchesDuration(duration.days)}
                     onClick={() => onChangeEndDate(addDays(startDate, duration.days))}
                  />
               ))}
            </div>
         </div>

         {!isContinuous && (
            <div className="animate-fade-slide-up">
               <DateField
                  label="Termina em"
                  value={endDate}
                  min={startDate}
                  onChange={(date) => onChangeEndDate(date)}
               />
            </div>
         )}
      </div>
   );
}
