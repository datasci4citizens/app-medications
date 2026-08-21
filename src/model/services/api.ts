import { authStorage } from '../repositories/AuthRepository';

/** VITE_API_URL pode vir com barra no fim; normaliza para não gerar '//'. */
const BASE_URL = String(import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export class ApiError extends Error {
   status: number;

   constructor(status: number, message: string) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
   }
}

/**
 * Chamada autenticada à API.
 *
 * O login com Google devolve um token do DRF, não JWT: o prefixo do header
 * precisa ser `Token`, e não `Bearer`, senão a API responde 401.
 */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
   if (!BASE_URL) {
      throw new ApiError(0, 'VITE_API_URL não está configurada.');
   }

   const token = authStorage.getToken();

   const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
         'Content-Type': 'application/json',
         ...(token ? { Authorization: `Token ${token}` } : {}),
      },
      signal,
   });

   if (response.status === 401) {
      throw new ApiError(401, 'Sua sessão expirou. Entre novamente.');
   }

   if (!response.ok) {
      throw new ApiError(response.status, `A busca falhou (${response.status}).`);
   }

   return response.json() as Promise<T>;
}

/** Formato padrão de listagem paginada do Django REST Framework. */
export interface Paginated<T> {
   count: number;
   next: string | null;
   previous: string | null;
   results: T[];
}
