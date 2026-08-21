interface ToggleSwitchProps {
   label: string;
   onClick: () => void;
   value: boolean;
}

export function ToggleSwitch({ label, onClick, value }: ToggleSwitchProps) {
   return (
      <button
         onClick={onClick}
         role="switch"
         aria-checked={value}
         className="w-full flex justify-between items-center gap-4 text-left"
      >
         <span className="font-merriweather font-bold text-[19px] text-inkblack">{label}</span>

         <span
            className={`relative w-19 h-11 rounded-full shrink-0 transition-colors duration-200
               ${value ? 'bg-green-take' : 'bg-ghost-gray/40'}`}
         >
            {/* Ligado à direita, desligado à esquerda — o sentido esperado */}
            <span
               className={`absolute top-1 w-9 h-9 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]
                  transition-[left] duration-200 ease-[cubic-bezier(.32,.72,0,1)]
                  ${value ? 'left-9' : 'left-1'}`}
            />
         </span>
      </button>
   );
}
