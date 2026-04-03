
interface ToggleSwitchProps {
   label: string;
   onClick: () => void;
   value: boolean
}


export function ToggleSwitch({ label, onClick, value }: ToggleSwitchProps) {


   return (
      <div className="flex justify-between items-center text-[20px]">
         {label}
         <div className="h-11 bg-[#ebe7ee]  w-20 rounded-4xl border-darkpurple border-b-3"
         onClick={onClick}
         > 
            <div className={` rounded-full bg-darkpurple w-10 h-10
            transition-transform duration-250 ease-in-out active:scale-90
            ${value ? 'translate-x-0 bg-offwhite border-2 border-lightpurple': "translate-x-10"}
            `
            }/>

         </div>
      </div>
   )
}