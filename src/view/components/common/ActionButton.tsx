
interface ActionButtonProps {
   label: string;
   onClick: () => void;
   variant: "success" | "warning" | "disabled" | "ghost" | "add"
}


export function ActionButton({ label, onClick, variant }: ActionButtonProps) {
   const variantColor = {
      success: "bg-green-take text-offwhite",
      warning: "bg-yellow-alert text-inkblack",
      disabled: "bg-ghost-gray text-",
      ghost: "border-2 border-ghostcolor text-ghostcolor",
      add: "bg-blue-add text-offwhite"
   }

   return (
      <button className={`
   w-full h-14 rounded-full
   font-merriweather text-2xl
   transform-bg
   transition-all duration-200 ease-in-out
   active:scale-90
   active:brightness-75
   ${variantColor[variant]}
   `}
      onClick={onClick}
      
      >
         {label}
      </button>);
}