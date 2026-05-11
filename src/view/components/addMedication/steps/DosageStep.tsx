import { TextInput } from "../../common/InputBar";

interface DosageStepProps {
   value: string;
   typeHint: string | undefined;
   onChange: (dosage: string) => void;
}

export function DosageStep({ value, typeHint, onChange }: DosageStepProps) {
   const examples: Record<string, string> = {
      'Comprimido': 'Ex: 500mg',
      'Cápsula': 'Ex: 20mg',
      'Líquido': 'Ex: 10ml',
      'Injeção': 'Ex: 100UI',
      'Ampola': 'Ex: 5ml',
   };
   const example = (typeHint && examples[typeHint]) || 'Ex: 500mg';

   return (
      <div className="flex flex-col gap-3">
         <TextInput value={value} onChange={onChange} example={example} />
         <p className="font-merriweather text-base text-ghostcolor">
            Informe a quantidade de cada dose. Exemplo: 500mg, 1 comprimido, 10ml.
         </p>
      </div>
   );
}
