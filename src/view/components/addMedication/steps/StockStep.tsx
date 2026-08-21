import { ToggleSwitch } from "../../common/ToggleSwitch";
import { NumberInput } from "../../common/InputBar";

interface StockStepProps {
   currentStock: number;
   reminderEnabled: boolean;
   reminderThreshold: number;
   onChangeCurrentStock: (value: number) => void;
   onChangeReminderEnabled: (value: boolean) => void;
   onChangeReminderThreshold: (value: number) => void;
}

export function StockStep({
   currentStock,
   reminderEnabled,
   reminderThreshold,
   onChangeCurrentStock,
   onChangeReminderEnabled,
   onChangeReminderThreshold,
}: StockStepProps) {
   return (
      <div className="flex flex-col gap-5">
         <div>
            <p className="font-inter text-[15px] text-ghostcolor mb-1">Quantos você tem agora</p>
            <NumberInput
               value={currentStock}
               onChange={(v) => onChangeCurrentStock(typeof v === 'number' ? v : 0)}
               label="unidades"
               example="0"
            />
         </div>

         <ToggleSwitch
            label="Avisar quando o estoque acabar"
            value={reminderEnabled}
            onClick={() => onChangeReminderEnabled(!reminderEnabled)}
         />

         {reminderEnabled && (
            <div className="animate-fade-slide-up">
               <p className="font-inter text-[15px] text-ghostcolor mb-1">Avisar quando restar</p>
               <NumberInput
                  value={reminderThreshold}
                  onChange={(v) => onChangeReminderThreshold(typeof v === 'number' ? v : 0)}
                  label="unidades"
                  example="5"
               />
            </div>
         )}
      </div>
   );
}
