import type { MedicationInfo } from '../../../types';

interface PillTypeIconProps {
   type: MedicationInfo['type'];
   size?: number;
}

/** Desenho da forma farmacêutica: comprimido, cápsula, líquido ou injetável. */
export function PillTypeIcon({ type, size = 22 }: PillTypeIconProps) {
   const common = {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
   };

   switch (type) {
      case 'Comprimido':
         return (
            <svg {...common}>
               <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
               <path d="M3 12h18" stroke="currentColor" strokeWidth="2" />
            </svg>
         );

      case 'Cápsula':
         return (
            <svg {...common}>
               <rect x="3" y="8" width="18" height="8" rx="4" stroke="currentColor" strokeWidth="2" />
               <path d="M12 8v8" stroke="currentColor" strokeWidth="2" />
            </svg>
         );

      case 'Líquido':
         return (
            <svg {...common}>
               <path
                  d="M8 3h8v3a6 6 0 01-1 3l-1 1v6a3 3 0 01-3 3 3 3 0 01-3-3v-6L7 9a6 6 0 01-1-3V3z"
                  stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
               />
            </svg>
         );

      case 'Injeção':
      case 'Ampola':
         return (
            <svg {...common}>
               <path
                  d="M14 3l7 7-2 2-2-2-8 8-3 1 1-3 8-8-2-2 1-3z"
                  stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
               />
            </svg>
         );

      default:
         return (
            <svg {...common}>
               <rect x="3" y="8" width="18" height="8" rx="4" stroke="currentColor" strokeWidth="2" />
            </svg>
         );
   }
}
