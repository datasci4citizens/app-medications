import type { ReactNode } from 'react';

interface InfoTileProps {
   title: string;
   subtitle: string;
   icon?: ReactNode;
}

export function InfoTile({ title, subtitle, icon }: InfoTileProps) {

   return (
      <div className="w-full bg-offwhite rounded-[18px] border border-black/5 px-3.5 py-3">

         <div className="flex items-center gap-1.5 font-inter text-[12px] font-bold uppercase tracking-[0.08em] text-[#999]">
            {icon}
            {title}
         </div>

         <p className="font-merriweather font-extrabold text-[20px] text-inkblack mt-1 break-words">
            {subtitle}
         </p>

      </div>
   )

}
