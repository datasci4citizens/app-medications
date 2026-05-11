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
   return (
      <div className="flex flex-col gap-3">
         <p className="font-merriweather text-base text-ghostcolor mb-2">
            Revise antes de adicionar.
         </p>

         <Row label="Medicamento" value={medicationName} />
         <Row label="Marca" value={formData.brand} />
         <Row label="Dosagem" value={formData.dosage} />
         <Row label="Dias" value={formatWeekDays(formData.weekDays)} />
         <Row
            label="Horários"
            value={
               formData.scheduleType === 'fixed'
                  ? formData.times.join(', ')
                  : `A cada ${formData.intervalHours}h, começando às ${formData.startTime}`
            }
         />
         <Row label="Início" value={formatDate(formData.startDate)} />
         <Row label="Fim" value={formData.endDate ? formatDate(formData.endDate) : 'Contínuo'} />
         <Row label="Estoque" value={`${formData.currentStock} unidades`} />
         {formData.stockReminderEnabled && (
            <Row label="Avisar em" value={`${formData.stockReminderThreshold} unidades`} />
         )}
      </div>
   );
}

function Row({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex justify-between items-center bg-lightpurple rounded-[10px] px-4 py-3">
         <span className="font-merriweather text-base text-ghostcolor">{label}</span>
         <span className="font-merriweather text-lg font-bold text-darkpurple text-right">{value}</span>
      </div>
   );
}
