import { AccordionSection } from '../common/AccordionSection';
import type { CatalogLeaflet } from '../../../model/repositories/CatalogRepository';

interface LeafletSectionsProps {
   leaflet: CatalogLeaflet | null | undefined;
}

/** Ordem de leitura: o que a pessoa mais precisa saber vem primeiro. */
const SECTIONS: { label: string; field: keyof CatalogLeaflet }[] = [
   { label: 'Para que serve', field: 'indicacoes_para_uso' },
   { label: 'Como usar', field: 'como_usar_medicamento' },
   { label: 'Se esquecer uma dose', field: 'esqueceu_medicamento' },
   { label: 'Quando não usar', field: 'quando_nao_usar' },
   { label: 'Efeitos colaterais', field: 'efeitos_colaterais' },
   { label: 'Se tomar demais', field: 'quantidade_a_mais' },
   { label: 'Como funciona', field: 'funcionamento_medicamento' },
   { label: 'Antes de usar', field: 'conhecimento_previo_necessario' },
   { label: 'Como guardar', field: 'como_guardar_medicamento' },
];

/**
 * A bula da ANVISA em blocos recolhidos.
 *
 * Os textos passam de dois mil caracteres em várias seções, então nada fica
 * aberto por padrão. Seções em branco não aparecem: a base deixa várias vazias.
 */
export function LeafletSections({ leaflet }: LeafletSectionsProps) {
   if (!leaflet) return null;

   const filled = SECTIONS.filter(section => leaflet[section.field]?.trim());

   if (filled.length === 0) {
      return (
         <p className="font-inter text-[15px] text-ghostcolor text-center py-4">
            Este medicamento ainda não tem bula cadastrada.
         </p>
      );
   }

   return (
      <div className="flex flex-col gap-2.5">
         {filled.map(section => (
            <AccordionSection key={section.field} label={section.label} hasToggle={true}>
               <p className="whitespace-pre-line">{leaflet[section.field].trim()}</p>
            </AccordionSection>
         ))}
      </div>
   );
}
