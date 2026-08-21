import type { AddMedicationFormData } from "../../../../viewmodel/hooks/useAddMedication";

interface ConfirmStepProps {
   formData: AddMedicationFormData;
   medicationName: string;
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatWeekDays(days: number[]): string {
   if (days.length === 7) return 'Todos os dias';
   if (days.length === 5 && [1, 2, 3, 4, 5].every(d => days.includes(d))) return 'Dias úteis';
   if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Fins de semana';
   return [...days].sort().map(d => WEEKDAY_LABELS[d]).join(', ');
}

function formatDate(iso: string): string {
   const [y, m, d] = iso.split('-');
   return `${d}/${m}/${y}`;
}

export function ConfirmStep({ formData, medicationName }: ConfirmStepProps) {
   const schedule = formData.scheduleType === 'fixed'
      ? formData.times.join(', ')
      : `A cada ${formData.intervalHours}h, a partir das ${formData.startTime}`;

   return (
      <div className="flex flex-col gap-4">

         {/* O nome fica fora da lista: é o que a pessoa confere primeiro */}
         <div className="bg-lightpurple rounded-[22px] px-5 py-4">
            <p className="font-inter text-[13px] font-bold uppercase tracking-[0.1em] text-darkpurple/70">
               Medicamento
            </p>
            <p className="font-merriweather font-extrabold text-[24px] text-deepplum leading-tight mt-1">
               {medicationName}
            </p>
            {formData.dosage && (
               <p className="font-merriweather font-bold text-[19px] text-purple-dose mt-0.5">
                  {formData.dosage}
               </p>
            )}
         </div>

         <div className="bg-ghostwhite rounded-[22px] border border-[rgba(91,42,120,0.10)] px-5 py-4 flex flex-col gap-3.5">
            {formData.brand && <><Row label="Marca" value={formData.brand} /><Divider /></>}
            <Row label="Dias" value={formatWeekDays(formData.weekDays)} />
            <Divider />
            <Row label="Horários" value={schedule} />
            <Divider />
            <Row label="Começa em" value={formatDate(formData.startDate)} />
            <Divider />
            <Row label="Termina em" value={formData.endDate ? formatDate(formData.endDate) : 'Sem data'} />
            <Divider />
            <Row label="Estoque" value={`${formData.currentStock} unidades`} />
            {formData.stockReminderEnabled && (
               <>
                  <Divider />
                  <Row label="Avisar quando restar" value={`${formData.stockReminderThreshold} unidades`} />
               </>
            )}
         </div>

         <p className="font-inter text-[15px] text-ghostcolor text-center">
            Você pode alterar tudo isso depois.
         </p>
      </div>
   );
}

function Row({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex justify-between items-baseline gap-4">
         <span className="font-inter text-[15px] text-ghostcolor shrink-0">{label}</span>
         <span className="font-merriweather font-bold text-[18px] text-darkpurple text-right">{value}</span>
      </div>
   );
}

function Divider() {
   return <div className="h-px bg-[rgba(91,42,120,0.10)]" />;
}
