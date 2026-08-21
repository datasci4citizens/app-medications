import { useEffect, useState } from 'react';
import { catalogRepository, type CatalogMedication } from '../../model/repositories/CatalogRepository';
import { ApiError } from '../../model/services/api';

interface CatalogMedicationState {
   medication: CatalogMedication | null;
   isLoading: boolean;
   error: string | null;
}

/** Carrega um medicamento do catálogo da API pelo seu id. */
export function useCatalogMedication(id: string | undefined) {
   const [state, setState] = useState<CatalogMedicationState>({
      medication: null, isLoading: true, error: null,
   });

   useEffect(() => {
      if (!id) {
         setState({ medication: null, isLoading: false, error: 'Medicamento não informado.' });
         return;
      }

      const controller = new AbortController();
      setState({ medication: null, isLoading: true, error: null });

      catalogRepository.getById(id, controller.signal)
         .then(medication => setState({ medication, isLoading: false, error: null }))
         .catch(err => {
            if (controller.signal.aborted) return;
            setState({
               medication: null,
               isLoading: false,
               error: err instanceof ApiError && err.status === 404
                  ? 'Medicamento não encontrado no catálogo.'
                  : err instanceof ApiError ? err.message : 'Não foi possível carregar agora.',
            });
         });

      return () => controller.abort();
   }, [id]);

   return state;
}
