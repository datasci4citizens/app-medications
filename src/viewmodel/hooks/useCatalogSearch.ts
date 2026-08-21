import { useEffect, useState } from 'react';
import { catalogRepository, type CatalogMedication } from '../../model/repositories/CatalogRepository';
import { ApiError } from '../../model/services/api';

const DEBOUNCE_MS = 350;

interface CatalogSearchState {
   results: CatalogMedication[];
   count: number;
   isLoading: boolean;
   error: string | null;
}

/**
 * Busca no catálogo da API.
 *
 * Espera o usuário parar de digitar antes de chamar, e aborta a requisição
 * anterior a cada nova: sem isso, uma resposta lenta de uma busca antiga pode
 * chegar depois da nova e sobrescrever a lista com o resultado errado.
 */
export function useCatalogSearch(query: string) {
   const [state, setState] = useState<CatalogSearchState>({
      results: [], count: 0, isLoading: true, error: null,
   });

   useEffect(() => {
      const controller = new AbortController();

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const timer = setTimeout(async () => {
         try {
            const page = await catalogRepository.search(query, 1, controller.signal);
            setState({ results: page.results, count: page.count, isLoading: false, error: null });
         } catch (err) {
            if (controller.signal.aborted) return;
            setState({
               results: [], count: 0, isLoading: false,
               error: err instanceof ApiError ? err.message : 'Não foi possível buscar agora.',
            });
         }
      }, DEBOUNCE_MS);

      return () => {
         clearTimeout(timer);
         controller.abort();
      };
   }, [query]);

   return state;
}
