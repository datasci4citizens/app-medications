// src/utils/storage.ts

/**
 * STORAGE SIMPLES
 * 
 * Abstrai o localStorage para facilitar:
 * 1. Tratamento de erros
 * 2. Conversão JSON automática
 * 3. Migração futura para Capacitor (se necessário)
 */

// ============================================
// FUNÇÕES GENÉRICAS
// ============================================

export const storage = {
  // Salvar qualquer coisa
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  },

  // Buscar qualquer coisa
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erro ao buscar:', error);
      return null;
    }
  },

  // Remover
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover:', error);
    }
  },

  // Limpar tudo
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar:', error);
    }
  },
};

// ============================================
// FUNÇÕES ESPECÍFICAS (para facilitar uso)
// ============================================

// Autenticação
export const authStorage = {
  saveToken: (token: string) => storage.set('auth_token', token),
  getToken: () => storage.get<string>('auth_token'),
  removeToken: () => storage.remove('auth_token'),

  saveUser: (user: any) => storage.set('user', user),
  getUser: () => storage.get('user'),
  removeUser: () => storage.remove('user'),

  clearAuth: () => {
    authStorage.removeToken();
    authStorage.removeUser();
  },
};

// Medicamentos

import type { Medication } from '../types';



export const medicationStorage = {

  saveMedications: (medications: Medication[]) => storage.set('my_medications', medications),

  getMedications: () => storage.get<Medication[]>('my_medications') || [],

  clear: () => storage.remove('my_medications'),

};