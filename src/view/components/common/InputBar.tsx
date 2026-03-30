import { useState } from "react";

type BaseProps = {
   label?: string;
   isReadOnly?: boolean;
   example?: string;
};

/* =========================
   🧱 BASE
========================= */
function BaseContainer({ children }: { children: React.ReactNode }) {
   return (
      <div className="w-full h-12 flex rounded-[10px] bg-lilac text-ghostwhite px-2 text-2xl border-b-4 border-darkpurple">
         {children}
      </div>
   );
}

/* =========================
   👁️ DISPLAY
========================= */

/**
 * NumberDisplay
 *
 * Read-only display bar showing a number with an optional label.
 * Use this when the value should never be editable.
 *
 * Props:
 *   - value: the number to display
 *   - label: optional unit shown after the number (e.g. "comprimidos")
 *
 * Usage:
 *   <NumberDisplay value={3} label="comprimidos" />
 *   <NumberDisplay value={500} />
 */
export function NumberDisplay({
   value,
   label
}: {
   value: number;
   label?: string;
}) {
   return (
      <BaseContainer>
         <span className="my-auto text-left">
            {value} {label}
         </span>
      </BaseContainer>
   );
}

/* =========================
   🔢 NUMBER INPUT
========================= */

/**
 * NumberInput
 *
 * An input bar that accepts only whole numbers. The input width
 * adjusts dynamically to the number of digits. An optional label
 * (e.g. "comprimidos") is displayed inline after the value.
 *
 * Props:
 *   - value: current number, or "" when the field is empty
 *   - onChange: called with the new number or "" when cleared
 *   - label: optional unit shown after the input (e.g. "mg")
 *   - isReadOnly: when true, disables editing
 *   - example: placeholder text shown when the field is empty
 *
 * Usage:
 *   <NumberInput value={dose} onChange={setDose} label="comprimidos" example="0" />
 *   <NumberInput value={3} onChange={setDose} isReadOnly={true} />
 */
// TODO: CORRIGIR BUG DE ESPAÇAMENTO
export function NumberInput({
   value,
   onChange,
   label,
   isReadOnly,
   example
}: BaseProps & {
   value: number | "";
   onChange: (value: number | "") => void;
}) {

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      if (inputValue === "") {
         onChange("");
         return;
      }

      if (!/^\d+$/.test(inputValue)) return;

      onChange(Number(inputValue));
   };

   const currentText = value !== "" ? String(value) : (example || "0");
   
   const dynamicWidth = `${currentText.length + 0.5  - 0.1 }ch`;

   return (
      <BaseContainer>
         <input
            className={`
               outline-none 
               placeholder:text-ghostwhite
               bg-transparent
               /* Centraliza o texto e remove o w-full para ele respeitar o style */
               
               ${isReadOnly ? "select-none pointer-events-none" : ""}
            `}
            style={{ width: dynamicWidth }}
            
            inputMode="numeric"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={example}
            readOnly={isReadOnly}
         />

         {/* whitespace-nowrap garante que o label não quebre de linha se o número for gigante */}
         {label && <span className="my-auto  whitespace-nowrap">{label}</span>}
      </BaseContainer>
   );
}
/* =========================
   🔤 TEXT INPUT
========================= */

/**
 * TextInput
 *
 * A free-text input bar. Placeholder is hidden while the field is focused.
 *
 * Props:
 *   - value: current string value
 *   - onChange: called with the new string on every keystroke
 *   - isReadOnly: when true, disables editing
 *   - example: placeholder text shown when the field is empty and unfocused
 *
 * Usage:
 *   <TextInput value={name} onChange={setName} example="Nome do medicamento" />
 *   <TextInput value="Paracetamol" onChange={setName} isReadOnly={true} />
 */
export function TextInput({
   value,
   onChange,
   isReadOnly,
   example
}: BaseProps & {
   value: string;
   onChange: (value: string) => void;
}) {

   const [isFocused, setIsFocused] = useState(false);

   return (
      <BaseContainer>
         <input
            className={`
               outline-none 
               placeholder:text-ghostwhite
               ${isReadOnly ? "select-none pointer-events-none w-5 text-center" : "w-full"}
            `}
            inputMode="text"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={isFocused ? "" : example}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            readOnly={isReadOnly}
         />
      </BaseContainer>
   );
}