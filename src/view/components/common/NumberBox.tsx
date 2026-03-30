/**
 * NumberBox
 *
 * A compact numeric input displayed as a small square box.
 * Accepts only valid numbers and clears to null when empty.
 *
 * Props:
 *   - value: current number value (null renders an empty box)
 *   - onChange: called with the new number, or null if cleared
 *   - isReadOnly: when true, disables editing and text selection
 *
 * Usage:
 *   <NumberBox value={3} onChange={setDose} isReadOnly={false} />
 *   <NumberBox value={5} isReadOnly={true} />
 */
interface NumberBoxProps {
  value?: number | null;
  onChange?: (value: number | null) => void;
  isReadOnly?: boolean;
}

export function NumberBox({
  value,
  onChange,
  isReadOnly = false,
}: NumberBoxProps) {
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Se vazio → null
    if (inputValue === "") {
      onChange?.(null);
      return;
    }

    const parsed = Number(inputValue);

    // Se não for número válido → ignora
    if (Number.isNaN(parsed)) {
      // onChange?.(null);
      return;
    }

    onChange?.(parsed);
  };

  return (
      <input
      className={`
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        bg-lilac w-18 h-12
        rounded-[10px]
        text-center
        text-ghostwhite
        text-2xl
        border-b-4
        border-darkpurple
        placeholder:text-ghostwhite
        ${isReadOnly ? "select-none pointer-events-none": ''}
        `
      }
      onChange={handleChange}
      readOnly={isReadOnly}
      type="number"
      value={value ?? ""}
      placeholder="0"
      inputMode="numeric"
      // Bloquear Selecioanar
      onContextMenu={isReadOnly ? event => event.preventDefault() : undefined}
    />
   //  Todo: Analisar se precisa impedir colocar Strings 
  );
}