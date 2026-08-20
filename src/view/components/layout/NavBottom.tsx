
import backIcon from '../../../assets/icons/svgs/back.svg?react'
// Add Another Icons 
import nextIcon from '../../../assets/icons/svgs/back.svg?react'
import cancelIcon from '../../../assets/icons/svgs/back.svg?react'


interface NavBottomProps {
   OnClick: () => void;
   type: 'back' | 'next' | 'cancel';
   size?: number;
}

export function NavBottom({ OnClick, type, size = 32 }: NavBottomProps) {
   const icons = {
      back: backIcon,
      next: nextIcon,
      cancel: cancelIcon
   }

   const Icon = icons[type];

   return (
      <button
         className="bg-darkpurple text-offwhite rounded-full active:bg-offwhite active:text-darkpurple active:scale-90 transition-all duration-300 shadow-sm"
         style={{
            padding: `${size / 4}px`,
            width: `${size}px`,
            height: `${size}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
         }}
         onClick={OnClick}
      >
         <Icon
            width={size * 0.6}
            height={size * 0.6}
            className="transition-colors duration-300"
         />
      </button>
   )
}