
import backIcon from '../../../assets/icons/svgs/back.svg?react'
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
   className="bg-darkpurple text-offwhite rounded-full active:bg-offwhite active:text-darkpurple active:scale-105 transition-all duration-300 shadow-sm"
   style={{
      padding: `${size / 10}px`,
      width: `${size}px`,
      height: `${size}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
   }}
   onClick={OnClick}
>
   <Icon
      width={size * 0.7}
      height={size * 0.7}
      className="transition-colors duration-300"
   />
</button>
   )
}