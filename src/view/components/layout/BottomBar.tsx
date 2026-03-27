import { useNavigate, useLocation } from 'react-router-dom'
import CapsuleIcon from '../../../assets/icons/svgs/capsule.svg?react'
import ProfileIcon from '../../../assets/icons/svgs/profile.svg?react'
import { FiPlus } from 'react-icons/fi'


export function BottomBar() {
   const navigate = useNavigate()
   const location = useLocation()

   const isMedications = location.pathname.includes('/home/medications')

   return (
      <div className="fixed bottom-6 left-0 right-0 px-6 flex items-center justify-between">

         {/* Segmented Control */}
         <div
            className="relative flex items-center bg-offwhite overflow-hidden"
            style={{
               width: '280px',
               height: '86px',
               borderRadius: '48px'
            }}
         >

            {/* Sliding indicator */}
            <div
               className="absolute top-0 left-0 bg-darkpurple transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]"
               style={{
                  width: '153px',
                  height: '86px',
                  borderRadius: '48px',
                  transform: isMedications
                     ? 'translateX(0px)'
                     : 'translateX(127px)'
               }}
            />

            {/* Medicamentos */}
            <button
               onClick={() => navigate('/home/medications')}
               className={`relative z-10 flex flex-col items-center justify-center w-[140px] h-[86px] transition-colors
          ${isMedications ? 'text-offwhite' : 'text-inkblack'}`}
            >
               <CapsuleIcon className="w-8 " />
               <span className="font-bold text-[16px]">
                  Medicamentos
               </span>
            </button>

            {/* Perfil */}
            <button
               onClick={() => navigate('/home/profile')}
               className={`relative z-10 flex flex-col items-center justify-center w-[140px] h-[86px] transition-colors
          ${!isMedications ? 'text-offwhite' : 'text-inkblack'}`}
            >
               {/* <FiUser size={24} /> */}
               <ProfileIcon className="w-6 h-6" />
               <span className="font-bold text-[16px]">
                  Perfil
               </span>
            </button>

         </div>

         {/* Plus button */}
         <button
            onClick={() => navigate('/search')}
            className="bg-darkpurple text-offwhite flex items-center justify-center"
            style={{
               width: '86px',
               height: '86px',
               borderRadius: '50%'
            }}
         >
            <FiPlus size={32} />
         </button>

      </div>
   )
}