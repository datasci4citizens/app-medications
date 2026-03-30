

interface InfoTileProps {
   title: string;
   value: string;
   accentColor?: string;
}

export function InfoTile({ title, value, accentColor }: InfoTileProps) {

   return (
      <div className="w-42.5 h-21 bg-offwhite rounded-[10px] border-b-4 flex justify-between font-merriweather border-darkpurple px-3 ">

         <div className="py-3">
            <h1 className="text-[#6d6d6d] text-[20px]">
               {title}
            </h1>
            <p className="text-inkblack text-[20px]">
               {value}
            </p>
         </div>
         {accentColor && 
         <div 
         // bg-[${accentColor}] not works in runtime
         className={`h-full w-5 `}
         
         style={{ backgroundColor: accentColor }}
> 
         
         </div>}
      </div>
   )

}