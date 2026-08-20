

interface InfoTileProps {
   title: string;
   subtitle: string;
   accentColor?: string;
}

export function InfoTile({ title, subtitle, accentColor }: InfoTileProps) {

   return (
      <div className="w-full  min-h-21 bg-offwhite rounded-[10px] border-b-4 flex justify-between font-merriweather border-darkpurple px-3 ">

         <div className="py-3">
            <h1 className="text-[#6d6d6d] text-[20px] text-balance">
               {title}
            </h1>
            <p className="text-inkblack text-[20px] text-balance">
               {subtitle}
            </p>
         </div>
         {accentColor && 
         <div 
         // bg-[${accentColor}] not works in runtime
         className={`h-full `}
         
         style={{ backgroundColor: accentColor }}
> 
         
         </div>}
      </div>
   )

}