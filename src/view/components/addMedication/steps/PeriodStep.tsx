import { ToggleSwitch } from "../../common/ToggleSwitch";

interface PeriodStepProps {
   startDate: string;
   endDate: string | null;
   onChangeStartDate: (date: string) => void;
   onChangeEndDate: (date: string | null) => void;
}

export function PeriodStep({ startDate, endDate, onChangeStartDate, onChangeEndDate }: PeriodStepProps) {
   const hasEndDate = endDate !== null;
   const today = new Date().toISOString().slice(0, 10);

   const handleToggleEndDate = () => {
      if (hasEndDate) {
         onChangeEndDate(null);
      } else {
         onChangeEndDate(startDate);
      }
   };

   return (
      <div className="flex flex-col gap-4">
         <div>
            <label className="font-merriweather text-base text-ghostcolor mb-1 block">Data de início</label>
            <input
               type="date"
               value={startDate}
               onChange={(e) => onChangeStartDate(e.target.value)}
               className="w-full h-12 px-3 rounded-[10px] bg-lilac text-inkblack text-2xl border-b-4 border-darkpurple font-merriweather outline-none"
            />
         </div>

         <ToggleSwitch
            label="Tem data de término?"
            value={hasEndDate}
            onClick={handleToggleEndDate}
         />

         {hasEndDate && (
            <div>
               <label className="font-merriweather text-base text-ghostcolor mb-1 block">Data de fim</label>
               <input
                  type="date"
                  value={endDate ?? today}
                  min={startDate}
                  onChange={(e) => onChangeEndDate(e.target.value)}
                  className="w-full h-12 px-3 rounded-[10px] bg-lilac text-inkblack text-2xl border-b-4 border-darkpurple font-merriweather outline-none"
               />
            </div>
         )}
      </div>
   );
}
