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
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
   if (!BASE_URL) {
      throw new ApiError(0, 'VITE_API_URL não está configurada.');
   }

   const token = authStorage.getToken();

   const response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
         'Content-Type': 'application/json',
         ...(token ? { Authorization: `Token ${token}` } : {}),
      },
   });

   if (response.status === 401) {
      throw new ApiError(401, 'Sua sessão expirou. Entre novamente.');
   }

   if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new ApiError(response.status, detail || `A requisição falhou (${response.status}).`);
   }

   return response.json() as Promise<T>;
}

export function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
   return request<T>(path, { signal });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
   return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
   return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
}

export function apiDelete(path: string): Promise<unknown> {
   return request(path, { method: 'DELETE' }).catch((err) => {
      // DELETE devolve 204 sem corpo; o parse do JSON falha e não é erro.
      if (err instanceof SyntaxError) return null;
      throw err;
   });
}

/** Formato padrão de listagem paginada do Django REST Framework. */
export interface Paginated<T> {
   count: number;
   next: string | null;
   previous: string | null;
   results: T[];
}
