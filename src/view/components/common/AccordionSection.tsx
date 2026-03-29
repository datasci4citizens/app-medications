
import { FaChevronDown } from 'react-icons/fa6';

import { useState } from 'react';

interface AccordionSectionProps {
   label: string;
   children: React.ReactNode;
   hasToggle?: boolean;
}

export function AccordionSection({
   label,
   children,
   hasToggle = false,
}: AccordionSectionProps) {

   const [isOpen, setIsOpen] = useState<boolean>(false);

   function handleToogleList() {
      setIsOpen(!isOpen);
   }


   return (
      <div className='font-merriweather '>
         <div className='flex  font-inkblack justify-between bg-lightpurple rounded-[10px] text-2xl px-3 h-12 tracking-[-0.288px] items-center'>  {label}
            {hasToggle &&
               <button
                  aria-label={`${isOpen ? 'Recolher' : 'Expandir'} ${label}`}
                  aria-expanded={isOpen}
                  // pl-40 para aumentar area clicavel do botão TODO:verificar responsividade
                  className='  h-full pl-30 flex items-center '
                  onClick={handleToogleList}>
                  <FaChevronDown
                     className={`
                  fill-darkpurple stroke-[3px]
                  transition-transform duration-500 
                  ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
               </button>}
         </div>
         <div className={` transition-[max-height] duration-600 ease-in-out overflow-hidden
            ${isOpen ? 'max-h-125' : 'max-h-0'}
            `}>

            <div className='p-4'> {children}</div>
         </div>
      </div>
   )
}