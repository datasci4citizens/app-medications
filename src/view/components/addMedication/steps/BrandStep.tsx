import { useState } from "react";
import { RadioOption } from "../RadioOption";
import { TextInput } from "../../common/InputBar";

interface BrandStepProps {
   value: string;
   suggestions: string[];
   onChange: (brand: string) => void;
}

const OTHER = '__other__';

export function BrandStep({ value, suggestions, onChange }: BrandStepProps) {
   const [showCustom, setShowCustom] = useState(() => value.length > 0 && !suggestions.includes(value));

   const handleSelect = (option: string) => {
      if (option === OTHER) {
         setShowCustom(true);
         onChange('');
         return;
      }
      setShowCustom(false);
      onChange(option);
   };

   return (
      <div className="flex flex-col gap-2">
         {suggestions.map(brand => (
            <RadioOption
               key={brand}
               label={brand}
               selected={!showCustom && value === brand}
               onClick={() => handleSelect(brand)}
            />
         ))}
         <RadioOption
            label="Outra"
            selected={showCustom}
            onClick={() => handleSelect(OTHER)}
         />
         {showCustom && (
            <div className="mt-2 px-11">
               <TextInput value={value} onChange={onChange} example="Digite a marca" />
            </div>
         )}
      </div>
   );
}
