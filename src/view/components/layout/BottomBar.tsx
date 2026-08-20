import { useNavigate, useLocation } from 'react-router-dom'
import type { ComponentType } from 'react'
import CapsuleIcon from '../../../assets/icons/svgs/capsule.svg?react'
import ProfileIcon from '../../../assets/icons/svgs/profile.svg?react'
import { FiBell, FiCalendar, FiPlus } from 'react-icons/fi'

interface NavItem {
   id: string;
   label: string;
   Icon: ComponentType<{ className?: string }>;
   path?: string;
}

const ITEMS: NavItem[] = [
   { id: 'home', label: 'Hoje', Icon: CapsuleIcon, path: '/home/medications' },
   { id: 'agenda', label: 'Agenda', Icon: FiCalendar },
   { id: 'alerts', label: 'Alertas', Icon: FiBell },
   { id: 'profile', label: 'Eu', Icon: ProfileIcon, path: '/home/profile' },
];

export function BottomBar() {
   const navigate = useNavigate()
   const location = useLocation()

   // Agenda e Alertas ainda não têm tela: entram desabilitados para não
   // prometerem navegação que não existe.
   const renderItem = (item: NavItem) => {
      const isActive = item.path ? location.pathname.includes(item.path) : false;
      const isDisabled = !item.path;

      return (
         <button
            key={item.id}
            disabled={isDisabled}
            onClick={() => item.path && navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-1.5 py-1.5 font-inter font-bold text-[13px] transition-colors duration-200
               ${isDisabled ? 'text-ghost-gray/50' : isActive ? 'text-darkpurple' : 'text-[#8a8a8a]'}`}
         >
            <item.Icon className="w-6 h-6" />
            {item.label}
         </button>
      );
   };

   return (
      <div
         className="fixed left-0 right-0 bottom-0 pt-2.5 pb-6 flex justify-around items-end z-5"
         style={{
            background: 'linear-gradient(180deg, rgba(239,239,239,0) 0%, rgba(239,239,239,0.92) 40%, rgba(239,239,239,1))',
         }}
      >
         {ITEMS.slice(0, 2).map(renderItem)}

         {/* Ação principal: buscar um medicamento para adicionar */}
         <button
            onClick={() => navigate('/search')}
            aria-label="Adicionar medicamento"
            className="w-[62px] h-[62px] mb-1.5 rounded-full bg-darkpurple text-offwhite flex items-center justify-center shrink-0 shadow-[0_10px_24px_rgba(91,42,120,0.45)] transition-transform active:scale-90"
         >
            <FiPlus size={28} />
         </button>

         {ITEMS.slice(2).map(renderItem)}
      </div>
   )
}
