interface RadioOptionProps {
   label: string;
   selected: boolean;
   onClick: () => void;
}

export function RadioOption({ label, selected, onClick }: RadioOptionProps) {
   return (
      <button
         onClick={onClick}
         className="w-full flex items-center gap-3 py-3 active:opacity-70"
      >
         <div
            className={`
               w-8 h-8 rounded-full border-2 border-darkpurple flex-shrink-0
               flex items-center justify-center
               ${selected ? 'bg-darkpurple' : 'bg-transparent'}
            `}
         >
            {selected && <div className="w-3 h-3 rounded-full bg-offwhite" />}
         </div>
         <div className="flex-1 border-b-2 border-darkpurple py-2 px-3 text-left font-merriweather text-xl text-inkblack">
            {label}
         </div>
      </button>
   );
}
