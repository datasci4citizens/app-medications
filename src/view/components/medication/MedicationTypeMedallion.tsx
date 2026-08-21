import { PillTypeIcon } from "./PillTypeIcon";
import type { MedicationInfo } from "../../../types";

interface MedicationTypeMedallionProps {
   type: MedicationInfo['type'];
   size?: number;
   className?: string;
}

/**
 * Selo de vidro fosco com o desenho da forma farmacêutica (o mesmo glifo
 * do PillTypeIcon), usado como destaque no cabeçalho do medicamento.
 * Por ser translúcido, ele se mescla com a cor do cabeçalho em vez de
 * competir com ela — o mesmo tratamento já usado no botão de voltar.
 */
export function MedicationTypeMedallion({ type, size = 88, className = '' }: MedicationTypeMedallionProps) {
   return (
      <span className={`block shrink-0 ${className}`} style={{ width: size, height: size }}>
         <span className="relative flex items-center justify-center text-white rounded-full overflow-hidden w-full h-full bg-white/25 backdrop-blur-md border border-white/25">
            <span className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent to-60%" />
            <PillTypeIcon type={type} size={size * 0.46} />
         </span>
      </span>
   );
}
