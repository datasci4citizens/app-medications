import { useState, type ReactNode } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface AccordionSectionProps {
   label: string;
   children: ReactNode;
   /** Quando false, a seção fica sempre aberta e sem botão. */
   hasToggle?: boolean;
}

export function AccordionSection({
   label,
   children,
   hasToggle = false,
}: AccordionSectionProps) {

   const [isOpen, setIsOpen] = useState<boolean>(false);
   const isExpanded = hasToggle ? isOpen : true;

   const header = (
      <>
         <span className="flex-1 text-left font-merriweather font-extrabold text-[18px] text-inkblack">
            {label}
         </span>
         {hasToggle && (
            <FiChevronDown
               size={22}
               className={`text-darkpurple shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            />
         )}
      </>
   );

   return (
      <div className="bg-offwhite rounded-[22px] border border-black/5 overflow-hidden">

         {hasToggle ? (
            <button
               onClick={() => setIsOpen(!isOpen)}
               aria-expanded={isOpen}
               className="w-full flex items-center gap-3 px-4.5 py-4"
            >
               {header}
            </button>
         ) : (
            <div className="flex items-center gap-3 px-4.5 py-4">{header}</div>
         )}

         {/* grid-rows anima até a altura real do conteúdo, sem chutar um max-height */}
         <div
            className={`grid transition-[grid-template-rows] duration-400 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
         >
            <div className="overflow-hidden">
               <div className="px-4.5 pb-4 font-inter text-[16px] leading-[1.55] text-inkblack">
                  {children}
               </div>
            </div>
         </div>

      </div>
   )
}
