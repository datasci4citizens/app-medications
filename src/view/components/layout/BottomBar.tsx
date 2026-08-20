import { useNavigate, useLocation } from 'react-router-dom'
import CapsuleIcon from '../../../assets/icons/svgs/capsule.svg?react'
import ProfileIcon from '../../../assets/icons/svgs/profile.svg?react'
import { FiPlus } from 'react-icons/fi'


export function BottomBar() {
   const navigate = useNavigate()
   const location = useLocation()

   const isMedications = location.pathname.includes('/home/medications')

   return (
      <div className="fixed bottom-5 left-0 right-0 px-5 flex items-center gap-3">

         {/* Segmented Control */}
         <div className="relative flex items-center bg-offwhite overflow-hidden flex-1 h-[86px] rounded-[48px] shadow-[0_4px_16px_rgba(0,0,0,0.10)]">

            {/* Sliding indicator */}
            <div
               className="absolute top-0 left-0 h-full bg-darkpurple transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]"
               style={{
                  width: '50%',
                  borderRadius: '48px',
                  transform: isMedications ? 'translateX(0%)' : 'translateX(100%)',
               }}
            />

            {/* Medicamentos */}
            <button
               onClick={() => navigate('/home/medications')}
               className={`relative z-10 flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors duration-200 ${isMedications ? 'text-offwhite' : 'text-ghost-gray'}`}
            >
               <CapsuleIcon className="w-9 h-9" />
               <span className="font-inter font-semibold text-[11px]">Medicamentos</span>
            </button>

            {/* Perfil */}
            <button
               onClick={() => navigate('/home/profile')}
               className={`relative z-10 flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors duration-200 ${!isMedications ? 'text-offwhite' : 'text-ghost-gray'}`}
            >
               <ProfileIcon className="w-9 h-9" />
               <span className="font-inter font-semibold text-[11px]">Perfil</span>
            </button>

         </div>

         {/* Plus button */}
         <button
            onClick={() => navigate('/search')}
            className="bg-darkpurple text-offwhite flex items-center justify-center rounded-full shadow-[0_10px_24px_rgba(91,42,120,0.45)] flex-shrink-0 transition-transform active:scale-90"
            style={{ width: '86px', height: '86px' }}
         >
            <FiPlus size={36} />
         </button>

      </div>
   )
}