interface RadioOptionProps {
   label: string;
   selected: boolean;
   onClick: () => void;
}

export function RadioOption({ label, selected, onClick }: RadioOptionProps) {
   return (
      <button
         onClick={onClick}
         aria-pressed={selected}
         className={`w-full flex items-center gap-3.5 px-4 py-4 rounded-[18px] text-left
            font-merriweather font-bold text-[19px]
            transition-all duration-200 active:scale-[0.98]
            ${selected
               ? 'bg-darkpurple text-offwhite -translate-y-0.5 shadow-[0_6px_14px_rgba(91,42,120,0.30)]'
               : 'bg-ghostwhite text-darkpurple'}`}
      >
         <span
            className={`w-7 h-7 rounded-full border-2 shrink-0 flex items-center justify-center
               ${selected ? 'border-offwhite' : 'border-darkpurple'}`}
         >
            {selected && <span className="w-3 h-3 rounded-full bg-offwhite" />}
         </span>
         <span className="flex-1">{label}</span>
      </button>
   );
}
