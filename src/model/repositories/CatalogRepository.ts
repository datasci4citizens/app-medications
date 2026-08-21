import { apiGet, type Paginated } from '../services/api';
import type { MedicationInfo } from '../../types';

/** Um medicamento do catálogo da ANVISA, como a API o devolve. */
export interface CatalogMedication {
   medication_id: number;
   process_num: number;
   name: string | null;
   brand: string | null;
   company: string | null;
   category: string | null;
   therapeutic_class: string | null;
   dosage: string | null;
   formato: string | null;
   active_ingredients: string[];
   leaflet: CatalogLeaflet | null;
}

export interface CatalogLeaflet {
   indicacoes_para_uso: string;
   funcionamento_medicamento: string;
   quando_nao_usar: string;
   conhecimento_previo_necessario: string;
   como_guardar_medicamento: string;
   como_usar_medicamento: string;
   esqueceu_medicamento: string;
   efeitos_colaterais: string;
   quantidade_a_mais: string;
}

/**
 * Nome exibível.
 *
 * Nos dados da ANVISA o nome comercial cai ora em `name`, ora em `brand` —
 * nenhum dos dois sozinho cobre o catálogo, mas juntos cobrem tudo.
 */
export function displayName(med: CatalogMedication): string {
   return med.name?.trim() || med.brand?.trim() || 'Sem nome';
}

/** Princípios ativos vêm com espaços sobrando e repetições. */
export function activeIngredients(med: CatalogMedication): string[] {
   const seen = new Set<string>();
   return med.active_ingredients
      .map(i => i.trim())
      .filter(i => i && !seen.has(i.toLowerCase()) && seen.add(i.toLowerCase()));
}

export const catalogRepository = {
   search: (query: string, page = 1, signal?: AbortSignal) => {
      const params = new URLSearchParams({ page: String(page) });
      if (query.trim()) params.set('search', query.trim());
      return apiGet<Paginated<CatalogMedication>>(`/api/medication/?${params}`, signal);
   },

   getById: (id: string, signal?: AbortSignal) =>
      apiGet<CatalogMedication>(`/api/medication/${id}/`, signal),
};

/**
 * Converte um medicamento do catálogo para o formato que o app já usa.
 *
 * `formato` e `dosage` vêm vazios da ANVISA hoje, então caem em valores
 * neutros — quem preenche a dosagem é o próprio usuário, no cadastro.
 */
export function toMedicationInfo(med: CatalogMedication): MedicationInfo {
   const leaflet = med.leaflet;
   return {
      id: String(med.medication_id),
      name: displayName(med),
      activeIngredient: activeIngredients(med).join(', '),
      type: (med.formato as MedicationInfo['type']) ?? 'Comprimido',
      commonBrands: med.brand ? [med.brand] : undefined,
      instructions: leaflet?.como_usar_medicamento?.trim() || undefined,
      sideEffects: leaflet?.efeitos_colaterais?.trim() || undefined,
      contraindications: leaflet?.quando_nao_usar?.trim() || undefined,
   };
}
